#!/usr/bin/env python3
"""生成 organoid 数据的 SQL 插入语句"""

import json

with open('data/well_import_data.json') as f:
    data = json.load(f)

def parse_date(date_val):
    if not date_val:
        return 'NULL'
    try:
        date_str = str(int(date_val))
        if len(date_str) == 8:
            return f"'{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}'"
    except:
        pass
    return 'NULL'

region_map = {'Cerebral': 'CEREBRAL', 'Midbrain': 'MIDBRAIN', 'MGE': 'MGE'}

# 生成所有数据的 SQL
sql_statements = []

for item in data:
    subject_id = item.get('subject_id')
    if not subject_id:
        continue
    
    raw_data_id = item.get('Raw_Data_ID', '')
    scan_id = item.get('Scan_ID', '')
    well_id = item.get('Well_ID')
    batch_id = item.get('Batch_ID', '')
    line_id = item.get('Line_ID', '')
    region = item.get('Region', 'Cerebral')
    age = item.get('Age', '')
    scan_date = parse_date(item.get('Scan Date'))
    
    batch_id_query = f"(SELECT id FROM batches WHERE batch_id = '{batch_id}')" if batch_id else 'NULL'
    line_id_query = f"(SELECT id FROM cell_lines WHERE line_id = '{line_id}')" if line_id else 'NULL'
    region_abbrev = region_map.get(region, region.upper())
    region_id_query = f"(SELECT id FROM regions WHERE abbreviation = '{region_abbrev}')"
    
    well_id_str = f"'{well_id}'" if well_id else 'NULL'
    age_str = f"'{age}'" if age else 'NULL'
    
    sql = f"""INSERT INTO organoids (subject_id, raw_data_id, scan_id, well_id, batch_id, line_id, region_id, age, scan_date, tracking_type)
VALUES ('{subject_id}', '{raw_data_id}', '{scan_id}', {well_id_str}, {batch_id_query}, {line_id_query}, {region_id_query}, {age_str}, {scan_date}, false)
ON CONFLICT (subject_id) DO UPDATE SET
  raw_data_id = EXCLUDED.raw_data_id,
  scan_id = EXCLUDED.scan_id,
  well_id = EXCLUDED.well_id,
  batch_id = EXCLUDED.batch_id,
  line_id = EXCLUDED.line_id,
  region_id = EXCLUDED.region_id,
  age = EXCLUDED.age,
  scan_date = EXCLUDED.scan_date;"""
    
    sql_statements.append(sql)

# 保存到文件
with open('data/organoid_inserts.sql', 'w') as f:
    f.write('-- Organoid 数据导入\n')
    f.write('\n'.join(sql_statements))

print(f"生成 {len(sql_statements)} 条 SQL 语句，保存到 data/organoid_inserts.sql")
print("前3条预览:")
print('\n'.join(sql_statements[:3]))

