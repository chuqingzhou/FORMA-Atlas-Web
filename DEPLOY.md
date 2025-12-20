# FORMA Atlas 部署指南

本指南将帮助您将 FORMA Atlas 网站部署到在线环境。

## 部署选项

### 方案一：Vercel（推荐）⭐

Vercel 是 Next.js 的创建者，提供最佳的 Next.js 部署体验，并且与 Supabase 集成完美。

#### 步骤 1: 准备代码仓库

1. 在 GitHub 上创建新仓库
2. 将代码推送到仓库：

```bash
cd "/home/zhangjiachi.zjc/FORMA Atlas"
git init
git add .
git commit -m "Initial commit: FORMA Atlas website"
git branch -M main
git remote add origin https://github.com/your-username/forma-atlas.git
git push -u origin main
```

#### 步骤 2: 部署到 Vercel

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 导入您的 GitHub 仓库
5. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi14anh5YXpzcnUxcTZ0NmM0IiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjYxNTk4MDIsImV4cCI6MjA4MTczNTgwMn0.JLMyfKHZS_9uKzij37OlAAB36pBLuu_9IXkbfcXD6iE`
6. 点击 "Deploy"

部署完成后，Vercel 会提供一个 URL（例如：`https://forma-atlas.vercel.app`）

---

### 方案二：Netlify

Netlify 也是一个优秀的部署平台，支持 Next.js。

#### 步骤 1: 准备代码仓库（同上）

#### 步骤 2: 部署到 Netlify

1. 访问 [Netlify](https://www.netlify.com)
2. 使用 GitHub 账号登录
3. 点击 "Add new site" → "Import an existing project"
4. 选择您的 GitHub 仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `.next`
6. 在 "Environment variables" 中添加：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. 点击 "Deploy site"

---

### 方案三：Railway

Railway 提供简单的部署体验。

#### 步骤 1: 准备代码仓库（同上）

#### 步骤 2: 部署到 Railway

1. 访问 [Railway](https://railway.app)
2. 使用 GitHub 账号登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择您的仓库
5. Railway 会自动检测 Next.js 项目
6. 在 "Variables" 标签页添加环境变量
7. 部署会自动开始

---

### 方案四：使用 Supabase Edge Functions（不推荐用于完整应用）

Supabase Edge Functions 主要用于 API 端点，不适合完整的 Next.js 应用。

---

## 环境变量配置

在所有部署平台上，您需要设置以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi14anh5YXpzcnUxcTZ0NmM0IiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjYxNTk4MDIsImV4cCI6MjA4MTczNTgwMn0.JLMyfKHZS_9uKzij37OlAAB36pBLuu_9IXkbfcXD6iE
```

**注意**：`NEXT_PUBLIC_` 前缀表示这些变量会在客户端代码中可用。

---

## 本地构建测试

在部署之前，建议先在本地测试构建：

```bash
cd "/home/zhangjiachi.zjc/FORMA Atlas"
npm install
npm run build
npm start
```

如果构建成功，访问 `http://localhost:3000` 检查网站是否正常运行。

---

## 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 首页加载正常
- [ ] 数据浏览页面可以访问
- [ ] 数据库连接正常（检查浏览器控制台是否有错误）
- [ ] 所有页面路由正常工作
- [ ] 响应式设计在移动设备上正常显示

---

## 自定义域名

### Vercel

1. 在 Vercel 项目设置中，进入 "Domains"
2. 添加您的域名
3. 按照提示配置 DNS 记录

### Netlify

1. 在 Netlify 项目设置中，进入 "Domain settings"
2. 添加自定义域名
3. 配置 DNS 记录

---

## 持续部署

所有推荐的平台都支持自动部署：
- 当您推送代码到 GitHub 主分支时，会自动触发重新部署
- 每次部署都会生成一个预览 URL，方便测试

---

## 故障排除

### 构建失败

1. 检查 `package.json` 中的依赖是否正确
2. 查看构建日志中的错误信息
3. 确保 Node.js 版本兼容（推荐 18+）

### 环境变量问题

1. 确保环境变量名称正确（注意大小写）
2. 确保 `NEXT_PUBLIC_` 前缀正确
3. 重新部署以应用新的环境变量

### 数据库连接问题

1. 检查 Supabase 项目的安全 IP 列表设置
2. 确保 RLS 策略允许公开读取
3. 检查浏览器控制台的错误信息

---

## 推荐配置

**最佳实践**：使用 Vercel + GitHub

- ✅ 与 Next.js 完美集成
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 自动部署
- ✅ 免费套餐足够使用

---

## 获取帮助

如果遇到问题，请检查：
1. 部署平台的文档
2. Next.js 部署文档：https://nextjs.org/docs/deployment
3. Supabase 文档：https://supabase.com/docs

