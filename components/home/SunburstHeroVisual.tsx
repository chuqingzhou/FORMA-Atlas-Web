'use client'

type SunburstHeroVisualProps = {
  className?: string
  src?: string
}

export default function SunburstHeroVisual({
  className = '',
  src = '/showcase/atlas_statistics_sunburst_line_id.html',
}: SunburstHeroVisualProps) {
  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl ${className}`}>
      <div className="relative h-[420px] sm:h-[520px] lg:h-[560px]">
        <iframe
          title="Atlas statistics sunburst"
          src={src}
          className="absolute inset-0 z-10 h-full w-full"
          // 直接同源嵌入（保证 Plotly 交互/缩放/hover 在首页内完整可用）
          // 注意：该 HTML 来自本仓库静态文件，不涉及外部不可信来源
          scrolling="no"
        />

        {/* overlays：统一科技感边框/暗角 */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-black/15 via-black/10 to-black/35" />
        <div className="pointer-events-none absolute inset-0 z-20 ring-1 ring-white/10" />

        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-3">
          <div className="rounded-xl bg-black/55 px-4 py-2 text-sm text-gray-200 backdrop-blur">
            Atlas statistics (Sunburst) · Line ID
          </div>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 transition-colors backdrop-blur border border-white/10"
          >
            新窗口打开
          </a>
        </div>
      </div>
    </div>
  )
}

