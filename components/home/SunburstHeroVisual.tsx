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
      <iframe
        title="Atlas statistics sunburst"
        src={src}
        className="absolute inset-0 h-full w-full"
        // 允许 HTML 内部的 D3/JS 脚本运行；同源以便正常加载静态资源
        sandbox="allow-scripts allow-same-origin"
      />

      {/* overlays：统一科技感边框/暗角 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/35" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
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

      <div className="relative h-[420px] sm:h-[520px] lg:h-[560px]" />
    </div>
  )
}

