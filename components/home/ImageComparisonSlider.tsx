'use client'

import H5Viewer2D from '@/components/H5Viewer2D'
import { useMemo, useState } from 'react'

export default function ImageComparisonSlider({ className = '' }: { className?: string }) {
  const OPTIONS = useMemo(
    () => [
      {
        key: 'cerebral_3_4',
        label: 'Cerebral · 3-4',
        fileUrl: '/showcase/3-4_raw_pred_gt.h5',
      },
      {
        key: 'mge_17_13',
        label: 'MGE · 17-13',
        fileUrl: '/showcase/17-13_raw_pred_gt.h5',
      },
      {
        key: 'cerebral_3_1',
        label: 'Cerebral · 3-1',
        fileUrl: '/showcase/3-1_raw_pred_gt.h5',
      },
    ] as const,
    []
  )

  const [selectedKey, setSelectedKey] = useState<(typeof OPTIONS)[number]['key']>(OPTIONS[0].key)
  const selected = OPTIONS.find((o) => o.key === selectedKey) || OPTIONS[0]

  return (
    <div className={`glass-effect rounded-3xl border border-white/30 overflow-hidden ${className}`}>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-lg font-bold text-gray-900">Before & After</div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">raw / pred / gt（H5 交互切片）</div>
            <label className="text-sm text-gray-600">
              <span className="sr-only">选择脑区</span>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value as any)}
                className="ml-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-1.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              >
                {OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
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

