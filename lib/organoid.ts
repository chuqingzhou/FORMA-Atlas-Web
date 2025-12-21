// 类器官数据类型定义和工具函数

import { supabase } from './supabase'

// 数据库类型定义
export interface Batch {
  id: string
  batch_id: string
  batch_tag: string | null
  created_at: string
  updated_at: string
}

export interface CellLine {
  id: string
  line_id: string
  line_name: string | null
  diagnose: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface Region {
  id: string
  name: string
  abbreviation: string
  description: string | null
  created_at: string
}

export interface TrackingGroup {
  id: string
  tracked_id: string
  description: string | null
  created_at: string
}

export interface Organoid {
  id: string
  subject_id: string
  raw_data_id: string | null
  scan_id: string
  well_id: string | null
  batch_id: string | null
  line_id: string | null
  region_id: string | null
  tracking_type: boolean
  tracked_id: string | null
  age: string | null
  scan_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

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

export interface OrganoidDetail extends Organoid {
  batch_id_value: string | null
  batch_tag: string | null
  line_id_value: string | null
  line_name: string | null
  diagnose: string | null
  region_name: string | null
  region_abbreviation: string | null
  tracked_id_value: string | null
  file_count: number
}

// 文件上传函数
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

// 获取类器官详情（包含关联信息）
export async function getOrganoidDetail(subjectId: string): Promise<OrganoidDetail | null> {
  const { data, error } = await supabase
    .from('organoid_details')
    .select('*')
    .eq('subject_id', subjectId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // 未找到记录
    }
    throw new Error(`获取类器官详情失败: ${error.message}`)
  }

  return data
}

// 获取所有类器官（带分页）
export async function getOrganoids(
  page: number = 1,
  pageSize: number = 20,
  filters?: {
    region?: string
    diagnose?: string
    tracking_type?: boolean
    search?: string
  }
): Promise<{ data: OrganoidDetail[]; count: number }> {
  let query = supabase
    .from('organoid_details')
    .select('*', { count: 'exact' })

  // 应用过滤器
  if (filters?.region) {
    query = query.eq('region_abbreviation', filters.region)
  }
  if (filters?.diagnose) {
    query = query.eq('diagnose', filters.diagnose)
  }
  if (filters?.tracking_type !== undefined) {
    query = query.eq('tracking_type', filters.tracking_type)
  }
  if (filters?.search) {
    query = query.or(
      `subject_id.ilike.%${filters.search}%,scan_id.ilike.%${filters.search}%,raw_data_id.ilike.%${filters.search}%,well_id.ilike.%${filters.search}%`
    )
  }

  // 分页
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to).order('subject_id', { ascending: true })

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
export async function getTrackingGroupOrganoids(trackedId: string): Promise<OrganoidDetail[]> {
  const { data, error } = await supabase
    .from('organoid_details')
    .select('*')
    .eq('tracked_id_value', trackedId)
    .order('scan_date', { ascending: true })

  if (error) {
    throw new Error(`获取追踪组类器官失败: ${error.message}`)
  }

  return data || []
}

// 创建或获取追踪组
export async function getOrCreateTrackingGroup(trackedId: string): Promise<TrackingGroup> {
  // 先尝试获取
  const { data: existing } = await supabase
    .from('tracking_groups')
    .select('*')
    .eq('tracked_id', trackedId)
    .single()

  if (existing) {
    return existing
  }

  // 如果不存在，创建新的
  const { data: newGroup, error } = await supabase
    .from('tracking_groups')
    .insert({
      tracked_id: trackedId
    })
    .select()
    .single()

  if (error) {
    throw new Error(`创建追踪组失败: ${error.message}`)
  }

  return newGroup
}

