import Link from 'next/link'
import Image from 'next/image'
import { Brain, Database, Microscope, TrendingUp, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* 背景图案 */}
      <div className="fixed inset-0 bg-pattern z-0"></div>
      <div className="fixed inset-0 bg-pattern-overlay z-0"></div>
      
      {/* 装饰性渐变圆圈 */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Navigation */}
      <nav className="glass-effect border-b border-gray-200/50 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="FORMA Atlas Logo" 
                  width={56} 
                  height={56}
                  className="object-contain transition-transform group-hover:scale-110"
                  style={{ backgroundColor: 'transparent' }}
                />
                <div className="absolute inset-0 bg-primary-400 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">FORMA Atlas</span>
            </Link>
            <div className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/browse" className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group">
                Browse Data
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-8 animate-fade-in-up">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="FORMA Atlas Logo" 
                  width={200} 
                  height={200}
                  className="object-contain animate-float"
                  style={{ backgroundColor: 'transparent' }}
                />
                <div className="absolute inset-0 bg-primary-400 rounded-full opacity-20 blur-3xl animate-pulse-glow"></div>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <span className="gradient-text">FORMA Atlas</span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              High-Throughput 4D MRI Platform
            </p>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Four-dimensional Organoid Resonance Mapping Atlas - The largest longitudinal MRI dataset of human brain organoids
            </p>
            <div className="flex justify-center space-x-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <Link
                href="/browse"
                className="group relative bg-gradient-to-r from-primary-600 to-primary-700 text-white px-10 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Explore Dataset
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
              </Link>
              <Link
                href="/about"
                className="glass-effect text-primary-600 px-10 py-4 rounded-xl font-semibold border-2 border-primary-600/30 hover:border-primary-600 hover:bg-primary-50/50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="gradient-text">Platform Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A fully integrated platform for longitudinal monitoring of brain organoids
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-effect p-8 rounded-2xl card-hover border border-blue-200/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Microscope className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">High-Throughput Imaging</h3>
                <p className="text-gray-600 leading-relaxed">
                  15-well MRI-compatible plate enabling simultaneous imaging of multiple organoids
                </p>
              </div>
            </div>

            <div className="glass-effect p-8 rounded-2xl card-hover border border-purple-200/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Dataset</h3>
                <p className="text-gray-600 leading-relaxed">
                  Over 1,700 MRI volumes from three distinct brain regions
                </p>
              </div>
            </div>

            <div className="glass-effect p-8 rounded-2xl card-hover border border-green-200/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Region Coverage</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cerebral, MGE, and Midbrain organoids for morphological diversity
                </p>
              </div>
            </div>

            <div className="glass-effect p-8 rounded-2xl card-hover border border-orange-200/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Longitudinal Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  True longitudinal tracking over months with region-specific trajectories
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="relative">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                <span className="gradient-text">Technical Specifications</span>
              </h2>
              <div className="space-y-4">
                <div className="glass-effect p-6 rounded-xl border border-gray-200/50 card-hover">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">MRI Sequence</h3>
                  <p className="text-gray-600 text-lg">T2-weighted 3D RARE</p>
                </div>
                <div className="glass-effect p-6 rounded-xl border border-gray-200/50 card-hover">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Spatial Resolution</h3>
                  <p className="text-gray-600 text-lg">~40 μm isotropic</p>
                </div>
                <div className="glass-effect p-6 rounded-xl border border-gray-200/50 card-hover">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Field Strength</h3>
                  <p className="text-gray-600 text-lg">9.4T high-field MRI</p>
                </div>
                <div className="glass-effect p-6 rounded-xl border border-gray-200/50 card-hover">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Hardware Design</h3>
                  <p className="text-gray-600 text-lg">Custom 15-well plate with U-bottom geometry</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                <span className="gradient-text">Dataset Composition</span>
              </h2>
              <div className="space-y-4">
                <div className="glass-effect p-6 rounded-xl border border-primary-200/50 card-hover relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-200 rounded-full opacity-20 blur-2xl"></div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Total Volumes</h3>
                  <p className="text-5xl font-bold gradient-text mb-1">1,700+</p>
                  <p className="text-gray-600">MRI volumes</p>
                </div>
                <div className="glass-effect p-6 rounded-xl border border-gray-200/50 card-hover">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Brain Regions</h3>
                  <p className="text-gray-600 text-lg">Cerebral, MGE, Midbrain</p>
                </div>
                <div className="glass-effect p-6 rounded-xl border border-gray-200/50 card-hover">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Genotypes</h3>
                  <p className="text-gray-600 text-lg">2 Healthy Control + 2 SCZ Patient-derived lines</p>
                </div>
                <div className="glass-effect p-6 rounded-xl border border-gray-200/50 card-hover">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">Longitudinal Coverage</h3>
                  <p className="text-gray-600 text-lg">Months of developmental tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="FORMA Atlas Logo" 
                  width={48} 
                  height={48}
                  className="object-contain"
                  style={{ backgroundColor: 'transparent' }}
                />
                <div className="absolute inset-0 bg-primary-400 rounded-full opacity-20 blur-xl"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">FORMA Atlas</span>
            </div>
            <p className="text-gray-300 mb-6 text-lg max-w-2xl mx-auto">
              Open-source longitudinal MRI dataset of human brain organoids
            </p>
            <div className="flex justify-center space-x-8 mb-8">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse Data</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            </div>
            <div className="border-t border-gray-700/50 pt-6">
              <p className="text-gray-500 text-sm">
                © 2025 FORMA Atlas. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

