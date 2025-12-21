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
    const command = `python3 "${scriptPath}" "${fileUrl}" "${dimension}" "${sliceIndex}" "${includePrediction}"`
    
    try {
      const { stdout, stderr } = await execAsync(command, { 
        maxBuffer: 50 * 1024 * 1024 // 50MB buffer for large JSON responses
      })
      
      if (stderr) {
        console.error('Python script stderr:', stderr)
      }
      
      const result = JSON.parse(stdout)
      
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
      
      return NextResponse.json(result)
    } catch (execError: any) {
      console.error('Error executing Python script:', execError)
      return NextResponse.json({ 
        error: `Failed to read H5 file: ${execError.message}` 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Error in H5 slice API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

