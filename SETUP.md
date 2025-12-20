# FORMA Atlas 设置指南

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量配置

项目已经预配置了 Supabase 连接信息。如果需要自定义，可以创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsInJlZiI6InNwYi14anh5YXpzcnUxcTZ0NmM0IiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NjYxNTk4MDIsImV4cCI6MjA4MTczNTgwMn0.JLMyfKHZS_9uKzij37OlAAB36pBLuu_9IXkbfcXD6iE
```

### 3. 数据库初始化

数据库表结构已经创建完成。如果需要重新初始化，可以执行 `database/schema.sql` 中的 SQL 语句。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 数据库结构

### 已创建的表

1. **regions** - 脑区域类型
   - Cerebral (General Telencephalon)
   - Medial Ganglionic Eminence (MGE)
   - Midbrain (Mesencephalon)

2. **genotypes** - 基因型
   - Healthy Control
   - SCZ Patient

3. **organoids** - 类器官信息
4. **mri_scans** - MRI 扫描数据

### 视图

- **organoid_details** - 包含关联信息的类器官详情视图

## 添加测试数据

可以使用以下 SQL 添加测试数据：

```sql
-- 获取区域和基因型 ID
SELECT id, name FROM regions;
SELECT id, name FROM genotypes;

-- 插入测试类器官
INSERT INTO organoids (organoid_id, region_id, genotype_id, cell_line, initial_age_weeks)
VALUES 
  ('ORG-001', (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 
   (SELECT id FROM genotypes WHERE name = 'Healthy Control'), 'Line-A', 4),
  ('ORG-002', (SELECT id FROM regions WHERE abbreviation = 'MGE'), 
   (SELECT id FROM genotypes WHERE name = 'SCZ Patient'), 'Line-B', 6);

-- 插入测试 MRI 扫描
INSERT INTO mri_scans (organoid_id, scan_date, age_weeks, resolution_x, resolution_y, resolution_z)
SELECT 
  o.id,
  CURRENT_DATE - INTERVAL '1 week' * (10 - s.age),
  s.age,
  40.0, 40.0, 40.0
FROM organoids o
CROSS JOIN generate_series(4, 10) AS s(age)
WHERE o.organoid_id IN ('ORG-001', 'ORG-002');
```

## 项目结构

```
FORMA Atlas/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── browse/            # 数据浏览页
│   ├── organoid/[id]/     # 类器官详情页
│   └── about/             # 关于页面
├── components/             # React 组件
│   └── MRIViewer.tsx      # 3D MRI 可视化组件
├── lib/                    # 工具函数
│   └── supabase.ts        # Supabase 客户端
├── database/               # 数据库相关
│   └── schema.sql         # 数据库架构
└── public/                 # 静态资源
```

## 功能特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 数据浏览和搜索功能
- ✅ 类器官详情页面
- ✅ 3D MRI 可视化（占位符）
- ✅ 与 Supabase 数据库集成
- ✅ 现代化的 UI 设计

## 下一步

1. 上传实际的 MRI 数据文件
2. 实现完整的 3D 体积渲染
3. 添加数据筛选和排序功能
4. 实现时间序列可视化
5. 添加数据导出功能

