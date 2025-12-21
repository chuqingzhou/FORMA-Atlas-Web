'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { File } from 'jsfive'

interface H5Viewer2DProps {
  fileUrl?: string
  filePath?: string // 文件在Storage中的路径（用于生成signed URL）
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
  hasPermission?: boolean
  accessToken?: string // 用户访问token
}

type Dimension = 'x' | 'y' | 'z'

const ALLOWED_EMAIL = 'chuqingz@126.com'

export default function H5Viewer2D({ fileUrl, filePath, metadata, className = '', hasPermission = true, accessToken }: H5Viewer2DProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [currentSlice, setCurrentSlice] = useState(0)
  const [zoom, setZoom] = useState(2) // 默认200%放大
  const [dimension] = useState<Dimension>('x') // 固定使用X维度（Y-Z平面）
  const [showPrediction, setShowPrediction] = useState(false)
  const [secureFileUrl, setSecureFileUrl] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const h5FileRef = useRef<any>(null)

  // 固定使用X维度，计算切片数量
  const maxSlices = metadata?.shape?.x || 1

  // 检查权限
  useEffect(() => {
    if (!hasPermission) {
      setError('权限不足：请联系管理员开启访问权限')
      setLoading(false)
      return
    }
  }, [hasPermission])

  // 获取安全的signed URL
  useEffect(() => {
    // 如果有fileUrl（public URL），且没有filePath，直接使用fileUrl（向后兼容）
    if (fileUrl && !filePath) {
      setSecureFileUrl(fileUrl)
      return
    }

    // 如果有filePath，尝试获取signed URL
    if (!hasPermission || !filePath) {
      return
    }

    // 如果没有accessToken，尝试使用fileUrl作为fallback（如果bucket还是public）
    if (!accessToken && fileUrl) {
      console.warn('No accessToken provided, using fileUrl as fallback')
      setSecureFileUrl(fileUrl)
      return
    }

    if (!accessToken) {
      setError('缺少访问令牌，无法获取文件')
      return
    }

    const fetchSecureUrl = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/h5-file-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filePath,
            accessToken,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          const errorMsg = errorData.error || '获取文件URL失败'
          
          // 如果API返回服务器错误或配置错误，且存在fileUrl，使用fileUrl作为fallback
          // 这允许在bucket还是public时继续工作
          if ((response.status >= 500 || response.status === 401 || response.status === 403) && fileUrl) {
            console.warn('API error, falling back to fileUrl:', errorMsg, 'Status:', response.status)
            setSecureFileUrl(fileUrl)
            setLoading(false)
            return
          }
          
          // 如果是权限错误（403），且用户有权限，也尝试fallback
          if (response.status === 403 && hasPermission && fileUrl) {
            console.warn('Permission error but user has permission, falling back to fileUrl')
            setSecureFileUrl(fileUrl)
            setLoading(false)
            return
          }
          
          throw new Error(errorMsg)
        }

        const data = await response.json()
        setSecureFileUrl(data.url)
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching secure URL:', err)
        
        // 如果获取signed URL失败，但有fileUrl，使用fileUrl作为fallback
        if (fileUrl) {
          console.warn('Falling back to fileUrl due to error:', err.message)
          setSecureFileUrl(fileUrl)
          setLoading(false)
        } else {
          setError(err.message || '获取文件访问权限失败')
          setLoading(false)
        }
      }
    }

    fetchSecureUrl()
  }, [filePath, accessToken, hasPermission, fileUrl])

  // 加载H5文件
  useEffect(() => {
    // 优先使用secureFileUrl，如果没有则使用fileUrl（向后兼容）
    const urlToUse = secureFileUrl || fileUrl

    if (!urlToUse || !hasPermission) {
      if (!hasPermission) {
        setError('权限不足：请联系管理员开启访问权限')
      } else if (!filePath && !fileUrl) {
        setError('缺少文件路径或URL')
      }
      return
    }

    const loadH5File = async () => {
      try {
        setLoading(true)
        setError(null)

        // 下载H5文件
        const response = await fetch(urlToUse)
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
  }, [secureFileUrl, fileUrl, hasPermission])

  // 读取并显示切片
  useEffect(() => {
    if (!h5FileRef.current || !canvasRef.current) {
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

        // 固定使用X维度（Y-Z平面，Sagittal视图）
        // 参考Python: well_raw[:, :, mid_x] 即 raw[z, y, x_index]
        let sliceRaw: Float32Array | Uint8Array
        let slicePred: Float32Array | Uint8Array | null = null
        let width: number, height: number

        // 读取原始数据
        const rawData = rawDataset.value as any

        // X维度：显示Y-Z平面 (X slice)
        const sliceIdx = Math.min(currentSlice, dimX - 1)
        width = dimY
        height = dimZ
        
        // jsfive返回的数据是扁平化的1D数组，shape为[dimZ, dimY, dimX]
        // 需要提取X切片: raw[:, :, sliceIdx] -> 所有z和y，固定x=sliceIdx
        if (rawData instanceof Float32Array || rawData instanceof Uint8Array || Array.isArray(rawData)) {
          // 扁平化的3D数组，需要提取切片
          sliceRaw = new Float32Array(width * height)
          let hasData = false
          for (let z = 0; z < height; z++) {
            for (let y = 0; y < width; y++) {
              // 3D索引到1D索引: [z, y, x] -> z * dimY * dimX + y * dimX + x
              const idx3D = z * dimY * dimX + y * dimX + sliceIdx
              const idx2D = z * width + y
              if (idx3D < rawData.length) {
                sliceRaw[idx2D] = rawData[idx3D] || 0
                if (rawData[idx3D] !== undefined && rawData[idx3D] !== null) {
                  hasData = true
                }
              } else {
                sliceRaw[idx2D] = 0
              }
            }
          }
          if (!hasData) {
            console.warn('X切片没有提取到有效数据，检查索引计算')
          }
        } else if (rawData && typeof rawData === 'object' && rawData[sliceIdx]) {
          // 如果数据是按维度组织的数组
          sliceRaw = rawData[sliceIdx]
        } else {
          throw new Error('无法读取raw数据，数据格式不正确')
        }

        // 读取prediction数据集
        if (showPrediction) {
          const predDataset = h5File.get('/prediction')
          if (predDataset) {
            const predData = predDataset.value as any
            if (predData instanceof Float32Array || predData instanceof Uint8Array || Array.isArray(predData)) {
              slicePred = new Float32Array(width * height)
              for (let z = 0; z < height; z++) {
                for (let y = 0; y < width; y++) {
                  const idx3D = z * dimY * dimX + y * dimX + sliceIdx
                  const idx2D = z * width + y
                  slicePred[idx2D] = predData[idx3D] || 0
                }
              }
            } else if (predData && typeof predData === 'object' && predData[sliceIdx]) {
              slicePred = predData[sliceIdx]
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

    if (hasPermission) {
      loadSlice()
    }
  }, [fileUrl, currentSlice, maxSlices, showPrediction, hasPermission])

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
    <div className={`bg-gray-900 rounded-lg overflow-hidden max-w-2xl mx-auto ${className}`} ref={containerRef}>
      {/* 工具栏 */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
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
      <div className="relative bg-black flex items-center justify-center" style={{ height: '500px' }}>
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
              <p className="text-lg font-semibold mb-2">权限不足</p>
              <p className="mb-4">{error}</p>
              {!hasPermission && (
                <p className="text-sm mt-4 text-gray-300">
                  请联系管理员 <a href={`mailto:${ALLOWED_EMAIL}`} className="text-blue-400 hover:underline">{ALLOWED_EMAIL}</a> 开启访问权限。
                </p>
              )}
              {hasPermission && (
                <p className="text-sm mt-4 text-gray-400">
                  请检查H5文件URL是否正确，以及文件格式是否支持。
                </p>
              )}
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
                  Sagittal (Y-Z plane)
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
