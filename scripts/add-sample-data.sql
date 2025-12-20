-- 添加示例数据到 FORMA Atlas 数据库
-- 执行此 SQL 文件以添加测试数据

-- 插入示例类器官
INSERT INTO organoids (organoid_id, region_id, genotype_id, cell_line, initial_age_weeks, notes)
VALUES 
  ('CEREBRAL-001', 
   (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 
   (SELECT id FROM genotypes WHERE name = 'Healthy Control'), 
   'Control-Line-A', 
   4,
   'Cerebral organoid from healthy control, initial scan at 4 weeks'),
   
  ('CEREBRAL-002', 
   (SELECT id FROM regions WHERE abbreviation = 'CEREBRAL'), 
   (SELECT id FROM genotypes WHERE name = 'SCZ Patient'), 
   'SCZ-Line-B', 
   4,
   'Cerebral organoid from SCZ patient-derived line'),
   
  ('MGE-001', 
   (SELECT id FROM regions WHERE abbreviation = 'MGE'), 
   (SELECT id FROM genotypes WHERE name = 'Healthy Control'), 
   'Control-Line-A', 
   6,
   'MGE organoid from healthy control'),
   
  ('MGE-002', 
   (SELECT id FROM regions WHERE abbreviation = 'MGE'), 
   (SELECT id FROM genotypes WHERE name = 'SCZ Patient'), 
   'SCZ-Line-B', 
   6,
   'MGE organoid from SCZ patient-derived line'),
   
  ('MIDBRAIN-001', 
   (SELECT id FROM regions WHERE abbreviation = 'MIDBRAIN'), 
   (SELECT id FROM genotypes WHERE name = 'Healthy Control'), 
   'Control-Line-A', 
   5,
   'Midbrain organoid from healthy control'),
   
  ('MIDBRAIN-002', 
   (SELECT id FROM regions WHERE abbreviation = 'MIDBRAIN'), 
   (SELECT id FROM genotypes WHERE name = 'SCZ Patient'), 
   'SCZ-Line-B', 
   5,
   'Midbrain organoid from SCZ patient-derived line')
ON CONFLICT (organoid_id) DO NOTHING;

-- 为每个类器官插入多个时间点的 MRI 扫描数据
INSERT INTO mri_scans (organoid_id, scan_date, age_weeks, resolution_x, resolution_y, resolution_z, sequence_type, metadata)
SELECT 
  o.id,
  CURRENT_DATE - INTERVAL '1 week' * (12 - s.age),
  s.age,
  40.0, 40.0, 40.0,
  'T2-weighted 3D RARE',
  jsonb_build_object(
    'field_strength', '9.4T',
    'spatial_resolution_um', 40.0,
    'scan_number', s.age - o.initial_age_weeks + 1
  )
FROM organoids o
CROSS JOIN generate_series(4, 12) AS s(age)
WHERE s.age >= o.initial_age_weeks
  AND o.organoid_id IN ('CEREBRAL-001', 'CEREBRAL-002', 'MGE-001', 'MGE-002', 'MIDBRAIN-001', 'MIDBRAIN-002')
ON CONFLICT DO NOTHING;

-- 验证数据
SELECT 
  o.organoid_id,
  r.name AS region,
  g.name AS genotype,
  COUNT(ms.id) AS scan_count,
  MIN(ms.age_weeks) AS min_age,
  MAX(ms.age_weeks) AS max_age
FROM organoids o
LEFT JOIN regions r ON o.region_id = r.id
LEFT JOIN genotypes g ON o.genotype_id = g.id
LEFT JOIN mri_scans ms ON o.id = ms.organoid_id
WHERE o.organoid_id LIKE 'CEREBRAL-%' OR o.organoid_id LIKE 'MGE-%' OR o.organoid_id LIKE 'MIDBRAIN-%'
GROUP BY o.organoid_id, r.name, g.name
ORDER BY o.organoid_id;

