'use client'

import H5Viewer2D from '@/components/H5Viewer2D'
import { useState } from 'react'

export default function ImageComparisonSlider({ className = '' }: { className?: string }) {
  const OPTIONS = [
    {
      key: 'cerebral',
      label: 'Cerebral',
      fileUrl: '/showcase/3-4_raw_pred_gt.h5',
    },
    {
      key: 'mge',
      label: 'MGE',
      fileUrl: '/showcase/17-13_raw_pred_gt.h5',
    },
    {
      key: 'midbrain',
      label: 'Midbrain',
      fileUrl: '/showcase/3-1_raw_pred_gt.h5',
    },
  ] as const

  const [selectedKey, setSelectedKey] = useState<(typeof OPTIONS)[number]['key']>('cerebral')
  const selected = OPTIONS.find((o) => o.key === selectedKey) || OPTIONS[0]

  return (
    <div className={`glass-effect rounded-3xl border border-white/30 overflow-hidden ${className}`}>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-lg font-bold text-gray-900">Before & After</div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">raw / pred / gt（H5 交互切片）</div>
            <div className="inline-flex rounded-xl border border-gray-200 bg-white/60 p-1 shadow-sm">
              {OPTIONS.map((opt) => {
                const active = opt.key === selectedKey
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedKey(opt.key)}
                    className={[
                      'px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors',
                      active ? 'bg-white text-gray-900 shadow' : 'text-gray-700 hover:text-gray-900 hover:bg-white/70',
                    ].join(' ')}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <H5Viewer2D
          fileUrl={selected.fileUrl}
          defaultShowPrediction
          defaultShowLabel
          className="w-full"
        />
      </div>
    </div>
  )
}

