-- FORMA Atlas Database Schema V2
-- 基于 FORMA-atlas.xlsx 文件设计

-- 1. 批次表 (Batches)
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id VARCHAR(50) NOT NULL UNIQUE,
  batch_tag VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 细胞系表 (Cell Lines)
CREATE TABLE IF NOT EXISTS cell_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id VARCHAR(50) NOT NULL UNIQUE,
  line_name VARCHAR(100),
  diagnose VARCHAR(50), -- HC (Healthy Control) or SCZ (Schizophrenia)
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 区域表 (Regions)
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  abbreviation VARCHAR(10) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 插入区域数据
INSERT INTO regions (name, abbreviation, description) VALUES
  ('Cerebral', 'CEREBRAL', 'Cerebral organoids'),
  ('Medial Ganglionic Eminence', 'MGE', 'MGE organoids'),
  ('Midbrain', 'MIDBRAIN', 'Midbrain organoids')
ON CONFLICT (name) DO NOTHING;

-- 4. 追踪组表 (Tracking Groups) - 用于纵向追踪
CREATE TABLE IF NOT EXISTS tracking_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracked_id VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 类器官表 (Organoids) - 主表
CREATE TABLE IF NOT EXISTS organoids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id VARCHAR(50) NOT NULL UNIQUE, -- Scan_ID + Well_ID 组合
  raw_data_id VARCHAR(50),
  scan_id VARCHAR(50) NOT NULL,
  well_id VARCHAR(50),
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  line_id UUID REFERENCES cell_lines(id) ON DELETE SET NULL,
  region_id UUID REFERENCES regions(id) ON DELETE SET NULL,
  tracking_type BOOLEAN DEFAULT FALSE, -- 是否有纵向追踪
  tracked_id UUID REFERENCES tracking_groups(id) ON DELETE SET NULL, -- 追踪组ID
  age VARCHAR(50), -- 如 "Day68"
  scan_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. 文件表 (Organoid Files) - 存储类器官相关文件
CREATE TABLE IF NOT EXISTS organoid_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organoid_id UUID REFERENCES organoids(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage 路径
  file_type VARCHAR(50), -- 'mri_volume', 'image', 'metadata', etc.
  file_size BIGINT,
  mime_type VARCHAR(100),
  storage_bucket VARCHAR(100) DEFAULT 'organoid-files',
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_organoids_subject_id ON organoids(subject_id);
CREATE INDEX IF NOT EXISTS idx_organoids_scan_id ON organoids(scan_id);
CREATE INDEX IF NOT EXISTS idx_organoids_well_id ON organoids(well_id);
CREATE INDEX IF NOT EXISTS idx_organoids_tracked_id ON organoids(tracked_id);
CREATE INDEX IF NOT EXISTS idx_organoids_batch_id ON organoids(batch_id);
CREATE INDEX IF NOT EXISTS idx_organoids_line_id ON organoids(line_id);
CREATE INDEX IF NOT EXISTS idx_organoids_region_id ON organoids(region_id);
CREATE INDEX IF NOT EXISTS idx_organoid_files_organoid_id ON organoid_files(organoid_id);
CREATE INDEX IF NOT EXISTS idx_organoid_files_file_type ON organoid_files(file_type);

-- 创建 updated_at 触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表创建触发器
DROP TRIGGER IF EXISTS update_organoids_updated_at ON organoids;
CREATE TRIGGER update_organoids_updated_at
  BEFORE UPDATE ON organoids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_batches_updated_at ON batches;
CREATE TRIGGER update_batches_updated_at
  BEFORE UPDATE ON batches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cell_lines_updated_at ON cell_lines;
CREATE TRIGGER update_cell_lines_updated_at
  BEFORE UPDATE ON cell_lines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 创建视图：类器官详情（包含关联信息）
CREATE OR REPLACE VIEW organoid_details AS
SELECT 
  o.id,
  o.subject_id,
  o.raw_data_id,
  o.scan_id,
  o.well_id,
  o.tracking_type,
  o.age,
  o.scan_date,
  o.notes,
  o.created_at,
  o.updated_at,
  -- 批次信息
  b.batch_id AS batch_id_value,
  b.batch_tag,
  -- 细胞系信息
  cl.line_id AS line_id_value,
  cl.line_name,
  cl.diagnose,
  -- 区域信息
  r.name AS region_name,
  r.abbreviation AS region_abbreviation,
  -- 追踪信息
  tg.tracked_id AS tracked_id_value,
  -- 文件统计
  COUNT(DISTINCT of.id) AS file_count
FROM organoids o
LEFT JOIN batches b ON o.batch_id = b.id
LEFT JOIN cell_lines cl ON o.line_id = cl.id
LEFT JOIN regions r ON o.region_id = r.id
LEFT JOIN tracking_groups tg ON o.tracked_id = tg.id
LEFT JOIN organoid_files of ON o.id = of.organoid_id
GROUP BY 
  o.id, o.subject_id, o.raw_data_id, o.scan_id, o.well_id,
  o.tracking_type, o.age, o.scan_date, o.notes, o.created_at, o.updated_at,
  b.batch_id, b.batch_tag, cl.line_id, cl.line_name, cl.diagnose,
  r.name, r.abbreviation, tg.tracked_id;

-- 创建视图：追踪组详情（显示同一追踪组的所有类器官）
CREATE OR REPLACE VIEW tracking_group_details AS
SELECT 
  tg.id AS tracking_group_id,
  tg.tracked_id,
  tg.description,
  COUNT(DISTINCT o.id) AS organoid_count,
  MIN(o.scan_date) AS first_scan_date,
  MAX(o.scan_date) AS last_scan_date,
  ARRAY_AGG(DISTINCT o.subject_id ORDER BY o.subject_id) AS subject_ids,
  ARRAY_AGG(DISTINCT o.scan_date ORDER BY o.scan_date) AS scan_dates
FROM tracking_groups tg
LEFT JOIN organoids o ON tg.id = o.tracked_id
GROUP BY tg.id, tg.tracked_id, tg.description;

-- 启用 Row Level Security (RLS)
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cell_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE organoids ENABLE ROW LEVEL SECURITY;
ALTER TABLE organoid_files ENABLE ROW LEVEL SECURITY;

-- 创建公共读取策略
CREATE POLICY "Public read access for batches" ON batches FOR SELECT USING (true);
CREATE POLICY "Public read access for cell_lines" ON cell_lines FOR SELECT USING (true);
CREATE POLICY "Public read access for regions" ON regions FOR SELECT USING (true);
CREATE POLICY "Public read access for tracking_groups" ON tracking_groups FOR SELECT USING (true);
CREATE POLICY "Public read access for organoids" ON organoids FOR SELECT USING (true);
CREATE POLICY "Public read access for organoid_files" ON organoid_files FOR SELECT USING (true);

-- 创建文件上传策略（需要认证，但先允许公开写入用于测试）
-- 注意：生产环境应该使用服务角色密钥进行文件上传
CREATE POLICY "Public insert access for organoid_files" ON organoid_files FOR INSERT WITH CHECK (true);

