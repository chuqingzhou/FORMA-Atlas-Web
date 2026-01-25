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
  const { mask, shape, threshold = 0, maxPoints = 90000 } = args
  const dimZ = shape.z
  const dimY = shape.y
  const dimX = shape.x

  // 自适应下采样，避免点过多卡顿
  const total = dimZ * dimY * dimX
  const step = total > 1_200_000 ? 3 : total > 600_000 ? 2 : 1

  const positions: number[] = []

  // 映射到固定大小的包围盒（约 [-0.9, 0.9]），避免点云跑出相机视野
  const dimMax = Math.max(dimX, dimY, dimZ)
  const halfX = 0.9 * (dimX / dimMax)
  const halfY = 0.9 * (dimY / dimMax)
  const halfZ = 0.9 * (dimZ / dimMax)

  for (let z = 0; z < dimZ; z += step) {
    for (let y = 0; y < dimY; y += step) {
      const base = z * dimY * dimX + y * dimX
      for (let x = 0; x < dimX; x += step) {
        const v = mask[base + x] as number
        if (v > threshold) {
          const tx = dimX <= 1 ? 0 : x / (dimX - 1)
          const ty = dimY <= 1 ? 0 : y / (dimY - 1)
          const tz = dimZ <= 1 ? 0 : z / (dimZ - 1)

          const nx = (tx - 0.5) * 2 * halfX
          const ny = (ty - 0.5) * 2 * halfY
          const nz = (tz - 0.5) * 2 * halfZ

          // 坐标系：X=原x，Y=原z，Z=原y（更接近“竖直为z”的观感）
          positions.push(nx, nz, ny)
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
  const dimMax = Math.max(shape.x, shape.y, shape.z)
  const halfX = 0.9 * (shape.x / dimMax)
  const halfY = 0.9 * (shape.y / dimMax)
  const halfZ = 0.9 * (shape.z / dimMax)
  const xPos = (t - 0.5) * 2 * halfX

  return (
    <mesh position={[xPos, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      {/* 旋转使平面法向量沿 X（切片面为 Y-Z） */}
      <planeGeometry args={[2 * halfY, 2 * halfZ, 1, 1]} />
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
  const pointsCount = positions ? Math.floor(positions.length / 3) : 0

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

        // pred/gt 有的文件是 0/1，有的是 0/255；自适应选择阈值
        let maxVal = 0
        const sampleN = 4096
        const stepSample = Math.max(1, Math.floor((mask.length || 1) / sampleN))
        for (let i = 0; i < (mask.length || 0); i += stepSample) {
          const v = mask[i] as number
          if (v > maxVal) maxVal = v
          if (maxVal >= 255) break
        }
        const thr = maxVal <= 1 ? 0 : 127

        const pts = buildPointCloudFromMask({
          mask,
          shape: nextShape,
          threshold: thr,
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
      <div className="absolute right-3 top-3 z-10 rounded-lg bg-black/55 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
        points: {pointsCount.toLocaleString()}
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

