'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { File } from 'jsfive'

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
  const [dimension, setDimension] = useState<Dimension>('z')
  const [showPrediction, setShowPrediction] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const h5FileRef = useRef<any>(null)

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

  const maxSlices = getMaxSlices(dimension)

  // 当维度改变时，重置切片索引
  useEffect(() => {
    setCurrentSlice(0)
  }, [dimension])

  // 加载H5文件
  useEffect(() => {
    if (!fileUrl) {
      setError('缺少文件 URL')
      return
    }

    const loadH5File = async () => {
      try {
        setLoading(true)
        setError(null)

        // 下载H5文件
        const response = await fetch(fileUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch H5 file: ${response.statusText}`)
        }
        
        const arrayBuffer = await response.arrayBuffer()
        
        // 使用jsfive解析H5文件
        const h5File = new File(arrayBuffer)
        h5FileRef.current = h5File
        
        setLoading(false)
      } catch (err: any) {
        console.error('Error loading H5 file:', err)
        setError(err.message || '加载H5文件失败')
        setLoading(false)
      }
    }

    loadH5File()
  }, [fileUrl])

  // 读取并显示切片
  useEffect(() => {
    if (!h5FileRef.current || !canvasRef.current || loading) {
      return
    }

    const loadSlice = async () => {
      try {
        setLoading(true)
        setError(null)

        const h5File = h5FileRef.current
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // 读取raw数据集
        const rawDataset = h5File.get('/raw')
        if (!rawDataset) {
          throw new Error('找不到 raw 数据集')
        }

        // 获取数据形状
        const shape = rawDataset.shape || []
        if (shape.length !== 3) {
          throw new Error(`预期的3D数据，但得到 ${shape.length}D 数据`)
        }

        const [dimZ, dimY, dimX] = shape

        // 根据维度提取切片
        let sliceRaw: Float32Array | Uint8Array
        let slicePred: Float32Array | Uint8Array | null = null
        let width: number, height: number

        if (dimension === 'z') {
          // Z维度：显示X-Y平面 (Z slice)
          const sliceIdx = Math.min(currentSlice, dimZ - 1)
          width = dimX
          height = dimY
          
          // 读取切片数据
          const rawData = rawDataset.value as any
          // jsfive返回的数据可能需要特殊处理
          if (rawData instanceof Float32Array || rawData instanceof Uint8Array) {
            // 如果是完整的3D数组，需要提取切片
            sliceRaw = new Float32Array(width * height)
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const idx3D = sliceIdx * dimY * dimX + y * dimX + x
                sliceRaw[y * width + x] = rawData[idx3D]
              }
            }
          } else {
            // 如果已经是2D数组
            sliceRaw = rawData[sliceIdx]
          }

          // 读取prediction数据集
          if (showPrediction) {
            const predDataset = h5File.get('/prediction')
            if (predDataset) {
              const predData = predDataset.value as any
              if (predData instanceof Float32Array || predData instanceof Uint8Array) {
                slicePred = new Float32Array(width * height)
                for (let y = 0; y < height; y++) {
                  for (let x = 0; x < width; x++) {
                    const idx3D = sliceIdx * dimY * dimX + y * dimX + x
                    slicePred[y * width + x] = predData[idx3D]
                  }
                }
              } else {
                slicePred = predData[sliceIdx]
              }
            }
          }
        } else if (dimension === 'y') {
          // Y维度：显示X-Z平面 (Y slice)
          const sliceIdx = Math.min(currentSlice, dimY - 1)
          width = dimX
          height = dimZ
          
          const rawData = rawDataset.value as any
          sliceRaw = new Float32Array(width * height)
          for (let z = 0; z < height; z++) {
            for (let x = 0; x < width; x++) {
              const idx3D = z * dimY * dimX + sliceIdx * dimX + x
              sliceRaw[z * width + x] = rawData[idx3D]
            }
          }

          if (showPrediction) {
            const predDataset = h5File.get('/prediction')
            if (predDataset) {
              const predData = predDataset.value as any
              slicePred = new Float32Array(width * height)
              for (let z = 0; z < height; z++) {
                for (let x = 0; x < width; x++) {
                  const idx3D = z * dimY * dimX + sliceIdx * dimX + x
                  slicePred[z * width + x] = predData[idx3D]
                }
              }
            }
          }
        } else {
          // X维度：显示Y-Z平面 (X slice)
          const sliceIdx = Math.min(currentSlice, dimX - 1)
          width = dimY
          height = dimZ
          
          const rawData = rawDataset.value as any
          sliceRaw = new Float32Array(width * height)
          for (let z = 0; z < height; z++) {
            for (let y = 0; y < width; y++) {
              const idx3D = z * dimY * dimX + y * dimX + sliceIdx
              sliceRaw[z * width + y] = rawData[idx3D]
            }
          }

          if (showPrediction) {
            const predDataset = h5File.get('/prediction')
            if (predDataset) {
              const predData = predDataset.value as any
              slicePred = new Float32Array(width * height)
              for (let z = 0; z < height; z++) {
                for (let y = 0; y < width; y++) {
                  const idx3D = z * dimY * dimX + y * dimX + sliceIdx
                  slicePred[z * width + y] = predData[idx3D]
                }
              }
            }
          }
        }

        // 设置画布尺寸
        canvas.width = width
        canvas.height = height

        // 创建图像数据
        const imageData = ctx.createImageData(width, height)

        // 归一化raw数据到0-255
        let min = Number.MAX_VALUE
        let max = Number.MIN_VALUE
        for (let i = 0; i < sliceRaw.length; i++) {
          const val = sliceRaw[i]
          if (val < min) min = val
          if (val > max) max = val
        }
        const range = max - min || 1

        // 填充原始数据（灰度图）
        for (let i = 0; i < sliceRaw.length; i++) {
          const y = Math.floor(i / width)
          const x = i % width
          const idx = (y * width + x) * 4
          const normalizedValue = ((sliceRaw[i] - min) / range * 255) | 0
          
          imageData.data[idx] = normalizedValue     // R
          imageData.data[idx + 1] = normalizedValue // G
          imageData.data[idx + 2] = normalizedValue // B
          imageData.data[idx + 3] = 255             // A
        }

        // 如果有预测数据，叠加红色半透明的预测mask
        if (showPrediction && slicePred) {
          for (let i = 0; i < slicePred.length; i++) {
            if (slicePred[i] > 0.5) { // 预测区域阈值
              const y = Math.floor(i / width)
              const x = i % width
              const idx = (y * width + x) * 4
              
              // 叠加红色，半透明
              imageData.data[idx] = Math.min(255, imageData.data[idx] * 0.7 + 200 * 0.3)     // R
              imageData.data[idx + 1] = Math.min(255, imageData.data[idx + 1] * 0.7)         // G
              imageData.data[idx + 2] = Math.min(255, imageData.data[idx + 2] * 0.7)         // B
            }
          }
        }

        ctx.putImageData(imageData, 0, 0)
        setImageData(imageData)
        setLoading(false)
      } catch (err: any) {
        console.error('Error loading slice:', err)
        setError(err.message || '加载切片数据失败')
        setLoading(false)
      }
    }

    loadSlice()
  }, [fileUrl, currentSlice, maxSlices, dimension, showPrediction, loading])

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
          
          {/* 显示/隐藏预测叠加 */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showPrediction}
                onChange={(e) => setShowPrediction(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
              />
              <span>Show Prediction</span>
            </label>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {metadata?.organoid_volume_voxels && (
            <div className="text-white text-sm">
              Volume: {metadata.organoid_volume_voxels.toLocaleString()} voxels
            </div>
          )}
        </div>
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
                请检查H5文件URL是否正确，以及文件格式是否支持。
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
