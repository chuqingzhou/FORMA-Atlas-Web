import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 与 lib/supabase.ts 保持一致：未配置时使用 target 默认值
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://spb-bp106195q465mbtj.supabase.opentrust.net'
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi1icDEwNjE5NXE0NjVtYnRqIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Njk4Mzc0OTAsImV4cCI6MjA4NTQxMzQ5MH0.BHSpuU9LowwJwYfqCvRKHPNUMyKXe_y5flP_SPV40lc'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

const supabaseAdmin = supabaseServiceKey
  ? createClient(SUPABASE_URL, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export async function POST(request: NextRequest) {
  let body: { filePath?: string; accessToken?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: '请求体格式错误，需要 JSON' },
      { status: 400 }
    )
  }
  const { filePath, accessToken } = body || {}

  try {

    if (!filePath) {
      return NextResponse.json(
        { error: '缺少文件路径' },
        { status: 400 }
      )
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: '未授权：需要登录' },
        { status: 401 }
      )
    }

    // 使用accessToken创建客户端来验证用户（URL/anon 已用默认值）
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    })

    // 验证用户token并获取用户信息
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权：无效的token' },
        { status: 401 }
      )
    }

    // 防止路径遍历：禁止 .. 和绝对路径
    if (filePath.includes('..') || filePath.startsWith('/')) {
      return NextResponse.json(
        { error: '无效的文件路径' },
        { status: 400 }
      )
    }
    // 前端/数据库存的是桶内路径，如 S113W01/18-1-1.h5；若带 bucket 前缀则去掉
    const pathInBucket = filePath.startsWith('organoid-files/')
      ? filePath.slice('organoid-files/'.length)
      : filePath

    // 生成signed URL（有效期1小时）
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error: '服务器配置错误',
          detail: '请在 Vercel 环境变量中配置 SUPABASE_SERVICE_ROLE_KEY'
        },
        { status: 500 }
      )
    }

    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from('organoid-files')
      .createSignedUrl(pathInBucket, 3600) // 1小时有效期

    if (urlError || !signedUrlData) {
      const urlErrMsg = urlError?.message || String(urlError)
      console.error('生成signed URL失败:', urlErrMsg)
      return NextResponse.json(
        { error: '无法生成文件访问URL', detail: urlErrMsg },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: signedUrlData.signedUrl,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
    })
  } catch (error: any) {
    const message = error?.message || String(error)
    console.error('API错误:', message, error?.stack)
    // 返回具体错误信息便于排查（生产环境可改为仅返回“服务器内部错误”）
    return NextResponse.json(
      { error: '服务器内部错误', detail: message },
      { status: 500 }
    )
  }
}

