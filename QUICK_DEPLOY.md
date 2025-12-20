# 快速部署指南

## 🚀 最快方式：使用 Vercel（5分钟）

### 方法一：通过 Vercel 网站（推荐）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **准备代码仓库**
   ```bash
   cd "/home/zhangjiachi.zjc/FORMA Atlas"
   git init
   git add .
   git commit -m "Initial commit"
   # 在 GitHub 创建新仓库后：
   git remote add origin https://github.com/你的用户名/forma-atlas.git
   git push -u origin main
   ```

3. **在 Vercel 部署**
   - 点击 "Add New Project"
   - 选择您的 GitHub 仓库
   - 点击 "Import"
   - 在 "Environment Variables" 中添加：
     ```
     NEXT_PUBLIC_SUPABASE_URL = https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net
     NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi14anh5YXpzcnUxcTZ0NmM0IiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjYxNTk4MDIsImV4cCI6MjA4MTczNTgwMn0.JLMyfKHZS_9uKzij37OlAAB36pBLuu_9IXkbfcXD6iE
     ```
   - 点击 "Deploy"

4. **完成！**
   - 等待 2-3 分钟
   - 获得在线 URL（例如：`https://forma-atlas.vercel.app`）

---

### 方法二：使用 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 在项目目录中部署
cd "/home/zhangjiachi.zjc/FORMA Atlas"
vercel

# 4. 设置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 输入: https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 输入: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi14anh5YXpzcnUxcTZ0NmM0IiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjYxNTk4MDIsImV4cCI6MjA4MTczNTgwMn0.JLMyfKHZS_9uKzij37OlAAB36pBLuu_9IXkbfcXD6iE

# 5. 部署到生产环境
vercel --prod
```

---

## 📋 部署前检查清单

- [ ] 代码已推送到 GitHub
- [ ] 本地测试构建成功：`npm run build`
- [ ] 环境变量已配置
- [ ] Supabase 数据库表已创建
- [ ] RLS 策略已设置（允许公开读取）

---

## 🔧 常见问题

### Q: 部署后网站显示空白？
A: 检查浏览器控制台，可能是环境变量未正确设置。

### Q: 数据库连接失败？
A: 确保 Supabase 项目的安全 IP 列表允许所有 IP（`0.0.0.0/0`）。

### Q: 如何更新网站？
A: 只需推送新代码到 GitHub，Vercel 会自动重新部署。

---

## 🌐 其他部署选项

### Netlify
1. 访问 https://www.netlify.com
2. 导入 GitHub 仓库
3. 配置环境变量
4. 部署

### Railway
1. 访问 https://railway.app
2. 从 GitHub 导入项目
3. 添加环境变量
4. 自动部署

详细说明请查看 `DEPLOY.md`

