import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

export const dynamic = 'force-dynamic'

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const fileUrl = searchParams.get('fileUrl')
    const dimension = searchParams.get('dimension') || 'z'
    const sliceIndex = parseInt(searchParams.get('sliceIndex') || '0')
    const includePrediction = searchParams.get('includePrediction') === 'true'

    if (!fileUrl) {
      return NextResponse.json({ error: 'Missing fileUrl parameter' }, { status: 400 })
    }

    // 调用Python脚本读取H5文件
    const scriptPath = path.join(process.cwd(), 'scripts', 'read_h5_slice.py')
    // 转义URL中的特殊字符，避免shell注入
    const escapedUrl = fileUrl.replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`')
    const command = `python3 "${scriptPath}" "${escapedUrl}" "${dimension}" "${sliceIndex}" "${includePrediction}"`
    
    try {
      const { stdout, stderr } = await execAsync(command, { 
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer for large JSON responses
        timeout: 60000 // 60秒超时
      })
      
      if (stderr && !stderr.includes('WARNING')) {
        console.error('Python script stderr:', stderr)
      }
      
      // 尝试解析JSON
      let result
      try {
        result = JSON.parse(stdout)
      } catch (parseError) {
        console.error('Failed to parse Python script output:', stdout.substring(0, 500))
        return NextResponse.json({ 
          error: `Failed to parse response from Python script. Output: ${stdout.substring(0, 200)}` 
        }, { status: 500 })
      }
      
      if (result.error) {
        console.error('Python script error:', result.error)
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      
      return NextResponse.json(result)
    } catch (execError: any) {
      console.error('Error executing Python script:', execError)
      // 提供更详细的错误信息
      const errorMessage = execError.stderr 
        ? `Failed to read H5 file: ${execError.message}. Python error: ${execError.stderr.substring(0, 200)}`
        : `Failed to read H5 file: ${execError.message}`
      return NextResponse.json({ 
        error: errorMessage
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in H5 slice API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

