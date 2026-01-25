import type { ReactNode } from 'react'
import { Database, Layers, Ruler, Grid3X3 } from 'lucide-react'

type Stat = {
  label: string
  value: string
  icon: ReactNode
}

export default function KeyStatsBar() {
  const stats: Stat[] = [
    {
      value: '> 2,000',
      label: 'Longitudinal MRI Volumes',
      icon: <Database className="h-5 w-5 text-primary-200" />,
    },
    {
      value: '3',
      label: 'Organoid Lineages',
      icon: <Layers className="h-5 w-5 text-primary-200" />,
    },
    {
      value: '150 μm',
      label: 'Isotropic Resolution',
      icon: <Ruler className="h-5 w-5 text-primary-200" />,
    },
    {
      value: '15-well',
      label: 'Parallel Acquisition Array',
      icon: <Grid3X3 className="h-5 w-5 text-primary-200" />,
    },
  ]

  return (
    <div className="relative -mt-12 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-effect rounded-2xl border border-white/30 bg-white/60 px-6 py-5 shadow-lg backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                  <div className="mt-1 text-sm font-medium text-gray-600">{s.label}</div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-2 shadow">
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

