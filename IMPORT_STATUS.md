# 数据导入状态

## ✅ 已完成

### 1. 数据库导入
- **批次 (Batches)**: B5 已创建
- **细胞系 (Cell Lines)**: iPSC01 已创建
- **类器官 (Organoids)**: 60 条记录已导入
  - 18-1: 15 条 (S113W01 到 S113W15)
  - 18-2: 15 条 (S114W01 到 S114W15)
  - 18-3: 15 条 (S115W01 到 S115W15)
  - 18-4: 15 条 (S116W01 到 S116W15)

### 2. 前端功能
- ✅ 支持搜索 Well ID
- ✅ 文件列表显示 H5 文件
- ✅ H5 文件可视化按钮
- ✅ 显示文件元数据（体积、bbox、shape 等）

## ⏳ 待完成

### 文件上传
需要将 60 个 H5 文件上传到 Supabase Storage：

**方法 1: 使用 Python 脚本（推荐）**
```bash
pip install supabase
python3 scripts/upload_files_mcp.py
```

**方法 2: 使用 Supabase Dashboard**
1. 登录 Supabase Dashboard
2. 进入 Storage -> organoid-files bucket
3. 按照 `{subject_id}/{filename}` 的路径结构上传文件
   - 例如: `S113W01/18-1-1.h5`

**文件路径结构:**
- `S113W01/18-1-1.h5` 到 `S113W15/18-1-15.h5`
- `S114W01/18-2-1.h5` 到 `S114W15/18-2-15.h5`
- `S115W01/18-3-1.h5` 到 `S115W15/18-3-15.h5`
- `S116W01/18-4-1.h5` 到 `S116W15/18-4-15.h5`

### 文件记录创建
上传文件后，需要创建 `organoid_files` 表中的记录。Python 脚本会自动完成这一步。

## 📝 验证

验证数据导入：
```sql
SELECT COUNT(*) FROM organoids WHERE raw_data_id IN ('18-1', '18-2', '18-3', '18-4');
-- 应该返回 60

SELECT raw_data_id, COUNT(*) 
FROM organoids 
WHERE raw_data_id IN ('18-1', '18-2', '18-3', '18-4')
GROUP BY raw_data_id;
-- 每个应该返回 15
```

验证文件上传：
```sql
SELECT COUNT(*) FROM organoid_files WHERE file_type = 'mri_volume_h5';
-- 应该返回 60（上传完成后）
```

## 🎯 下一步

1. 上传 H5 文件到 Storage
2. 验证前端功能（搜索、浏览、可视化）
3. 测试 H5 文件可视化功能

