import Link from 'next/link'
import Image from 'next/image'
import { Brain, Database, Microscope, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Image 
                src="/logo.png" 
                alt="FORMA Atlas Logo" 
                width={180} 
                height={180}
                className="object-contain"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              FORMA Atlas
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-4">
              High-Throughput 4D MRI Platform
            </p>
            <p className="text-xl text-gray-500 mb-8 max-w-3xl mx-auto">
              Four-dimensional Organoid Resonance Mapping Atlas - The largest longitudinal MRI dataset of human brain organoids
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/browse"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Explore Dataset
              </Link>
              <Link
                href="/about"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A fully integrated platform for longitudinal monitoring of brain organoids
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
              <div className="bg-primary-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Microscope className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">High-Throughput Imaging</h3>
              <p className="text-gray-600">
                15-well MRI-compatible plate enabling simultaneous imaging of multiple organoids
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
              <div className="bg-primary-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Dataset</h3>
              <p className="text-gray-600">
                Over 1,700 MRI volumes from three distinct brain regions
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
              <div className="bg-primary-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-Region Coverage</h3>
              <p className="text-gray-600">
                Cerebral, MGE, and Midbrain organoids for morphological diversity
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
              <div className="bg-primary-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Longitudinal Tracking</h3>
              <p className="text-gray-600">
                True longitudinal tracking over months with region-specific trajectories
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">MRI Sequence</h3>
                  <p className="text-gray-600">T2-weighted 3D RARE</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Spatial Resolution</h3>
                  <p className="text-gray-600">~40 μm isotropic</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Field Strength</h3>
                  <p className="text-gray-600">9.4T high-field MRI</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Hardware Design</h3>
                  <p className="text-gray-600">Custom 15-well plate with U-bottom geometry</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Dataset Composition</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Total Volumes</h3>
                  <p className="text-3xl font-bold text-primary-600">1,700+</p>
                  <p className="text-gray-600 text-sm mt-1">MRI volumes</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Brain Regions</h3>
                  <p className="text-gray-600">Cerebral, MGE, Midbrain</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Genotypes</h3>
                  <p className="text-gray-600">2 Healthy Control + 2 SCZ Patient-derived lines</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">Longitudinal Coverage</h3>
                  <p className="text-gray-600">Months of developmental tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Image 
                src="/logo.png" 
                alt="FORMA Atlas Logo" 
                width={40} 
                height={40}
                className="object-contain"
                style={{ backgroundColor: 'transparent' }}
              />
              <span className="text-xl font-bold">FORMA Atlas</span>
            </div>
            <p className="text-gray-400 mb-4">
              Open-source longitudinal MRI dataset of human brain organoids
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 FORMA Atlas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

