'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Brain, ArrowLeft, Calendar, FileText, Tag, Link as LinkIcon, X } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { getOrganoidDetail, getOrganoidFiles, OrganoidDetail, OrganoidFile } from '@/lib/organoid'
import MRIViewer from '@/components/MRIViewer'
import H5Viewer2D from '@/components/H5Viewer2D'
import { useAuth } from '@/hooks/useAuth'

const ALLOWED_EMAIL = 'chuqingz@126.com'

export default function OrganoidPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [organoid, setOrganoid] = useState<OrganoidDetail | null>(null)
  const [files, setFiles] = useState<OrganoidFile[]>([])
  const [loading, setLoading] = useState(true)
  const [trackingGroup, setTrackingGroup] = useState<OrganoidDetail[]>([])
  const [selectedFile, setSelectedFile] = useState<OrganoidFile | null>(null)
  
  // 检查是否有可视化权限
  const hasVisualizationPermission = user?.email === ALLOWED_EMAIL

  // 检查认证状态
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [params.id, isAuthenticated])

  async function loadData() {
    setLoading(true)
    try {
      const organoidData = await getOrganoidDetail(params.id)
      if (organoidData) {
        setOrganoid(organoidData)
        
        // 加载文件
        const organoidFiles = await getOrganoidFiles(organoidData.id)
        setFiles(organoidFiles)
        
        // 如果有追踪，加载追踪组
        if (organoidData.tracked_id_value) {
          // 这里可以加载追踪组的其他类器官
          // const trackingData = await getTrackingGroupOrganoids(organoidData.tracked_id_value)
          // setTrackingGroup(trackingData)
        }
      }
    } catch (error) {
      console.error('Error loading organoid:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在验证身份...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">需要登录</h1>
            <p className="text-xl text-gray-600 mb-6">请先登录以访问类器官详情</p>
            <Link
              href="/auth/login"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              前往登录
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading organoid data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!organoid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-xl text-gray-600 mb-6">Organoid not found</p>
            <Link
              href="/browse"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <Link
          href="/browse"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Browse</span>
        </Link>

        {/* Organoid Header */}
        <div className="glass-effect rounded-xl shadow-lg p-8 mb-6 border border-gray-200/50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">
                <span className="gradient-text">{organoid.subject_id}</span>
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {organoid.region_abbreviation && (
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded">
                    {organoid.region_abbreviation}
                  </span>
                )}
                {organoid.tracking_type && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    Tracked
                  </span>
                )}
                {organoid.tracked_id_value && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded">
                    Track ID: {organoid.tracked_id_value}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Organoid Information</h2>
              <dl className="space-y-3">
                {organoid.scan_id && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Scan ID:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.scan_id}</dd>
                  </div>
                )}
                {organoid.well_id && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Well ID:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.well_id}</dd>
                  </div>
                )}
                {organoid.region_name && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Region:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.region_name}</dd>
                  </div>
                )}
                {organoid.line_name && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Cell Line:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.line_name}</dd>
                  </div>
                )}
                {organoid.diagnose && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Diagnose:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.diagnose}</dd>
                  </div>
                )}
                {organoid.age && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Age:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.age}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
              <dl className="space-y-3">
                {organoid.batch_tag && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Batch:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.batch_tag}</dd>
                  </div>
                )}
                {organoid.scan_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <dt className="text-gray-500">Scan Date:</dt>
                    <dd className="text-gray-900 font-medium">
                      {new Date(organoid.scan_date).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <dt className="text-gray-500">Files:</dt>
                  <dd className="text-gray-900 font-medium">{organoid.file_count || 0}</dd>
                </div>
              </dl>
            </div>
          </div>

          {organoid.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Notes</h3>
              <p className="text-gray-700">{organoid.notes}</p>
            </div>
          )}
        </div>

        {/* Files Section */}
        <div className="glass-effect rounded-xl shadow-lg p-8 mb-6 border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Files</h2>
            <span className="text-gray-500">{files.length} file(s)</span>
          </div>

          {files.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No files available for this organoid.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{file.file_name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        {file.file_type && (
                          <span className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {file.file_type}
                          </span>
                        )}
                        {file.file_size && (
                          <span>{(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                        <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {file.file_type === 'mri_volume_h5' && file.metadata?.public_url && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedFile(file)
                            // 滚动到可视化区域
                            setTimeout(() => {
                              document.getElementById('h5-viewer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }, 100)
                          }}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                        >
                          Visualize
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* H5 Viewer 2D */}
        {selectedFile && selectedFile.file_type === 'mri_volume_h5' && hasVisualizationPermission && (
          <div id="h5-viewer" className="glass-effect rounded-xl shadow-lg p-8 border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">2D Visualization</h2>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close viewer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 text-sm text-gray-600">
              <p className="font-semibold">File: {selectedFile.file_name}</p>
              {selectedFile.metadata && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFile.metadata.organoid_volume_voxels && (
                    <div>
                      <span className="text-gray-500">Volume: </span>
                      <span className="font-medium">{selectedFile.metadata.organoid_volume_voxels.toLocaleString()} voxels</span>
                    </div>
                  )}
                  {selectedFile.metadata.shape && (
                    <div>
                      <span className="text-gray-500">Dimensions: </span>
                      <span className="font-medium">{selectedFile.metadata.shape.x} × {selectedFile.metadata.shape.y} × {selectedFile.metadata.shape.z}</span>
                    </div>
                  )}
                  {selectedFile.metadata.organoid_count !== undefined && (
                    <div>
                      <span className="text-gray-500">Organoids: </span>
                      <span className="font-medium">{selectedFile.metadata.organoid_count}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <H5Viewer2D
              fileUrl={selectedFile.metadata?.public_url}
              metadata={selectedFile.metadata}
              hasPermission={hasVisualizationPermission}
            />
          </div>
        )}

        {/* MRI Viewer 3D (保留作为占位符) */}
        {files.some(f => f.file_type === 'mri_volume') && !selectedFile && (
          <div id="mri-viewer" className="glass-effect rounded-xl shadow-lg p-8 border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3D Visualization</h2>
            <div className="h-96">
              <MRIViewer />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
