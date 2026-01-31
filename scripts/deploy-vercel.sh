#!/bin/bash

# FORMA Atlas - Vercel 快速部署脚本

echo "🚀 FORMA Atlas 部署到 Vercel"
echo "================================"

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查是否已登录
if ! vercel whoami &> /dev/null; then
    echo "🔐 请先登录 Vercel..."
    vercel login
fi

# 设置环境变量（target: deepFORMA / spb-bp106195q465mbtj）
echo "配置环境变量 (target: deepFORMA)..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://spb-bp106195q465mbtj.supabase.opentrust.net"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi1icDEwNjE5NXE0NjVtYnRqIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3Njk4Mzc0OTAsImV4cCI6MjA4NTQxMzQ5MH0.BHSpuU9LowwJwYfqCvRKHPNUMyKXe_y5flP_SPV40lc"

# 部署
echo "📤 开始部署..."
vercel --prod

echo "✅ 部署完成！"
echo "🌐 您的网站应该已经在线了"

