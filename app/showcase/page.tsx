import Link from 'next/link'
import Navigation from '@/components/Navigation'
import SunburstHeroVisual from '@/components/home/SunburstHeroVisual'
import MorphologyGLBPreview from '@/components/home/MorphologyGLBPreview'

const GLB_ITEMS = [
  {
    title: 'iPSC02 · Chain1 · T1 · W9',
    url: '/showcase/tracking_chain_iPSC02_Chain1_T1_W9.glb',
  },
  {
    title: 'iPSC02 · Chain1 · T2 · W13',
    url: '/showcase/tracking_chain_iPSC02_Chain1_T2_W13.glb',
  },
  {
    title: 'iPSC02 · Chain1 · T3 · W32',
    url: '/showcase/tracking_chain_iPSC02_Chain1_T3_W32.glb',
  },
] as const

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="fixed inset-0 bg-pattern z-0"></div>
      <div className="fixed inset-0 bg-pattern-overlay z-0"></div>

      <Navigation />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Interactive Showcase
          </h1>
          <p className="mt-2 text-gray-600">
            Plotly 统计图与 3D（GLB）可视化预览。
          </p>
        </div>

        <section className="grid gap-6">
          <div>
            <div className="flex items-end justify-between gap-4 mb-3">
              <div className="text-xl font-bold text-gray-900">Sunburst（Line ID）</div>
              <Link
                href="/showcase/atlas_statistics_sunburst_line_id.html"
                target="_blank"
                className="text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                新窗口打开 →
              </Link>
            </div>
            <SunburstHeroVisual className="bg-black" />
          </div>

          <div className="mt-4">
            <div className="text-xl font-bold text-gray-900 mb-3">3D 可视化（GLB）</div>
            <div className="grid gap-6 md:grid-cols-3">
              {GLB_ITEMS.map((item) => (
                <div key={item.url} className="glass-effect rounded-2xl border border-gray-200/50 p-4">
                  <div className="text-sm font-bold text-gray-900 mb-3">{item.title}</div>
                  <MorphologyGLBPreview url={item.url} interactive />
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary-700 hover:text-primary-800"
                    >
                      直接打开 →
                    </a>
                    <a
                      href={item.url}
                      download
                      className="text-gray-600 hover:text-gray-900"
                    >
                      下载
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

