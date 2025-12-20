import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { Brain, ArrowLeft, Calendar, Database } from 'lucide-react'
import { notFound } from 'next/navigation'

interface OrganoidDetail {
  id: string
  organoid_id: string
  region_name: string
  region_abbreviation: string
  genotype_name: string
  cell_line: string | null
  initial_age_weeks: number | null
  notes: string | null
  scan_count: number
  min_age_weeks: number | null
  max_age_weeks: number | null
}

interface MRIScan {
  id: string
  scan_date: string
  age_weeks: number
  volume_path: string | null
  resolution_x: number | null
  resolution_y: number | null
  resolution_z: number | null
  sequence_type: string
  metadata: Record<string, any>
}

async function getOrganoid(id: string) {
  try {
    const { data, error } = await supabase
      .from('organoid_details')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as OrganoidDetail
  } catch (error) {
    console.error('Error fetching organoid:', error)
    return null
  }
}

async function getMRIScans(organoidId: string) {
  try {
    const { data, error } = await supabase
      .from('mri_scans')
      .select('*')
      .eq('organoid_id', organoidId)
      .order('age_weeks', { ascending: true })

    if (error) throw error
    return data as MRIScan[]
  } catch (error) {
    console.error('Error fetching MRI scans:', error)
    return []
  }
}

export default async function OrganoidPage({
  params,
}: {
  params: { id: string }
}) {
  const organoid = await getOrganoid(params.id)
  const scans = organoid ? await getMRIScans(organoid.id) : []

  if (!organoid) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="FORMA Atlas Logo" 
                width={56} 
                height={56}
                className="object-contain"
                style={{ backgroundColor: 'transparent' }}
              />
              <span className="text-xl font-bold text-gray-900">FORMA Atlas</span>
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">
                Home
              </Link>
              <Link href="/browse" className="text-gray-700 hover:text-primary-600 font-medium">
                Browse Data
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/browse"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Browse</span>
        </Link>

        {/* Organoid Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {organoid.organoid_id}
              </h1>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded">
                {organoid.region_abbreviation}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Organoid Information</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Region:</dt>
                  <dd className="text-gray-900 font-medium">{organoid.region_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Genotype:</dt>
                  <dd className="text-gray-900 font-medium">{organoid.genotype_name}</dd>
                </div>
                {organoid.cell_line && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Cell Line:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.cell_line}</dd>
                  </div>
                )}
                {organoid.initial_age_weeks && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Initial Age:</dt>
                    <dd className="text-gray-900 font-medium">{organoid.initial_age_weeks} weeks</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Scan Statistics</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Total Scans:</dt>
                  <dd className="text-gray-900 font-medium">{organoid.scan_count}</dd>
                </div>
                {organoid.min_age_weeks !== null && organoid.max_age_weeks !== null && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Age Range:</dt>
                      <dd className="text-gray-900 font-medium">
                        {organoid.min_age_weeks} - {organoid.max_age_weeks} weeks
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Duration:</dt>
                      <dd className="text-gray-900 font-medium">
                        {organoid.max_age_weeks - organoid.min_age_weeks} weeks
                      </dd>
                    </div>
                  </>
                )}
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

        {/* MRI Scans */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">MRI Scans</h2>
            <span className="text-gray-500">{scans.length} scans</span>
          </div>

          {scans.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No MRI scans available for this organoid.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Scan at {scan.age_weeks} weeks
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(scan.scan_date).toLocaleDateString()}</span>
                        </div>
                        <span>{scan.sequence_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    {scan.resolution_x && scan.resolution_y && scan.resolution_z && (
                      <div>
                        <span className="text-gray-500">Resolution: </span>
                        <span className="text-gray-900 font-medium">
                          {scan.resolution_x} × {scan.resolution_y} × {scan.resolution_z} μm
                        </span>
                      </div>
                    )}
                    {scan.volume_path && (
                      <div>
                        <span className="text-gray-500">Volume Path: </span>
                        <span className="text-gray-900 font-medium font-mono text-xs">
                          {scan.volume_path}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

