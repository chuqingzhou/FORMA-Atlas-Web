# 安全漏洞修复说明

## 🔒 发现的安全漏洞

### 严重漏洞：H5文件可被未授权下载

**问题描述：**
- H5文件存储在Supabase Storage的public bucket中
- 所有文件使用public URL（`/storage/v1/object/public/organoid-files/...`）
- 任何人都可以通过URL直接下载文件，绕过前端权限控制
- 即使前端隐藏了Visualize按钮，用户仍可通过以下方式获取文件：
  - 查看网页源代码找到public_url
  - 使用浏览器开发者工具查看网络请求
  - 直接访问URL下载文件

## ✅ 修复方案

### 1. 创建安全的API路由

**文件：** `app/api/h5-file-url/route.ts`

- 验证用户身份（通过access token）
- 检查用户邮箱是否为 `chuqingz@126.com`
- 生成带时效的signed URL（1小时有效期）
- 防止路径遍历攻击

### 2. 修改前端组件

**文件：** `components/H5Viewer2D.tsx`

- 不再直接使用public_url
- 通过API路由获取signed URL
- 传递filePath和accessToken

**文件：** `app/organoid/[id]/page.tsx`

- 获取用户session token
- 传递filePath而不是public_url给H5Viewer2D组件

### 3. 将Storage bucket改为private

**文件：** `database/make_storage_private.sql`

执行此SQL脚本以：
- 将bucket从public改为private
- 删除所有public访问策略
- 创建新的authenticated用户访问策略

## 🚀 部署步骤

### 步骤1：执行SQL脚本

在Supabase Dashboard的SQL Editor中执行：

```sql
-- 执行 database/make_storage_private.sql
```

或者使用Supabase MCP：

```bash
# 使用MCP执行SQL
```

### 步骤2：设置环境变量

在Vercel（或其他部署平台）添加环境变量：

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**重要：** 不要将`SUPABASE_SERVICE_ROLE_KEY`添加到客户端代码中！

### 步骤3：验证修复

1. 使用非授权邮箱登录，尝试访问H5文件
   - 应该看到权限不足提示
   - 无法下载文件

2. 使用 `chuqingz@126.com` 登录
   - 应该可以正常查看可视化
   - 文件通过signed URL访问

3. 尝试直接访问旧的public URL
   - 应该返回403或404错误

## 🔐 安全机制

### 多层防护

1. **前端权限检查**
   - 只有 `chuqingz@126.com` 可以看到Visualize按钮

2. **API路由权限验证**
   - 验证用户token
   - 检查用户邮箱
   - 只有授权用户才能获得signed URL

3. **Storage bucket权限**
   - bucket设置为private
   - 只有通过signed URL才能访问
   - signed URL有时效性（1小时）

4. **路径验证**
   - 防止路径遍历攻击（`..`）
   - 验证文件路径格式

## ⚠️ 注意事项

1. **环境变量安全**
   - `SUPABASE_SERVICE_ROLE_KEY` 必须保密
   - 只在服务端使用
   - 不要提交到Git仓库

2. **向后兼容**
   - 代码保留了`fileUrl`参数以支持向后兼容
   - 但优先使用`filePath`和API路由

3. **URL时效性**
   - signed URL有效期为1小时
   - 过期后需要重新获取

4. **数据库中的public_url**
   - 现有数据中可能仍包含public_url
   - 这些URL在bucket改为private后将失效
   - 建议清理metadata中的public_url字段

## 📝 后续优化建议

1. **清理数据库**
   - 从`organoid_files.metadata`中移除`public_url`字段
   - 只保留`file_path`

2. **监控和日志**
   - 记录所有文件访问请求
   - 监控异常访问尝试

3. **定期轮换**
   - 考虑定期轮换service role key
   - 更新signed URL有效期策略

## ✅ 验证清单

- [ ] SQL脚本已执行，bucket已改为private
- [ ] 环境变量`SUPABASE_SERVICE_ROLE_KEY`已设置
- [ ] 非授权用户无法访问H5文件
- [ ] 授权用户可以正常查看可视化
- [ ] 旧的public URL已失效
- [ ] 代码已部署到生产环境

