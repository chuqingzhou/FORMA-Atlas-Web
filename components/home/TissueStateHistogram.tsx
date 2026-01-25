export default function TissueStateHistogram({ className = '' }: { className?: string }) {
  // 纯展示用（占位）：后续可替换成真实 T2 intensity histogram 数据
  return (
    <div className={`relative h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-black ${className}`}>
      <svg viewBox="0 0 400 220" className="h-full w-full">
        <defs>
          <linearGradient id="hist" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0ea5e9" stopOpacity="0.25" />
            <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#0284c7" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* grid */}
        <g opacity="0.18" stroke="#ffffff">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={40 + i * 45} y1={20} x2={40 + i * 45} y2={200} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1={30} y1={35 + i * 30} x2={385} y2={35 + i * 30} />
          ))}
        </g>

        {/* axes */}
        <g stroke="#ffffff" opacity="0.5">
          <line x1="30" y1="200" x2="385" y2="200" />
          <line x1="30" y1="20" x2="30" y2="200" />
        </g>

        {/* bars */}
        <g fill="url(#hist)">
          {[
            18, 28, 40, 55, 78, 105, 135, 160, 175, 160, 130, 95, 70, 52, 38, 28, 20,
          ].map((h, i) => (
            <rect key={i} x={40 + i * 20} y={200 - h} width={14} height={h} rx={2} />
          ))}
        </g>

        {/* highlight */}
        <path
          d="M40 182 C110 130, 170 70, 240 50 C300 35, 350 70, 370 112"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
          opacity="0.75"
        />

        {/* labels */}
        <text x="32" y="16" fill="#ffffff" opacity="0.85" fontSize="11">
          Count
        </text>
        <text x="275" y="214" fill="#ffffff" opacity="0.85" fontSize="11">
          T2 Intensity
        </text>
      </svg>
      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
    </div>
  )
}

