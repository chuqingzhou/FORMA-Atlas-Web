// 类器官数据类型定义和工具函数

import { supabase } from './supabase'

// atlas_organoids 表类型（新数据源）
export interface AtlasOrganoid {
  id: string
  organoid_id: string
  scan_id: string
  connect_id: number | null
  batch_id: string | null
  line_id: string | null
  tracking_type: boolean
  tracked_id: string | null
  age: string | null
  diagnose: string | null
  region: string | null
  voxel_count: number | null
  volume: number | null
  sav_ratio: number | null
  sphericity: number | null
  intensity_mean: number | null
  inner_20_mean: number | null
  outer_20_mean: number | null
  intensity_cv: number | null
  radial_intensity_slope: number | null
  inner_outer_20_ratio: number | null
  created_at: string
}

// 兼容旧接口的别名
export type OrganoidDetail = AtlasOrganoid

export interface OrganoidFile {
  id: string
  organoid_id: string
  file_name: string
  file_path: string
  file_type: string | null
  file_size: number | null
  mime_type: string | null
  storage_bucket: string
  metadata: Record<string, any>
  uploaded_at: string
  created_at: string
}

// 文件上传函数（保留供其他用途）
export async function uploadOrganoidFile(
  organoidId: string,
  file: File,
  fileType: string = 'mri_volume',
  metadata: Record<string, any> = {}
): Promise<OrganoidFile> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${organoidId}/${Date.now()}.${fileExt}`
  const filePath = `organoid-files/${fileName}`

  // 上传文件到 Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('organoid-files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    throw new Error(`文件上传失败: ${uploadError.message}`)
  }

  // 获取文件 URL
  const { data: urlData } = supabase.storage
    .from('organoid-files')
    .getPublicUrl(filePath)

  // 保存文件记录到数据库
  const { data: fileRecord, error: dbError } = await supabase
    .from('organoid_files')
    .insert({
      organoid_id: organoidId,
      file_name: file.name,
      file_path: filePath,
      file_type: fileType,
      file_size: file.size,
      mime_type: file.type,
      storage_bucket: 'organoid-files',
      metadata: {
        ...metadata,
        public_url: urlData.publicUrl
      }
    })
    .select()
    .single()

  if (dbError) {
    // 如果数据库插入失败，尝试删除已上传的文件
    await supabase.storage.from('organoid-files').remove([filePath])
    throw new Error(`文件记录保存失败: ${dbError.message}`)
  }

  return fileRecord
}

// 获取类器官的所有文件
export async function getOrganoidFiles(organoidId: string): Promise<OrganoidFile[]> {
  const { data, error } = await supabase
    .from('organoid_files')
    .select('*')
    .eq('organoid_id', organoidId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`获取文件列表失败: ${error.message}`)
  }

  return data || []
}

// 删除类器官文件
export async function deleteOrganoidFile(fileId: string): Promise<void> {
  // 先获取文件信息
  const { data: file, error: fetchError } = await supabase
    .from('organoid_files')
    .select('file_path, storage_bucket')
    .eq('id', fileId)
    .single()

  if (fetchError || !file) {
    throw new Error(`文件不存在: ${fetchError?.message}`)
  }

  // 从存储中删除文件
  const { error: storageError } = await supabase.storage
    .from(file.storage_bucket)
    .remove([file.file_path])

  if (storageError) {
    console.warn(`存储文件删除失败: ${storageError.message}`)
  }

  // 从数据库中删除记录
  const { error: dbError } = await supabase
    .from('organoid_files')
    .delete()
    .eq('id', fileId)

  if (dbError) {
    throw new Error(`数据库记录删除失败: ${dbError.message}`)
  }
}

// 获取类器官详情（atlas_organoids 表，按 organoid_id 查询）
export async function getOrganoidDetail(organoidId: string): Promise<AtlasOrganoid | null> {
  const { data, error } = await supabase
    .from('atlas_organoids')
    .select('*')
    .eq('organoid_id', organoidId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    throw new Error(`获取类器官详情失败: ${error.message}`)
  }

  return data
}

// 获取所有类器官（atlas_organoids 表）
export async function getOrganoids(
  page: number = 1,
  pageSize: number = 20,
  filters?: {
    region?: string
    diagnose?: string
    tracking_type?: boolean
    search?: string
  }
): Promise<{ data: AtlasOrganoid[]; count: number }> {
  let query = supabase
    .from('atlas_organoids')
    .select('*', { count: 'exact' })

  if (filters?.region) {
    query = query.eq('region', filters.region)
  }
  if (filters?.diagnose) {
    query = query.eq('diagnose', filters.diagnose)
  }
  if (filters?.tracking_type !== undefined) {
    query = query.eq('tracking_type', filters.tracking_type)
  }
  if (filters?.search) {
    query = query.or(
      `organoid_id.ilike.%${filters.search}%,scan_id.ilike.%${filters.search}%,line_id.ilike.%${filters.search}%,batch_id.ilike.%${filters.search}%`
    )
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to).order('organoid_id', { ascending: true })

  const { data, error, count } = await query

  if (error) {
    throw new Error(`获取类器官列表失败: ${error.message}`)
  }

  return {
    data: data || [],
    count: count || 0
  }
}

// 获取追踪组的所有类器官
export async function getTrackingGroupOrganoids(trackedId: string): Promise<AtlasOrganoid[]> {
  const { data, error } = await supabase
    .from('atlas_organoids')
    .select('*')
    .eq('tracked_id', trackedId)
    .order('age', { ascending: true })

  if (error) {
    throw new Error(`获取追踪组类器官失败: ${error.message}`)
  }

  return data || []
}

