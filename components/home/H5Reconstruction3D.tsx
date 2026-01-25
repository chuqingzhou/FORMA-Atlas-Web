'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'
import { File } from 'jsfive'
import * as THREE from 'three'

type VolumeShape = { z: number; y: number; x: number }

function buildPointCloudFromMask(args: {
  mask: ArrayLike<number>
  shape: VolumeShape
  threshold?: number
  maxPoints?: number
}) {
  const { mask, shape, threshold = 127, maxPoints = 90000 } = args
  const dimZ = shape.z
  const dimY = shape.y
  const dimX = shape.x

  // 自适应下采样，避免点过多卡顿
  const total = dimZ * dimY * dimX
  const step = total > 1_200_000 ? 3 : total > 600_000 ? 2 : 1

  const positions: number[] = []

  // 归一化到 [-0.5, 0.5] 并做各向同性缩放，避免 y 维过大
  const sx = 1 / Math.max(1, dimX)
  const sy = 1 / Math.max(1, dimY)
  const sz = 1 / Math.max(1, dimZ)
  const scale = 1 / Math.max(sx, sy, sz)

  for (let z = 0; z < dimZ; z += step) {
    for (let y = 0; y < dimY; y += step) {
      const base = z * dimY * dimX + y * dimX
      for (let x = 0; x < dimX; x += step) {
        const v = mask[base + x] as number
        if (v > threshold) {
          const nx = (x / (dimX - 1) - 0.5) * scale
          const ny = (y / (dimY - 1) - 0.5) * scale
          const nz = (z / (dimZ - 1) - 0.5) * scale
          positions.push(nx, nz, ny) // 交换一下轴：看起来更符合“竖直为z”
          if (positions.length / 3 >= maxPoints) {
            return new Float32Array(positions)
          }
        }
      }
    }
  }

  return new Float32Array(positions)
}

function PointsCloud({
  positions,
  color = '#38bdf8',
  size = 0.012,
}: {
  positions: Float32Array
  color?: string
  size?: number
}) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color,
        size,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      }),
    [color, size]
  )

  // 清理 GPU 资源
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return <points geometry={geometry} material={material} />
}

function SlicePlane({
  shape,
  sliceX,
}: {
  shape: VolumeShape
  sliceX: number
}) {
  const dimX = Math.max(1, shape.x)
  const t = dimX <= 1 ? 0 : sliceX / (dimX - 1)
  const xPos = (t - 0.5) * 1.8 // 经验值：与点云 scale 相匹配

  return (
    <mesh position={[xPos, 0, 0]}>
      <planeGeometry args={[1.8, 1.8, 1, 1]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  )
}

export default function H5Reconstruction3D({
  fileUrl,
  sliceIndex,
  mode = 'pred',
  className = '',
}: {
  fileUrl: string
  sliceIndex: number
  mode?: 'pred' | 'gt'
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shape, setShape] = useState<VolumeShape | null>(null)
  const [positions, setPositions] = useState<Float32Array | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(fileUrl)
        if (!res.ok) throw new Error(`Failed to fetch H5: ${res.status}`)

        const buf = await res.arrayBuffer()
        const h5 = new File(buf)

        const rawDs = h5.get('/raw')
        const predDs = h5.get('/pred') || h5.get('/prediction')
        const gtDs = h5.get('/gt') || h5.get('/label')

        if (!rawDs) throw new Error('Missing /raw dataset')

        const dsToUse = mode === 'pred' ? (predDs || gtDs) : (gtDs || predDs)
        if (!dsToUse) throw new Error('Missing /pred or /gt dataset')

        const s = rawDs.shape || []
        if (s.length !== 3) throw new Error(`Expected 3D volume, got ${s.length}D`)

        const [dimZ, dimY, dimX] = s as number[]
        const nextShape: VolumeShape = { z: dimZ, y: dimY, x: dimX }

        const mask = dsToUse.value as any
        // 这里假设 jsfive 返回的是扁平化数组（与 H5Viewer2D 逻辑一致）
        if (!(mask instanceof Uint8Array || mask instanceof Float32Array || Array.isArray(mask))) {
          throw new Error('Unsupported mask data format')
        }

        const pts = buildPointCloudFromMask({
          mask,
          shape: nextShape,
          threshold: 127,
          maxPoints: 90000,
        })

        if (cancelled) return
        setShape(nextShape)
        setPositions(pts)
        setLoading(false)
      } catch (e: any) {
        if (cancelled) return
        setError(e?.message || 'Failed to load 3D reconstruction')
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [fileUrl, mode])

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-black ${className}`}>
      <div className="absolute left-3 top-3 z-10 rounded-lg bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        3D Reconstruction ({mode.toUpperCase()})
      </div>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-200">
          Loading 3D...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="h-[500px]">
        <Canvas camera={{ position: [2.2, 1.6, 2.2], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 4, 4]} intensity={1.2} />

          {positions && <PointsCloud positions={positions} />}
          {shape && <SlicePlane shape={shape} sliceX={sliceIndex} />}

          <OrbitControls enablePan={false} enableZoom enableRotate />
        </Canvas>
      </div>
    </div>
  )
}

