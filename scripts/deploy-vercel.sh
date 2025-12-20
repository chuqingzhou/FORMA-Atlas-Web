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

# 设置环境变量
echo "⚙️  配置环境变量..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi14anh5YXpzcnUxcTZ0NmM0IiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjYxNTk4MDIsImV4cCI6MjA4MTczNTgwMn0.JLMyfKHZS_9uKzij37OlAAB36pBLuu_9IXkbfcXD6iE"

# 部署
echo "📤 开始部署..."
vercel --prod

echo "✅ 部署完成！"
echo "🌐 您的网站应该已经在线了"

