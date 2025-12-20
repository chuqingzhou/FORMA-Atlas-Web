import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { Brain, Filter, Search } from 'lucide-react'

interface OrganoidDetail {
  id: string
  organoid_id: string
  region_name: string
  region_abbreviation: string
  genotype_name: string
  cell_line: string | null
  initial_age_weeks: number | null
  scan_count: number
  min_age_weeks: number | null
  max_age_weeks: number | null
}

async function getOrganoids() {
  try {
    const { data, error } = await supabase
      .from('organoid_details')
      .select('*')
      .order('organoid_id', { ascending: true })

    if (error) throw error
    return data as OrganoidDetail[]
  } catch (error) {
    console.error('Error fetching organoids:', error)
    return []
  }
}

export default async function BrowsePage() {
  const organoids = await getOrganoids()

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
              <Link href="/browse" className="text-primary-600 font-medium border-b-2 border-primary-600">
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Dataset</h1>
          <p className="text-xl text-gray-600">
            Explore {organoids.length} organoids from the FORMA Atlas collection
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by organoid ID, cell line..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Organoids Grid */}
        {organoids.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No organoids found</h3>
            <p className="text-gray-600">
              The dataset is currently empty. Check back later or contact the administrators.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organoids.map((organoid) => (
              <Link
                key={organoid.id}
                href={`/organoid/${organoid.id}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {organoid.organoid_id}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded">
                      {organoid.region_abbreviation}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Genotype:</span>
                    <span className="text-gray-900 font-medium">{organoid.genotype_name}</span>
                  </div>
                  {organoid.cell_line && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cell Line:</span>
                      <span className="text-gray-900 font-medium">{organoid.cell_line}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Scans:</span>
                    <span className="text-gray-900 font-medium">{organoid.scan_count}</span>
                  </div>
                  {organoid.min_age_weeks !== null && organoid.max_age_weeks !== null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Age Range:</span>
                      <span className="text-gray-900 font-medium">
                        {organoid.min_age_weeks} - {organoid.max_age_weeks} weeks
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-primary-600 text-sm font-medium hover:text-primary-700">
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

