# Well 数据导入指南

本指南说明如何导入 well 数据和 H5 文件到 Supabase。

## 数据准备

1. **CSV 文件** (`data/well_organoid_mapping.csv`)
   - 包含 Raw_Data_ID, Well_ID, filename, filepath 等信息
   - 包含每个 well 的元数据（bbox, shape, organoid_count 等）

2. **H5 文件** (`data/wells/`)
   - MRI 体积数据文件
   - 文件名格式：`{Raw_Data_ID}-{Well_ID}.h5`

3. **Excel 文件** (`FORMA-atlas.xlsx`)
   - 包含类器官的基本信息
   - 用于 join 生成完整的 organoid 记录

## 导入步骤

### 1. 设置环境变量

```bash
export SUPABASE_URL="https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
```

### 2. 先进行干运行测试

```bash
python scripts/import-well-data.py --dry-run
```

这会显示将要执行的操作，但不会实际写入数据库或上传文件。

### 3. 执行导入

```bash
python scripts/import-well-data.py
```

脚本会：
1. 读取 CSV 文件和 Excel 文件
2. 根据 Raw_Data_ID 和 Well_ID 进行 join
3. 生成或更新 organoid 记录
4. 上传 H5 文件到 Supabase Storage
5. 创建文件记录并关联到 organoid

## 脚本功能

### 数据处理流程

1. **读取数据**
   - 从 `data/well_organoid_mapping.csv` 读取 well 信息
   - 从 `FORMA-atlas.xlsx` 读取类器官基本信息
   - 过滤 Raw_Data_ID 为 18-1 到 18-4 的数据

2. **数据 Join**
   - 根据 Raw_Data_ID 连接 CSV 和 Excel 数据
   - 生成 subject_id（Scan_ID + Well_ID）

3. **创建/更新 Organoid**
   - 如果 organoid 不存在，从 Excel 数据创建
   - 更新 well_id 和 raw_data_id

4. **上传文件**
   - 上传 H5 文件到 Supabase Storage
   - 文件路径：`{subject_id}/{filename}`
   - 存储 bucket：`organoid-files`

5. **创建文件记录**
   - 在 `organoid_files` 表中创建记录
   - 包含文件元数据（bbox, shape, volume 等）

## 文件元数据

每个上传的文件记录包含以下元数据：

```json
{
  "raw_data_id": "18-1",
  "well_id": 1,
  "organoid_count": 1,
  "organoid_volume_voxels": 1782,
  "bbox": {
    "min_z": 17, "max_z": 56,
    "min_y": 19, "max_y": 62,
    "min_x": 0, "max_x": 15
  },
  "shape": {
    "z": 39, "y": 43, "x": 15
  },
  "public_url": "https://..."
}
```

## 前端功能

### 搜索 Well

在浏览页面 (`/browse`)，可以搜索：
- Subject ID
- Scan ID
- Raw Data ID
- **Well ID**（新增）

### 可视化 H5 文件

在类器官详情页面 (`/organoid/[subject_id]`)：

1. **文件列表**
   - 显示所有关联的文件
   - H5 文件标记为 `mri_volume_h5` 类型
   - 显示文件大小、上传日期等信息

2. **可视化**
   - 点击 "Visualize" 按钮查看 H5 文件
   - 显示 3D 可视化
   - 显示文件元数据（体积、尺寸等）

## 注意事项

1. **文件大小**
   - H5 文件通常较大（100-400 KB）
   - 上传需要一些时间
   - Supabase Storage 有存储限制

2. **文件组织**
   - 文件按 `{subject_id}/{filename}` 组织
   - 便于管理和查找

3. **数据完整性**
   - 确保 CSV 和 Excel 中的 Raw_Data_ID 匹配
   - 确保 H5 文件存在于 `data/wells/` 目录

4. **错误处理**
   - 如果文件已存在，会使用 upsert 更新
   - 如果 organoid 不存在且无法创建，会跳过该记录

## 故障排除

### 导入失败

1. 检查 Service Role Key 是否正确
2. 检查文件路径是否正确
3. 查看错误日志

### 文件上传失败

1. 检查 Supabase Storage bucket 是否存在
2. 检查 Storage 策略是否正确设置
3. 检查文件大小是否超过限制

### 数据不匹配

1. 检查 CSV 和 Excel 中的 Raw_Data_ID 是否一致
2. 检查 Well_ID 是否正确
3. 查看 join 结果

## 验证导入

导入完成后，可以：

1. 在 Supabase Dashboard 查看数据
2. 在前端搜索 well 数据
3. 查看类器官详情页面的文件列表
4. 测试 H5 文件可视化功能

