import Link from 'next/link'
import Image from 'next/image'
import { Brain, Microscope, Database, TrendingUp, Target } from 'lucide-react'

export default function AboutPage() {
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
              <Link href="/about" className="text-primary-600 font-medium border-b-2 border-primary-600">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About FORMA Atlas</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To resolve the inherent trade-off between imaging depth and throughput in organoid phenotyping, 
                we developed a fully integrated platform for longitudinal monitoring. This workflow spans the entire 
                experimental pipeline: from the computer-aided design (CAD) of specialized hardware and the generation 
                of diverse brain organoids to high-field 9.4T MRI acquisition and the construction of a foundational 4D database.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hardware Design</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The hardware component incorporates a custom 15-well MRI-compatible plate featuring a specialized 
                U-bottom geometry. This design gravitationally centers each organoid at the magnet's isocenter, 
                ensuring maximized signal homogeneity and spatial standardization across all 15 samples imaged simultaneously.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Imaging Capabilities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Unlike optical imaging modalities limited by light scattering in mature, millimeter-scale tissues, 
                our T2-weighted 3D RARE MRI sequence provides unrestricted depth penetration with an isotropic spatial 
                resolution of approximately 40 μm. The platform captures full-volumetric structural contrast, revealing 
                internal features such as ventricular cavities and tissue density gradients without the need for clearing or fixation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dataset Composition</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Leveraging this high-throughput capability, we constructed FORMA (Four-dimensional Organoid Resonance 
                Mapping Atlas), the largest longitudinal MRI dataset of human brain organoids to date. This open-source 
                atlas comprises over 1,700 MRI volumes collected from three distinct brain regions to maximize morphological 
                diversity:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Cerebral organoids</strong> - modeling general telencephalon</li>
                <li><strong>Medial Ganglionic Eminence (MGE)</strong> - ventral forebrain</li>
                <li><strong>Midbrain organoids</strong> - mesencephalon</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                The dataset also spans varying genotypes (2 healthy control and 2 SCZ patient-derived lines) and a broad 
                developmental window. Furthermore, the non-invasive nature of our platform enables true longitudinal tracking, 
                allowing us to map the region-specific morphological trajectories of individual organoids over months.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Field Strength</h3>
                  </div>
                  <p className="text-gray-700">9.4T high-field MRI</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Microscope className="h-5 w-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Spatial Resolution</h3>
                  </div>
                  <p className="text-gray-700">(dz, dy, dx) = (0.30, 0.16, 0.16) mm</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Sequence Type</h3>
                  </div>
                  <p className="text-gray-700">T2-weighted 3D RARE</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                    <h3 className="font-semibold text-gray-900">Throughput</h3>
                  </div>
                  <p className="text-gray-700">15 organoids per scan</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Open Source</h2>
              <p className="text-gray-700 leading-relaxed">
                FORMA Atlas is an open-source project, making the largest longitudinal MRI dataset of human brain 
                organoids freely available to the research community. We encourage researchers to explore, analyze, 
                and build upon this foundational dataset.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

