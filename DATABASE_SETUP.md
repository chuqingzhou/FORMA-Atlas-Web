# 数据库设置指南

本指南将帮助您设置新的数据库结构并导入数据。

## 步骤 1: 创建数据库表

1. 登录 Supabase Dashboard
2. 进入 SQL Editor
3. 执行 `database/schema_v2.sql` 文件中的所有 SQL 语句

或者使用 Supabase CLI:

```bash
supabase db reset
psql -h your-db-host -U postgres -d postgres -f database/schema_v2.sql
```

## 步骤 2: 设置 Storage Bucket

### 方法 1: 使用 Supabase Dashboard

1. 进入 Storage 页面
2. 创建新的 bucket，名称为 `organoid-files`
3. 设置为 Public bucket
4. 设置以下策略：

```sql
-- 在 SQL Editor 中执行
CREATE POLICY "Public read access for organoid-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'organoid-files');

CREATE POLICY "Public insert access for organoid-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'organoid-files');

CREATE POLICY "Public delete access for organoid-files"
ON storage.objects FOR DELETE
USING (bucket_id = 'organoid-files');
```

### 方法 2: 使用脚本

运行 `scripts/setup-storage.sh` 查看详细说明。

## 步骤 3: 导入 Excel 数据

### 准备工作

1. 安装 Python 依赖：

```bash
pip install pandas openpyxl supabase
```

2. 获取 Supabase Service Role Key：
   - 在 Supabase Dashboard 中进入 Settings > API
   - 复制 Service Role Key（注意：这是敏感密钥，不要提交到代码仓库）

### 导入数据

```bash
# 设置环境变量
export SUPABASE_URL="https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"

# 先进行干运行（不实际写入数据库）
python scripts/import-excel-data.py FORMA-atlas.xlsx --dry-run

# 确认无误后，实际导入
python scripts/import-excel-data.py FORMA-atlas.xlsx
```

## 步骤 4: 上传文件

### 使用前端上传

1. 访问类器官详情页面
2. 使用文件上传功能上传类器官相关文件

### 使用脚本批量上传

创建上传脚本（示例）：

```python
from supabase import create_client
import os

supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY')
)

# 上传文件
file_path = 'path/to/organoid/file.nii.gz'
organoid_id = 'S01W01'  # subject_id

# 获取 organoid 的 UUID
organoid = supabase.table('organoids').select('id').eq('subject_id', organoid_id).single().execute()

# 上传到 storage
with open(file_path, 'rb') as f:
    supabase.storage.from('organoid-files').upload(
        f'{organoid_id}/{os.path.basename(file_path)}',
        f.read()
    )

# 记录到数据库
supabase.table('organoid_files').insert({
    'organoid_id': organoid.data['id'],
    'file_name': os.path.basename(file_path),
    'file_path': f'organoid-files/{organoid_id}/{os.path.basename(file_path)}',
    'file_type': 'mri_volume',
    'file_size': os.path.getsize(file_path)
}).execute()
```

## 数据库结构说明

### 主要表

1. **organoids** - 类器官主表
   - `subject_id`: 唯一标识（Scan_ID + Well_ID）
   - `scan_id`: 扫描ID
   - `well_id`: 孔位ID
   - `tracking_type`: 是否有纵向追踪
   - `tracked_id`: 追踪组ID（用于关联同一类器官的不同时间点）

2. **organoid_files** - 文件表
   - 存储每个类器官关联的文件
   - 文件存储在 Supabase Storage 中

3. **tracking_groups** - 追踪组表
   - 用于管理纵向追踪的类器官

4. **batches** - 批次表
5. **cell_lines** - 细胞系表
6. **regions** - 区域表

### 视图

- **organoid_details** - 类器官详情视图（包含所有关联信息）
- **tracking_group_details** - 追踪组详情视图

## 注意事项

1. **Subject_ID 生成规则**：
   - 如果 Excel 中有 Subject_ID，直接使用
   - 否则由 Scan_ID + Well_ID 组合生成
   - 格式：`S01W01`, `S02W03` 等

2. **追踪关系**：
   - 具有相同 `tracked_id` 的类器官属于同一个追踪组
   - 例如：`s01w01` 和 `s03w01` 如果有相同的 `tracked_id`，表示它们是同一个类器官的不同时间点

3. **文件关联**：
   - 每个类器官可以有多个文件
   - 文件通过 `organoid_id` 关联到类器官
   - 文件存储在 Supabase Storage 的 `organoid-files` bucket 中

## 故障排除

### 导入失败

1. 检查 Service Role Key 是否正确
2. 检查数据库表是否已创建
3. 查看 Python 脚本的错误信息

### 文件上传失败

1. 检查 Storage bucket 是否已创建
2. 检查 Storage 策略是否正确设置
3. 检查文件大小是否超过限制

### 查询数据为空

1. 确认数据已成功导入
2. 检查 RLS 策略是否允许读取
3. 检查视图是否正确创建

