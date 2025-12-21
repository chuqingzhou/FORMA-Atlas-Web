'use client'

import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface MRIViewerProps {
  volumePath?: string
  className?: string
  metadata?: {
    bbox?: {
      min_z?: number
      max_z?: number
      min_y?: number
      max_y?: number
      min_x?: number
      max_x?: number
    }
    shape?: {
      z?: number
      y?: number
      x?: number
    }
    organoid_volume_voxels?: number
    [key: string]: any
  }
}

export default function MRIViewer({ volumePath, className = '', metadata }: MRIViewerProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (meshRef.current) {
      // Rotate the mesh for animation
      const animate = () => {
        if (meshRef.current) {
          meshRef.current.rotation.y += 0.005
        }
        requestAnimationFrame(animate)
      }
      animate()
    }
  }, [])

  return (
    <div className={`w-full h-full bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        
        {/* Placeholder brain organoid visualization */}
        <mesh ref={meshRef}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            wireframe={false}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Additional visualization elements */}
        <mesh position={[-1.5, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
        
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#ec4899" />
        </mesh>

        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
      
      {!volumePath && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm">
          {metadata ? 'Loading H5 volume data...' : 'Placeholder visualization - Load MRI volume data to view actual scan'}
        </div>
      )}
      {volumePath && metadata && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded text-sm">
          <div>H5 Volume Data Loaded</div>
          {metadata.organoid_volume_voxels && (
            <div className="text-xs mt-1">Volume: {metadata.organoid_volume_voxels.toLocaleString()} voxels</div>
          )}
        </div>
      )}
    </div>
  )
}

