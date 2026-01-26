/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import React, { useEffect, useMemo, useState } from 'react'
import { File } from 'jsfive'
import * as THREE from 'three'

type VolumeShape = { y: number; x: number; z: number } // (y,x,z)
type Spacing = { y: number; x: number; z: number }

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

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function colorWhiteToOrangeRed(t01: number) {
  // t=0 -> 橙红；t=1 -> 白（与 Step4e 颜色方向一致：高强度更白）
  const t = Math.max(0, Math.min(1, t01))
  const low = new THREE.Color('#ff4500')
  const high = new THREE.Color('#ffffff')
  return new THREE.Color(lerp(low.r, high.r, t), lerp(low.g, high.g, t), lerp(low.b, high.b, t))
}

function buildCrossSectionPoints(args: {
  raw: ArrayLike<number>
  mask: ArrayLike<number>
  shape: VolumeShape
  spacing: Spacing
  threshold: number
  zSlice: number
  zThickness?: number // 0=仅该slice；1=±1；2=±2...
  maxPoints?: number
}) {
  const { raw, mask, shape, spacing, threshold, zSlice, zThickness = 1, maxPoints = 25000 } = args
  const dimY = shape.y
  const dimX = shape.x
  const dimZ = shape.z

  const z0 = Math.max(0, zSlice - zThickness)
  const z1 = Math.min(dimZ - 1, zSlice + zThickness)

  const lenX = Math.max(1e-8, (dimX - 1) * spacing.x)
  const lenY = Math.max(1e-8, (dimY - 1) * spacing.y)
  const lenZ = Math.max(1e-8, (dimZ - 1) * spacing.z)
  const lenMax = Math.max(lenX, lenY, lenZ)
  const halfX = 0.9 * (lenX / lenMax)
  const halfY = 0.9 * (lenY / lenMax)
  const halfZ = 0.9 * (lenZ / lenMax)

  const idx = (y: number, x: number, z: number) => (y * dimX + x) * dimZ + z

  // 先收集点与强度，统计 min/max
  const positions: number[] = []
  const intensities: number[] = []
  let vMin = Number.POSITIVE_INFINITY
  let vMax = Number.NEGATIVE_INFINITY

  // 简单下采样：只在 y/x 维做 step
  const total2d = dimY * dimX
  const step = total2d > 80_000 ? 2 : 1

  for (let y = 0; y < dimY; y += step) {
    for (let x = 0; x < dimX; x += step) {
      for (let z = z0; z <= z1; z++) {
        if ((mask[idx(y, x, z)] as number) <= threshold) continue
        const v = raw[idx(y, x, z)] as number
        if (Number.isFinite(v)) {
          if (v < vMin) vMin = v
          if (v > vMax) vMax = v
        }

        const tx = dimX <= 1 ? 0 : x / (dimX - 1)
        const ty = dimY <= 1 ? 0 : y / (dimY - 1)
        const tz = dimZ <= 1 ? 0 : z / (dimZ - 1)
        const nx = (tx - 0.5) * 2 * halfX
        const ny = (ty - 0.5) * 2 * halfY
        const nz = (tz - 0.5) * 2 * halfZ
        positions.push(nx, nz, ny)
        intensities.push(v)

        if (positions.length / 3 >= maxPoints) break
      }
      if (positions.length / 3 >= maxPoints) break
    }
    if (positions.length / 3 >= maxPoints) break
  }

  if (!Number.isFinite(vMin) || !Number.isFinite(vMax) || Math.abs(vMax - vMin) < 1e-12) {
    vMin = 0
    vMax = 1
  }

  const colors: number[] = []
  for (let i = 0; i < intensities.length; i++) {
    const t = (intensities[i] - vMin) / (vMax - vMin)
    const c = colorWhiteToOrangeRed(t)
    colors.push(c.r, c.g, c.b)
  }

  return { positions: new Float32Array(positions), colors: new Float32Array(colors) }
}

function InstancedSpheresColored({
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
        opacity: 0.95,
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

export default function H5Step4ECrossSection3D({
  fileUrl,
  zSlice = 8,
  zThickness = 1,
  mode = 'pred',
  className = '',
  heightClass = 'h-[520px]',
}: {
  fileUrl: string
  zSlice?: number
  zThickness?: number
  mode?: 'pred' | 'gt'
  className?: string
  heightClass?: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [positions, setPositions] = useState<Float32Array | null>(null)
  const [colors, setColors] = useState<Float32Array | null>(null)
  const [shape, setShape] = useState<VolumeShape | null>(null)
  const [_spacing, setSpacing] = useState<Spacing>(DEFAULT_SPACING)

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

        const raw = rawDs.value as any
        const mask = maskDs.value as any
        if (!(raw instanceof Float32Array || raw instanceof Uint8Array || Array.isArray(raw))) throw new Error('Unsupported raw data format')
        if (!(mask instanceof Uint8Array || mask instanceof Float32Array || Array.isArray(mask))) throw new Error('Unsupported mask data format')

        const thr = inferThreshold(mask)

        const { positions: pts, colors: cols } = buildCrossSectionPoints({
          raw,
          mask,
          shape: nextShape,
          spacing: spacingAttr,
          threshold: thr,
          zSlice: Math.max(0, Math.min(dimZ - 1, zSlice)),
          zThickness: Math.max(0, zThickness),
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
        setError(e?.message || 'Failed to load Step4e cross-section')
        setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [fileUrl, mode, zSlice, zThickness])

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-black ${className}`}>
      <div className="absolute left-3 top-3 z-10 rounded-lg bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
        Step4e Cross-section (z={zSlice}, ±{zThickness}) ({mode.toUpperCase()})
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

          {positions && colors && <InstancedSpheresColored positions={positions} colors={colors} />}

          {/* 参考平面：让截面更“像图” */}
          {shape && (
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[1.8, 1.8, 1, 1]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.03} side={THREE.DoubleSide} />
            </mesh>
          )}

          <ContactShadows position={[0, -1.05, 0]} opacity={0.35} blur={2.5} far={2.5} scale={6} />
          <OrbitControls enablePan={false} enableZoom enableRotate />
        </Canvas>
      </div>
    </div>
  )
}

