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

type Dimension = 'x' | 'y' | 'z'

export default function H5Viewer2D({ fileUrl, metadata, className = '' }: H5Viewer2DProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [currentSlice, setCurrentSlice] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [dimension, setDimension] = useState<Dimension>('z') // 默认 Z 维度
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 根据选择的维度计算切片数量
  const getMaxSlices = (dim: Dimension): number => {
    if (!metadata?.shape) return 1
    
    switch (dim) {
      case 'x':
        return metadata.shape.x || 1
      case 'y':
        return metadata.shape.y || 1
      case 'z':
        return metadata.shape.z || 1
      default:
        return 1
    }
  }

  // 根据维度获取显示的尺寸
  const getDisplayDimensions = (dim: Dimension): { width: number; height: number } => {
    if (!metadata?.shape) return { width: 100, height: 100 }
    
    switch (dim) {
      case 'x':
        return { width: metadata.shape.y || 100, height: metadata.shape.z || 100 }
      case 'y':
        return { width: metadata.shape.x || 100, height: metadata.shape.z || 100 }
      case 'z':
        return { width: metadata.shape.x || 100, height: metadata.shape.y || 100 }
      default:
        return { width: 100, height: 100 }
    }
  }

  const maxSlices = getMaxSlices(dimension)

  // 当维度改变时，重置切片索引
  useEffect(() => {
    setCurrentSlice(0)
  }, [dimension])

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
          const { width, height } = getDisplayDimensions(dimension)
          canvas.width = width
          canvas.height = height

          // 创建一个简单的测试模式，根据维度显示不同的模式
          const imageData = ctx.createImageData(width, height)
          for (let i = 0; i < imageData.data.length; i += 4) {
            const x = (i / 4) % width
            const y = Math.floor((i / 4) / width)
            const slicePos = currentSlice / maxSlices
            
            // 根据维度创建不同的可视化模式
            let value = 128
            if (dimension === 'x') {
              // X 维度：显示 Y-Z 平面
              value = Math.sin((y / height + slicePos) * Math.PI * 4) * Math.cos((x / width) * Math.PI * 2) * 127 + 128
            } else if (dimension === 'y') {
              // Y 维度：显示 X-Z 平面
              value = Math.sin((x / width + slicePos) * Math.PI * 4) * Math.cos((y / height) * Math.PI * 2) * 127 + 128
            } else {
              // Z 维度：显示 X-Y 平面（默认）
              value = Math.sin((x / width + slicePos) * Math.PI * 4) * 127 + 128
            }
            
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
    }, 300)
  }, [fileUrl, metadata, currentSlice, maxSlices, dimension])

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
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          {/* 维度选择 */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">Dimension:</span>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value as Dimension)}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-sm border border-gray-600"
            >
              <option value="x">X (Y-Z plane)</option>
              <option value="y">Y (X-Z plane)</option>
              <option value="z">Z (X-Y plane)</option>
            </select>
          </div>
          
          {/* 切片导航 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlice}
              disabled={currentSlice === 0}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              ←
            </button>
            <span className="text-white text-sm min-w-[120px] text-center">
              {dimension.toUpperCase()} Slice {currentSlice + 1} / {maxSlices}
            </span>
            <button
              onClick={handleNextSlice}
              disabled={currentSlice >= maxSlices - 1}
              className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              →
            </button>
          </div>
          
          {/* 缩放控制 */}
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
                <div>
                  <span className="text-gray-400">Viewing: </span>
                  {dimension.toUpperCase()}-dimension ({dimension === 'x' ? 'Y-Z plane' : dimension === 'y' ? 'X-Z plane' : 'X-Y plane'})
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

