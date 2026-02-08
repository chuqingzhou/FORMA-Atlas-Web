'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Brain, ArrowLeft, Link as LinkIcon, BarChart3 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { getOrganoidDetail, getTrackingGroupOrganoids, type AtlasOrganoid } from '@/lib/organoid'
import { useAuth } from '@/hooks/useAuth'

export default function OrganoidPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { loading: authLoading, isAuthenticated } = useAuth()
  const [organoid, setOrganoid] = useState<AtlasOrganoid | null>(null)
  const [loading, setLoading] = useState(true)
  const [trackingGroup, setTrackingGroup] = useState<AtlasOrganoid[]>([])

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
        if (organoidData.tracked_id) {
          const group = await getTrackingGroupOrganoids(organoidData.tracked_id)
          setTrackingGroup(group)
        } else {
          setTrackingGroup([])
        }
      } else {
        setOrganoid(null)
        setTrackingGroup([])
      }
    } catch (error) {
      console.error('Error loading organoid:', error)
      setOrganoid(null)
      setTrackingGroup([])
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
        <Link
          href="/browse"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Browse</span>
        </Link>

        <div className="glass-effect rounded-xl shadow-lg p-8 mb-6 border border-gray-200/50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3">
                <span className="gradient-text">{organoid.organoid_id}</span>
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {organoid.region && (
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded">
                    {organoid.region}
                  </span>
                )}
                {organoid.tracking_type && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    Tracked
                  </span>
                )}
                {organoid.tracked_id && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded">
                    Track ID: {organoid.tracked_id}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Organoid Information</h2>
              <dl className="space-y-3">
                {organoid.scan_id && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Scan ID:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.scan_id}</dd>
                  </div>
                )}
                {organoid.connect_id != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Connect ID:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.connect_id}</dd>
                  </div>
                )}
                {organoid.batch_id && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Batch:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.batch_id}</dd>
                  </div>
                )}
                {organoid.line_id && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Line:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.line_id}</dd>
                  </div>
                )}
                {organoid.region && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Region:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.region}</dd>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Morphology
              </h2>
              <dl className="space-y-3">
                {organoid.volume != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Volume:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.volume.toFixed(2)} mm3</dd>
                  </div>
                )}
                {organoid.voxel_count != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Voxel Count:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.voxel_count.toLocaleString()}</dd>
                  </div>
                )}
                {organoid.sphericity != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Sphericity:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.sphericity.toFixed(3)}</dd>
                  </div>
                )}
                {organoid.sav_ratio != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">SAV Ratio:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.sav_ratio.toFixed(4)}</dd>
                  </div>
                )}
                {organoid.intensity_mean != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Intensity Mean:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.intensity_mean.toFixed(2)}</dd>
                  </div>
                )}
                {organoid.inner_20_mean != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Inner 20% Mean:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.inner_20_mean.toFixed(2)}</dd>
                  </div>
                )}
                {organoid.outer_20_mean != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Outer 20% Mean:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.outer_20_mean.toFixed(2)}</dd>
                  </div>
                )}
                {organoid.intensity_cv != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Intensity CV:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.intensity_cv.toFixed(3)}</dd>
                  </div>
                )}
                {organoid.radial_intensity_slope != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Radial Intensity Slope:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.radial_intensity_slope.toFixed(4)}</dd>
                  </div>
                )}
                {organoid.inner_outer_20_ratio != null && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Inner/Outer 20% Ratio:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.inner_outer_20_ratio.toFixed(4)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {trackingGroup.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Group ({trackingGroup.length} organoids)</h3>
              <div className="flex flex-wrap gap-2">
                {trackingGroup.map((o) => (
                  <Link
                    key={o.id}
                    href={`/organoid/${o.organoid_id}`}
                    className={`inline-block px-3 py-1 rounded text-sm font-medium transition-colors ${
                      o.organoid_id === organoid.organoid_id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                    }`}
                  >
                    {o.organoid_id} {o.age && `(Age: ${o.age})`}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
