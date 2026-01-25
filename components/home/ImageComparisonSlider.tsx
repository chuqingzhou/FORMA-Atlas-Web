'use client'

import H5Viewer2D from '@/components/H5Viewer2D'

export default function ImageComparisonSlider({ className = '' }: { className?: string }) {
  return (
    <div className={`glass-effect rounded-3xl border border-white/30 overflow-hidden ${className}`}>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="text-lg font-bold text-gray-900">Before & After</div>
          <div className="text-sm text-gray-600">raw / prediction / ground truth（H5 交互切片）</div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <H5Viewer2D fileUrl="/showcase/16-1.h5" defaultShowLabel className="w-full" />
      </div>
    </div>
  )
}

