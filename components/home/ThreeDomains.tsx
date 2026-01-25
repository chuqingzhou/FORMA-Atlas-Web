import Image from 'next/image'
import { Activity, Box, ScanLine } from 'lucide-react'
import MorphologyGLBPreview from '@/components/home/MorphologyGLBPreview'
import TissueStateHistogram from '@/components/home/TissueStateHistogram'

export default function ThreeDomains() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Morphology */}
      <div className="glass-effect rounded-3xl border border-white/30 p-6 card-hover">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-2 shadow">
            <Box className="h-5 w-5 text-primary-200" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Morphology</div>
            <div className="text-sm text-gray-600">3D surface & shape descriptors</div>
          </div>
        </div>

        <div className="mt-5">
          <MorphologyGLBPreview />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl bg-white/60 border border-white/40 px-3 py-2">
            <div className="text-gray-500">Volume</div>
            <div className="font-semibold text-gray-900">voxels</div>
          </div>
          <div className="rounded-xl bg-white/60 border border-white/40 px-3 py-2">
            <div className="text-gray-500">Sphericity</div>
            <div className="font-semibold text-gray-900">shape</div>
          </div>
          <div className="rounded-xl bg-white/60 border border-white/40 px-3 py-2">
            <div className="text-gray-500">SA/V</div>
            <div className="font-semibold text-gray-900">ratio</div>
          </div>
        </div>
      </div>

      {/* Spatial Pattern */}
      <div className="glass-effect rounded-3xl border border-white/30 p-6 card-hover">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-2 shadow">
            <ScanLine className="h-5 w-5 text-primary-200" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Spatial Pattern</div>
            <div className="text-sm text-gray-600">radial intensity signature (RIS)</div>
          </div>
        </div>

        <div className="mt-5 relative h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-black">
          <Image
            src="/showcase/longitudinal_tracking_curves.png"
            alt="Spatial pattern preview"
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 1024px) 100vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            示例图（后续可替换为 RIS 热力图/剖面图）
          </div>
          <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/65 border border-white/40 px-3 py-1">
            <Activity className="h-4 w-4 text-primary-600" />
            RIS gradient
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/65 border border-white/40 px-3 py-1">
            <Activity className="h-4 w-4 text-primary-600" />
            Layering
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/65 border border-white/40 px-3 py-1">
            <Activity className="h-4 w-4 text-primary-600" />
            Edge contrast
          </span>
        </div>
      </div>

      {/* Tissue State */}
      <div className="glass-effect rounded-3xl border border-white/30 p-6 card-hover">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-2 shadow">
            <Activity className="h-5 w-5 text-primary-200" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900">Tissue State</div>
            <div className="text-sm text-gray-600">T2 signal & composition</div>
          </div>
        </div>

        <div className="mt-5">
          <TissueStateHistogram />
        </div>

        <div className="mt-5 text-sm text-gray-700 leading-relaxed">
          用 T2 信号分布刻画组织状态（例如“致密/水肿”等）。当前为展示占位，后续可直接接入你们的
          histogram/伪彩图输出。
        </div>
      </div>
    </div>
  )
}

