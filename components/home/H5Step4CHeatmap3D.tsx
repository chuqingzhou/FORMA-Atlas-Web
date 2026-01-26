/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import React, { useEffect, useMemo, useState } from 'react'
import { File } from 'jsfive'
import * as THREE from 'three'

type VolumeShape = { y: number; x: number; z: number }
type Spacing = { y: number; x: number; z: number }

// 论文 Step4c 的配色：白 -> 黄 -> 橙 -> 深红
const CURVATURE_COLORS = [
  { t: 0.0, c: new THREE.Color('#ffffff') },
  { t: 0.2, c: new THREE.Color('#ffeb3b') },
  { t: 0.4, c: new THREE.Color('#ff9800') },
  { t: 1.0, c: new THREE.Color('#c62828') },
]

const DEFAULT_SPACING: Spacing = { y: 0.16, x: 0.16, z: 0.3 }

function readAttr(ds: any, key: string) {
  try {
    if (ds?.attrs) {
      if (typeof ds.attrs.get === 'function') return ds.attrs.get(key)
      if (key in ds.attrs) return ds.attrs[key]
    }
    if (ds?.attributes) {
      if (typeof ds.attributes.get === 'function') return ds.attributes.get(key)
      if (key in ds.attributes) return ds.attributes[key]
    }
  } catch {
    // ignore
  }
  return undefined
}

function parseSpacing(v: unknown): Spacing | null {
  if (!v) return null
  if (Array.isArray(v) && v.length >= 3) {
    const y = Number(v[0])
    const x = Number(v[1])
    const z = Number(v[2])
    if (Number.isFinite(y) && Number.isFinite(x) && Number.isFinite(z)) return { y, x, z }
  }
  if (typeof v === 'object') {
    const anyV = v as any
    const y = Number(anyV.y)
    const x = Number(anyV.x)
    const z = Number(anyV.z)
    if (Number.isFinite(y) && Number.isFinite(x) && Number.isFinite(z)) return { y, x, z }
  }
  return null
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function colorFromCurvatureScore(score01: number): THREE.Color {
  const t = Math.max(0, Math.min(1, score01))
  for (let i = 0; i < CURVATURE_COLORS.length - 1; i++) {
    const a = CURVATURE_COLORS[i]
    const b = CURVATURE_COLORS[i + 1]
    if (t >= a.t && t <= b.t) {
      const u = (t - a.t) / Math.max(1e-8, b.t - a.t)
      return new THREE.Color(
        lerp(a.c.r, b.c.r, u),
        lerp(a.c.g, b.c.g, u),
        lerp(a.c.b, b.c.b, u),
      )
    }
  }
  return CURVATURE_COLORS[CURVATURE_COLORS.length - 1].c.clone()
}

function inferThreshold(mask: any): number {
  let maxVal = 0
  const n = mask?.length || 0
  const sampleN = 4096
  const stepSample = Math.max(1, Math.floor(n / sampleN))
  for (let i = 0; i < n; i += stepSample) {
    const v = mask[i] as number
    if (v > maxVal) maxVal = v
    if (maxVal >= 255) break
  }
  return maxVal <= 1 ? 0 : 127
}

function buildSurfaceHeatPoints(args: {
  mask: ArrayLike<number>
  shape: VolumeShape // (y,x,z)
  spacing: Spacing
  threshold: number
  maxPoints?: number
}) {
  const { mask, shape, spacing, threshold, maxPoints = 25000 } = args
  const dimY = shape.y
  const dimX = shape.x
  const dimZ = shape.z

  const total = dimY * dimX * dimZ
  const step = total > 1_200_000 ? 3 : total > 600_000 ? 2 : 1

  const lenX = Math.max(1e-8, (dimX - 1) * spacing.x)
  const lenY = Math.max(1e-8, (dimY - 1) * spacing.y)
  const lenZ = Math.max(1e-8, (dimZ - 1) * spacing.z)
  const lenMax = Math.max(lenX, lenY, lenZ)
  const halfX = 0.9 * (lenX / lenMax)
  const halfY = 0.9 * (lenY / lenMax)
  const halfZ = 0.9 * (lenZ / lenMax)

  const positions: number[] = []
  const colors: number[] = []

  const idx = (y: number, x: number, z: number) => (y * dimX + x) * dimZ + z
  const isOn = (y: number, x: number, z: number) => (mask[idx(y, x, z)] as number) > threshold

  for (let y = 0; y < dimY; y += step) {
    for (let x = 0; x < dimX; x += step) {
      for (let z = 0; z < dimZ; z += step) {
        if (!isOn(y, x, z)) continue

        // 只保留“表面体素”：26 邻域不是全满
        let neigh = 0
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy
          if (yy < 0 || yy >= dimY) continue
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx
            if (xx < 0 || xx >= dimX) continue
            for (let dz = -1; dz <= 1; dz++) {
              if (dy === 0 && dx === 0 && dz === 0) continue
              const zz = z + dz
              if (zz < 0 || zz >= dimZ) continue
              if (isOn(yy, xx, zz)) neigh++
            }
          }
        }
        if (neigh >= 26) continue

        // “曲率”代理：邻域越不满，越接近高曲率/边缘
        const score = 1 - neigh / 26
        const c = colorFromCurvatureScore(score)

        const tx = dimX <= 1 ? 0 : x / (dimX - 1)
        const ty = dimY <= 1 ? 0 : y / (dimY - 1)
        const tz = dimZ <= 1 ? 0 : z / (dimZ - 1)
        const nx = (tx - 0.5) * 2 * halfX
        const ny = (ty - 0.5) * 2 * halfY
        const nz = (tz - 0.5) * 2 * halfZ

        // 坐标系：X=原x，Y=原z，Z=原y（与现有 3D 一致）
        positions.push(nx, nz, ny)
        colors.push(c.r, c.g, c.b)

        if (positions.length / 3 >= maxPoints) {
          return {
            positions: new Float32Array(positions),
            colors: new Float32Array(colors),
          }
        }
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
  }
}

function InstancedSpheresHeatmap({
  positions,
  colors,
  radius = 0.018,
}: {
  positions: Float32Array
  colors: Float32Array
  radius?: number
}) {
  const count = Math.floor(positions.length / 3)
  const geometry = useMemo(() => new THREE.SphereGeometry(radius, 7, 7), [radius])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        metalness: 0.05,
        roughness: 0.55,
        transparent: true,
        opacity: 0.93,
      }),
    [],
  )

  const mesh = useMemo(() => {
    const m = new THREE.InstancedMesh(geometry, material, count)
    m.castShadow = true
    m.receiveShadow = false
    return m
  }, [geometry, material, count])

  useEffect(() => {
    const tmp = new THREE.Object3D()
    const col = new THREE.Color()
    for (let i = 0; i < count; i++) {
      tmp.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2])
      tmp.updateMatrix()
      mesh.setMatrixAt(i, tmp.matrix)

      col.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2])
      // @ts-ignore three typings
      mesh.setColorAt(i, col)
    }
    mesh.instanceMatrix.needsUpdate = true
    // @ts-ignore three typings
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [mesh, positions, colors, count])

  useEffect(() => {
    return () => {
      mesh.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [mesh, geometry, material])

  return <primitive object={mesh} />
}

export default function H5Step4CHeatmap3D({
  fileUrl,
  sliceIndex,
  mode = 'pred',
  className = '',
  heightClass = 'h-[520px]',
}: {
  fileUrl: string
  sliceIndex: number
  mode?: 'pred' | 'gt'
  className?: string
  heightClass?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shape, setShape] = useState<VolumeShape | null>(null)
  const [positions, setPositions] = useState<Float32Array | null>(null)
  const [colors, setColors] = useState<Float32Array | null>(null)
  const [spacing, setSpacing] = useState<Spacing>(DEFAULT_SPACING)

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

        const maskDs = mode === 'pred' ? (predDs || gtDs) : (gtDs || predDs)
        if (!maskDs) throw new Error('Missing /pred or /gt dataset')

        const s = rawDs.shape || []
        if (s.length !== 3) throw new Error(`Expected 3D volume, got ${s.length}D`)
        const [dimY, dimX, dimZ] = s as number[]
        const nextShape: VolumeShape = { y: dimY, x: dimX, z: dimZ }

        const spacingAttr = parseSpacing(readAttr(rawDs, 'spacing')) || DEFAULT_SPACING

        const mask = maskDs.value as any
        if (!(mask instanceof Uint8Array || mask instanceof Float32Array || Array.isArray(mask))) {
          throw new Error('Unsupported mask data format')
        }
        const thr = inferThreshold(mask)

        const { positions: pts, colors: cols } = buildSurfaceHeatPoints({
          mask,
          shape: nextShape,
          spacing: spacingAttr,
          threshold: thr,
          maxPoints: 25000,
        })

        if (cancelled) return
        setShape(nextShape)
        setSpacing(spacingAttr)
        setPositions(pts)
        setColors(cols)
        setLoading(false)
      } catch (e: any) {
        if (cancelled) return
        setError(e?.message || 'Failed to load Step4c heatmap')
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
        Step4c Heatmap 3D ({mode.toUpperCase()})
      </div>

      {loading && <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-200">Loading 3D...</div>}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      <div className={heightClass}>
        <Canvas shadows camera={{ position: [2.2, 1.6, 2.2], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <color attach="background" args={['#05070b']} />
          <fog attach="fog" args={['#05070b', 2.6, 7.5]} />

          <ambientLight intensity={0.35} />
          <hemisphereLight intensity={0.4} groundColor="#0b1220" />
          <directionalLight position={[4, 5, 3]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <Environment preset="city" />

          {positions && colors && <InstancedSpheresHeatmap positions={positions} colors={colors} />}

          {/* 参考切片平面（沿 X 切） */}
          {shape && (
            <mesh position={[(sliceIndex / Math.max(1, shape.x - 1) - 0.5) * 2 * 0.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[1.8, 1.8, 1, 1]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
            </mesh>
          )}

          <ContactShadows position={[0, -1.05, 0]} opacity={0.35} blur={2.5} far={2.5} scale={6} />
          <OrbitControls enablePan={false} enableZoom enableRotate />
        </Canvas>
      </div>
    </div>
  )
}

