'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url)

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    cloned.traverse((obj: any) => {
      if (obj?.isMesh) {
        obj.castShadow = true
        obj.receiveShadow = true
        if (obj.material) {
          obj.material = new THREE.MeshStandardMaterial({
            color: '#38bdf8',
            metalness: 0.15,
            roughness: 0.35,
            transparent: true,
            opacity: 0.95,
          })
        }
      }
    })
    return cloned
  }, [gltf.scene])

  return <primitive object={scene} />
}

export default function MorphologyGLBPreview({
  className = '',
  url = '/showcase/morphology_example.glb',
}: {
  className?: string
  url?: string
}) {
  return (
    <div className={`relative h-56 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-950 to-black ${className}`}>
      <Canvas
        camera={{ position: [0, 0.2, 2.2], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <pointLight position={[-3, -2, -2]} intensity={0.7} />

        <Suspense fallback={null}>
          <group position={[0, -0.25, 0]}>
            <Model url={url} />
          </group>
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 ring-1 ring-white/10" />
    </div>
  )
}

useGLTF.preload('/showcase/morphology_example.glb')

