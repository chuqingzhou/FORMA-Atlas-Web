# 认证功能说明

## 功能概述

已实现完整的用户认证功能，只有登录用户才能访问数据集。

## 已实现的功能

### 1. 认证系统
- ✅ 用户注册（邮箱 + 密码）
- ✅ 用户登录
- ✅ 用户登出
- ✅ 认证状态管理（使用 React Hook）

### 2. 保护的路由
- ✅ `/browse` - 数据浏览页面（需要登录）
- ✅ `/organoid/[id]` - 类器官详情页面（需要登录）
- ✅ `/auth/login` - 登录/注册页面（公开访问）

### 3. 用户界面
- ✅ 登录/注册页面（`/auth/login`）
- ✅ 导航栏显示登录/登出按钮
- ✅ 显示当前登录用户邮箱
- ✅ 未登录用户访问受保护页面时自动重定向到登录页

### 4. 数据库安全
- ✅ 所有数据表的 RLS 策略已更新
- ✅ 只有认证用户（`authenticated` 角色）才能读取数据
- ✅ 受保护的表：
  - `organoids`
  - `organoid_files`
  - `batches`
  - `cell_lines`
  - `regions`
  - `tracking_groups`

## 使用说明

### 用户注册
1. 访问 `/auth/login` 页面
2. 点击"还没有账户？点击注册"
3. 输入邮箱和密码（至少6个字符）
4. 点击"注册"按钮
5. 注册成功后可以立即登录

### 用户登录
1. 访问 `/auth/login` 页面
2. 输入邮箱和密码
3. 点击"登录"按钮
4. 登录成功后自动跳转到 `/browse` 页面

### 用户登出
1. 点击导航栏右上角的"登出"按钮
2. 登出后返回首页

## 技术实现

### 文件结构
```
lib/
  auth.ts              # 认证工具函数
  supabase.ts          # Supabase 客户端配置

hooks/
  useAuth.ts           # 认证状态 Hook

app/
  auth/
    login/
      page.tsx         # 登录/注册页面
  browse/
    page.tsx           # 数据浏览页面（受保护）
  organoid/
    [id]/
      page.tsx         # 类器官详情页面（受保护）

components/
  Navigation.tsx       # 导航栏（包含登录/登出按钮）
```

### 认证流程
1. 用户访问受保护页面
2. `useAuth` Hook 检查认证状态
3. 如果未登录，重定向到 `/auth/login`
4. 如果已登录，允许访问页面并加载数据

### RLS 策略
所有数据表都使用以下策略：
```sql
CREATE POLICY "Authenticated users can read [table_name]"
ON [table_name] FOR SELECT
TO authenticated
USING (true);
```

## 环境变量

确保设置了以下环境变量（Vercel 部署时会自动配置）：

```
NEXT_PUBLIC_SUPABASE_URL=https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 测试

1. **测试注册**：
   - 访问 `/auth/login`
   - 注册新账户
   - 验证是否成功

2. **测试登录**：
   - 使用注册的账户登录
   - 验证是否跳转到 `/browse`

3. **测试受保护页面**：
   - 登出后访问 `/browse`
   - 验证是否重定向到 `/auth/login`

4. **测试数据访问**：
   - 登录后访问 `/browse`
   - 验证数据是否正常加载

5. **测试 RLS**：
   - 使用未认证的 Supabase 客户端尝试访问数据
   - 验证是否被拒绝访问

## 注意事项

1. **密码要求**：至少6个字符
2. **邮箱验证**：Supabase 默认可能需要邮箱验证（可在 Supabase Dashboard 中配置）
3. **会话持久化**：Supabase 会自动管理用户会话（localStorage）
4. **安全性**：所有敏感操作都在服务端通过 RLS 策略保护

## 后续改进建议

1. 添加密码重置功能
2. 添加用户个人资料页面
3. 添加邮箱验证流程
4. 添加 OAuth 登录（Google, GitHub 等）
5. 添加用户权限管理（管理员、普通用户等）

