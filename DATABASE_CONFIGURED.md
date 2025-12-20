# 数据库配置完成

## ✅ 已完成的配置

### 1. 数据库表结构

已成功创建以下表：

- ✅ **batches** - 批次表
- ✅ **cell_lines** - 细胞系表
- ✅ **tracking_groups** - 追踪组表
- ✅ **organoids** - 类器官表（已更新，添加了新列）
- ✅ **organoid_files** - 文件表

### 2. 已更新的表

**organoids 表**已添加以下新列：
- `subject_id` - 唯一标识（Scan_ID + Well_ID）
- `raw_data_id` - 原始数据ID
- `scan_id` - 扫描ID
- `well_id` - 孔位ID
- `batch_id` - 批次ID（外键）
- `line_id` - 细胞系ID（外键）
- `tracking_type` - 是否有纵向追踪
- `tracked_id` - 追踪组ID（外键）
- `age` - 年龄
- `scan_date` - 扫描日期

### 3. 索引

已创建以下索引以优化查询性能：
- `idx_organoids_subject_id`
- `idx_organoids_scan_id`
- `idx_organoids_well_id`
- `idx_organoids_tracked_id`
- `idx_organoids_batch_id`
- `idx_organoids_line_id`
- `idx_organoid_files_organoid_id`
- `idx_organoid_files_file_type`

### 4. 触发器

已创建 `update_updated_at_column()` 函数，并为以下表创建了触发器：
- `organoids`
- `batches`
- `cell_lines`

### 5. 视图

已创建以下视图：
- ✅ **organoid_details** - 类器官详情视图（包含所有关联信息）
- ✅ **tracking_group_details** - 追踪组详情视图

### 6. Row Level Security (RLS)

已为以下表启用 RLS 并创建公共读取策略：
- `batches`
- `cell_lines`
- `tracking_groups`
- `organoid_files`

### 7. Storage Bucket

已创建 Storage bucket：
- ✅ **organoid-files** - 公开 bucket，用于存储类器官文件

已设置 Storage 策略：
- ✅ 公开读取
- ✅ 公开上传
- ✅ 公开删除

## 📋 下一步操作

### 1. 导入 Excel 数据

使用以下命令导入数据：

```bash
export SUPABASE_SERVICE_ROLE_KEY="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwicmVmIjoic3BiLXhqeHlhenNydTFxNnQ2YzQiLCJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjE1OTgwMiwiZXhwIjoyMDgxNzM1ODAyfQ.tMaroFQCeIpy315pB9qN9P-jxbJEBFekN0p_rM-KoHQ"
python scripts/import-excel-data.py FORMA-atlas.xlsx --dry-run  # 先测试
python scripts/import-excel-data.py FORMA-atlas.xlsx  # 实际导入
```

### 2. 上传文件

文件可以通过以下方式上传：
- 使用前端页面上传
- 使用 Supabase Storage API
- 使用脚本批量上传

### 3. 验证配置

访问以下页面验证功能：
- `/browse` - 浏览类器官列表
- `/organoid/[subject_id]` - 查看类器官详情

## 🔍 验证数据库

可以使用以下 SQL 查询验证配置：

```sql
-- 查看所有表
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 查看 organoids 表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'organoids'
ORDER BY ordinal_position;

-- 查看视图
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public';
```

## 📝 注意事项

1. **Service Role Key**: 已获取，用于数据导入和文件上传
2. **RLS 策略**: 当前设置为公开访问，生产环境可能需要调整
3. **Storage**: bucket 已设置为公开，文件可以直接访问
4. **兼容性**: 保留了原有的 `organoid_id` 列，确保向后兼容

## ✅ 配置完成

数据库已成功配置，可以开始导入数据了！

