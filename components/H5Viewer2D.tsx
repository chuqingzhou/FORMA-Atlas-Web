'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface H5Viewer2DProps {
  fileUrl?: string
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
  className?: string
}

export default function H5Viewer2D({ fileUrl, metadata, className = '' }: H5Viewer2DProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [currentSlice, setCurrentSlice] = useState(0)
  const [zoom, setZoom] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 计算切片数量（使用 shape.z 或 bbox）
  const maxSlices = metadata?.shape?.z || metadata?.bbox ? (metadata.bbox?.max_z || 0) - (metadata.bbox?.min_z || 0) + 1 : 1

  useEffect(() => {
    if (!fileUrl || !metadata) {
      setError('缺少文件 URL 或元数据')
      return
    }

    // 由于 H5 文件需要特殊的库来解析，这里先创建一个占位符可视化
    // 实际实现需要使用 h5py 或类似的库在服务端处理
    setLoading(true)
    setError(null)

    // 模拟加载（实际应该加载 H5 文件并提取切片）
    setTimeout(() => {
      // 创建一个简单的测试图像（实际应该从 H5 文件加载）
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const width = metadata.shape?.x || 100
          const height = metadata.shape?.y || 100
          canvas.width = width
          canvas.height = height

          // 创建一个简单的测试模式
          const imageData = ctx.createImageData(width, height)
          for (let i = 0; i < imageData.data.length; i += 4) {
            const x = (i / 4) % width
            const y = Math.floor((i / 4) / width)
            const slicePos = currentSlice / maxSlices
            const value = Math.sin((x / width + slicePos) * Math.PI * 4) * 127 + 128
            imageData.data[i] = value     // R
            imageData.data[i + 1] = value // G
            imageData.data[i + 2] = value // B
            imageData.data[i + 3] = 255   // A
          }
          ctx.putImageData(imageData, 0, 0)
          setImageData(imageData)
        }
      }
      setLoading(false)
    }, 500)
  }, [fileUrl, metadata, currentSlice, maxSlices])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleNextSlice = () => {
    setCurrentSlice(prev => Math.min(prev + 1, maxSlices - 1))
  }

  const handlePrevSlice = () => {
    setCurrentSlice(prev => Math.max(prev - 1, 0))
  }

  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden ${className}`} ref={containerRef}>
      {/* 工具栏 */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlice}
              disabled={currentSlice === 0}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ←
            </button>
            <span className="text-white text-sm min-w-[100px] text-center">
              Slice {currentSlice + 1} / {maxSlices}
            </span>
            <button
              onClick={handleNextSlice}
              disabled={currentSlice >= maxSlices - 1}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              →
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-white text-sm min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>
        {metadata?.organoid_volume_voxels && (
          <div className="text-white text-sm">
            Volume: {metadata.organoid_volume_voxels.toLocaleString()} voxels
          </div>
        )}
      </div>

      {/* 画布容器 */}
      <div className="relative bg-black flex items-center justify-center" style={{ height: '600px' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading H5 data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-red-400 text-center px-4">
              <p className="text-lg font-semibold mb-2">Error</p>
              <p>{error}</p>
              <p className="text-sm mt-4 text-gray-400">
                Note: H5 file visualization requires server-side processing.
                This is a placeholder implementation.
              </p>
            </div>
          </div>
        )}

        <div
          className="relative"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full"
            style={{
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </div>

      {/* 信息栏 */}
      {metadata && (
        <div className="bg-gray-800 px-4 py-2 text-white text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metadata.shape && (
              <>
                <div>
                  <span className="text-gray-400">Size: </span>
                  {metadata.shape.x} × {metadata.shape.y} × {metadata.shape.z}
                </div>
                {metadata.bbox && (
                  <div>
                    <span className="text-gray-400">BBox: </span>
                    [{metadata.bbox.min_x}, {metadata.bbox.min_y}, {metadata.bbox.min_z}] to [{metadata.bbox.max_x}, {metadata.bbox.max_y}, {metadata.bbox.max_z}]
                  </div>
                )}
              </>
            )}
            <div>
              <span className="text-gray-400">File: </span>
              {fileUrl ? 'Loaded' : 'Not available'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

