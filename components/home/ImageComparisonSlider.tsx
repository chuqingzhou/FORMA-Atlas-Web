'use client'

import { useMemo, useState } from 'react'

type ImageComparisonSliderProps = {
  className?: string
  leftLabel?: string
  rightLabel?: string
  leftSrc?: string
  rightSrc?: string
}

export default function ImageComparisonSlider({
  className = '',
  leftLabel = 'Raw MRI',
  rightLabel = 'AI Segmentation',
  leftSrc = '/showcase/mri_raw.png',
  rightSrc = '/showcase/mri_mask.png',
}: ImageComparisonSliderProps) {
  const [pos, setPos] = useState(55)
  const [leftOk, setLeftOk] = useState(true)
  const [rightOk, setRightOk] = useState(true)

  const clipStyle = useMemo(
    () => ({
      clipPath: `inset(0 ${100 - pos}% 0 0)`,
    }),
    [pos]
  )

  return (
    <div className={`glass-effect rounded-3xl border border-white/30 overflow-hidden ${className}`}>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="text-lg font-bold text-gray-900">Before & After</div>
          <div className="text-sm text-gray-600">拖动滑块对比原始 MRI 与分割结果</div>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="relative aspect-[16/9] bg-black">
          {/* base (left) */}
          {leftOk ? (
            <img
              src={leftSrc}
              alt={leftLabel}
              className="absolute inset-0 h-full w-full object-contain"
              onError={() => setLeftOk(false)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
              缺少示例图：请提供 `{leftSrc}`
            </div>
          )}

          {/* overlay (right) */}
          {rightOk ? (
            <img
              src={rightSrc}
              alt={rightLabel}
              className="absolute inset-0 h-full w-full object-contain"
              style={clipStyle}
              onError={() => setRightOk(false)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
              缺少示例图：请提供 `{rightSrc}`
            </div>
          )}

          {/* divider */}
          <div
            className="absolute inset-y-0 w-1 bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
            style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
          />
          <div
            className="absolute top-1/2 h-10 w-10 rounded-full bg-white/95 shadow-xl border border-black/10 flex items-center justify-center"
            style={{ left: `${pos}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-primary-500 to-primary-700" />
          </div>

          {/* labels */}
          <div className="absolute left-3 top-3 rounded-lg bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {leftLabel}
          </div>
          <div className="absolute right-3 top-3 rounded-lg bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {rightLabel}
          </div>
        </div>

        <div className="px-6 py-5">
          <input
            aria-label="Comparison slider"
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="w-full accent-primary-600"
          />
        </div>
      </div>
    </div>
  )
}

