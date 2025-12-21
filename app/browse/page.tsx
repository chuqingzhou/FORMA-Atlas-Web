'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, Filter, Search, FileText, Calendar } from 'lucide-react'
import { getOrganoids, type OrganoidDetail } from '@/lib/organoid'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/hooks/useAuth'

interface BrowsePageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function BrowsePage({ searchParams }: BrowsePageProps) {
  const router = useRouter()
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const [organoids, setOrganoids] = useState<OrganoidDetail[]>([])
  const [loading, setLoading] = useState(true)

  // 检查认证状态
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    region: '',
    diagnose: '',
    tracking_type: undefined as boolean | undefined
  })

  useEffect(() => {
    // 只有在认证完成后才加载数据
    if (!authLoading && isAuthenticated) {
      loadOrganoids()
    }
  }, [filters, searchTerm, authLoading, isAuthenticated])

  async function loadOrganoids() {
    // 如果未认证，不加载数据
    if (!isAuthenticated) {
      return
    }
    
    setLoading(true)
    try {
      const result = await getOrganoids(1, 100, {
        ...filters,
        search: searchTerm || undefined
      })
      setOrganoids(result.data)
    } catch (error) {
      console.error('Error loading organoids:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            <span className="gradient-text">Browse Dataset</span>
          </h1>
          <p className="text-xl text-gray-600">
            Explore {organoids.length} organoids from the FORMA Atlas collection
          </p>
        </div>

        {/* Filters and Search */}
        <div className="glass-effect rounded-xl shadow-lg p-6 mb-6 border border-gray-200/50">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Subject ID, Scan ID, Raw Data ID, Well ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Regions</option>
              <option value="CEREBRAL">Cerebral</option>
              <option value="MGE">MGE</option>
              <option value="MIDBRAIN">Midbrain</option>
            </select>
            <select
              value={filters.diagnose || ''}
              onChange={(e) => setFilters({ ...filters, diagnose: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Diagnoses</option>
              <option value="HC">Healthy Control</option>
              <option value="SCZ">Schizophrenia</option>
            </select>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.tracking_type === true}
                onChange={(e) => setFilters({ ...filters, tracking_type: e.target.checked ? true : undefined })}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Has Tracking</span>
            </label>
          </div>
        </div>

        {/* Organoids Grid */}
        {authLoading ? (
          <div className="glass-effect rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">正在验证身份...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="glass-effect rounded-xl shadow-lg p-12 text-center">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">需要登录</h3>
            <p className="text-gray-600 mb-4">请先登录以访问数据集</p>
            <Link
              href="/auth/login"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              前往登录
            </Link>
          </div>
        ) : loading ? (
          <div className="glass-effect rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading organoids...</p>
          </div>
        ) : organoids.length === 0 ? (
          <div className="glass-effect rounded-xl shadow-lg p-12 text-center">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No organoids found</h3>
            <p className="text-gray-600">
              {searchTerm || Object.values(filters).some(v => v) 
                ? 'Try adjusting your search or filters.'
                : 'The dataset is currently empty. Check back later or contact the administrators.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organoids.map((organoid) => (
              <Link
                key={organoid.id}
                href={`/organoid/${organoid.subject_id}`}
                className="glass-effect rounded-xl shadow-lg p-6 card-hover border border-gray-200/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {organoid.subject_id}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {organoid.region_abbreviation && (
                        <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                          {organoid.region_abbreviation}
                        </span>
                      )}
                      {organoid.tracking_type && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          Tracked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {organoid.scan_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Scan ID:</span>
                      <span className="text-gray-900 font-medium">{organoid.scan_id}</span>
                    </div>
                  )}
                  {organoid.raw_data_id && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Raw Data ID:</span>
                      <span className="text-gray-900 font-medium">{organoid.raw_data_id}</span>
                    </div>
                  )}
                  {organoid.line_name && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cell Line:</span>
                      <span className="text-gray-900 font-medium">{organoid.line_name}</span>
                    </div>
                  )}
                  {organoid.diagnose && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Diagnose:</span>
                      <span className="text-gray-900 font-medium">{organoid.diagnose}</span>
                    </div>
                  )}
                  {organoid.age && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age:</span>
                      <span className="text-gray-900 font-medium">{organoid.age}</span>
                    </div>
                  )}
                  {organoid.scan_date && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">{new Date(organoid.scan_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span className="text-xs">{organoid.file_count || 0} file(s)</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

