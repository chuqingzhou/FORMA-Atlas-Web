import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ALLOWED_EMAIL = 'chuqingz@126.com'

// 创建服务端Supabase客户端（使用service role key）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is not set')
}

const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json()
    const { filePath, accessToken } = body

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

    // 使用accessToken创建客户端来验证用户
    const supabaseClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
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

    // 检查用户邮箱权限
    if (user.email !== ALLOWED_EMAIL) {
      return NextResponse.json(
        { error: '权限不足：只有授权用户可以访问H5文件' },
        { status: 403 }
      )
    }

    // 验证文件路径格式（防止路径遍历攻击）
    if (!filePath.startsWith('organoid-files/') || filePath.includes('..')) {
      return NextResponse.json(
        { error: '无效的文件路径' },
        { status: 400 }
      )
    }

    // 生成signed URL（有效期1小时）
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: '服务器配置错误' },
        { status: 500 }
      )
    }

    const { data: signedUrlData, error: urlError } = await supabaseAdmin.storage
      .from('organoid-files')
      .createSignedUrl(filePath, 3600) // 1小时有效期

    if (urlError || !signedUrlData) {
      console.error('生成signed URL失败:', urlError)
      return NextResponse.json(
        { error: '无法生成文件访问URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      url: signedUrlData.signedUrl,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
    })
  } catch (error: any) {
    console.error('API错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

