'use client'

import { useMemo, useState } from 'react'

type HeroVisualProps = {
  className?: string
  videoSrc?: string
  posterSrc?: string
}

export default function HeroVisual({
  className = '',
  videoSrc = '/hero/hero.mp4',
  posterSrc = '/logo.png',
}: HeroVisualProps) {
  const [videoError, setVideoError] = useState(false)

  const scanlineStyle = useMemo(
    () => ({
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(circle at 30% 20%, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at 70% 70%, rgba(2,132,199,0.22), transparent 60%)',
      backgroundSize: '100% 3px, 900px 900px, 900px 900px',
      backgroundPosition: '0 0, 0 0, 0 0',
    }),
    []
  )

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl ${className}`}
    >
      {/* video / fallback */}
      <div className="absolute inset-0">
        {!videoError ? (
          <video
            className="h-full w-full object-cover opacity-90"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
            onError={() => setVideoError(true)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-950 via-slate-950 to-black" />
        )}
      </div>

      {/* overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/70" />
      <div className="absolute inset-0 opacity-60 mix-blend-screen" style={scanlineStyle} />
      <div className="absolute inset-0 ring-1 ring-white/10" />

      {/* hint for missing hero assets (only when video missing) */}
      {videoError && (
        <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/55 px-4 py-3 text-sm text-gray-200 backdrop-blur">
          Hero video not detected (suggest placing at `public/hero/hero.mp4`). Using high-contrast scan-style background as placeholder.
        </div>
      )}

      <div className="relative h-[420px] sm:h-[520px] lg:h-[560px]" />
    </div>
  )
}

