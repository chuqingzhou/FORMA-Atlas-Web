#!/usr/bin/env python3
"""
直接导入 well 数据到 Supabase
"""

import json
import os
from supabase import create_client
from pathlib import Path

SUPABASE_URL = 'https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net'
SUPABASE_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwicmVmIjoic3BiLXhqeHlhenNydTFxNnQ2YzQiLCJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjE1OTgwMiwiZXhwIjoyMDgxNzM1ODAyfQ.tMaroFQCeIpy315pB9qN9P-jxbJEBFekN0p_rM-KoHQ'

def parse_scan_date(date_val):
    if not date_val:
        return None
    try:
        date_str = str(int(date_val))
        if len(date_str) == 8:
            return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
    except:
        pass
    return None

def main():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 读取 JSON
    with open('data/well_import_data.json', 'r') as f:
        data = json.load(f)
    
    print(f"读取到 {len(data)} 条记录\n")
    
    # 收集唯一值
    unique_batches = {}
    unique_lines = {}
    
    for item in data:
        batch_id = item.get('Batch_ID')
        if batch_id and batch_id not in unique_batches:
            unique_batches[batch_id] = item.get('Batch_Tag ')
        
        line_id = item.get('Line_ID')
        if line_id and line_id not in unique_lines:
            unique_lines[line_id] = (item.get('Line'), item.get('Diagnose'))
    
    # 创建批次
    batch_map = {}
    for batch_id, batch_tag in unique_batches.items():
        try:
            existing = supabase.table('batches').select('id').eq('batch_id', batch_id).execute()
            if existing.data:
                batch_map[batch_id] = existing.data[0]['id']
            else:
                result = supabase.table('batches').insert({
                    'batch_id': batch_id,
                    'batch_tag': batch_tag
                }).execute()
                batch_map[batch_id] = result.data[0]['id']
                print(f"创建批次: {batch_id}")
        except Exception as e:
            print(f"批次 {batch_id} 错误: {e}")
    
    # 创建细胞系
    line_map = {}
    for line_id, (line_name, diagnose) in unique_lines.items():
        try:
            existing = supabase.table('cell_lines').select('id').eq('line_id', line_id).execute()
            if existing.data:
                line_map[line_id] = existing.data[0]['id']
            else:
                result = supabase.table('cell_lines').insert({
                    'line_id': line_id,
                    'line_name': line_name,
                    'diagnose': diagnose
                }).execute()
                line_map[line_id] = result.data[0]['id']
                print(f"创建细胞系: {line_id}")
        except Exception as e:
            print(f"细胞系 {line_id} 错误: {e}")
    
    # 获取区域映射
    regions_resp = supabase.table('regions').select('id, abbreviation').execute()
    region_map = {r['abbreviation']: r['id'] for r in regions_resp.data}
    region_name_map = {'Cerebral': 'CEREBRAL', 'Midbrain': 'MIDBRAIN', 'MGE': 'MGE'}
    
    # 导入 organoid
    organoid_ids = {}
    success = 0
    errors = 0
    
    print("\n导入 organoid 数据...")
    for item in data:
        try:
            subject_id = item.get('subject_id')
            if not subject_id:
                continue
            
            region_id = None
            if item.get('Region'):
                region_abbrev = region_name_map.get(item['Region'], item['Region'].upper())
                region_id = region_map.get(region_abbrev)
            
            organoid_data = {
                'subject_id': subject_id,
                'raw_data_id': item.get('Raw_Data_ID'),
                'scan_id': item.get('Scan_ID'),
                'well_id': str(item.get('Well_ID')) if item.get('Well_ID') else None,
                'batch_id': batch_map.get(item.get('Batch_ID')),
                'line_id': line_map.get(item.get('Line_ID')),
                'region_id': region_id,
                'tracking_type': bool(item.get('Tracking_Type', False)),
                'age': str(item.get('Age', '')) if item.get('Age') else None,
                'scan_date': parse_scan_date(item.get('Scan Date'))
            }
            
            existing = supabase.table('organoids').select('id').eq('subject_id', subject_id).execute()
            
            if existing.data:
                supabase.table('organoids').update(organoid_data).eq('subject_id', subject_id).execute()
                organoid_ids[subject_id] = existing.data[0]['id']
            else:
                result = supabase.table('organoids').insert(organoid_data).execute()
                organoid_ids[subject_id] = result.data[0]['id']
                print(f"  创建: {subject_id}")
            
            success += 1
        except Exception as e:
            print(f"  错误 {item.get('subject_id')}: {e}")
            errors += 1
    
    print(f"\nOrganoid 导入: 成功 {success}, 失败 {errors}")
    
    # 上传文件
    print("\n上传文件...")
    wells_dir = Path('data/wells')
    file_count = 0
    
    for item in data:
        try:
            subject_id = item.get('subject_id')
            filename = item.get('filename')
            organoid_id = organoid_ids.get(subject_id)
            
            if not organoid_id or not filename:
                continue
            
            file_path = wells_dir / filename
            if not file_path.exists():
                print(f"  文件不存在: {filename}")
                continue
            
            storage_path = f"{subject_id}/{filename}"
            
            # 上传文件
            with open(file_path, 'rb') as f:
                file_data = f.read()
            
            supabase.storage.from('organoid-files').upload(
                storage_path,
                file_data,
                file_options={"content-type": "application/x-hdf5", "upsert": "true"}
            )
            
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/organoid-files/{storage_path}"
            
            # 文件元数据
            file_metadata = {
                'organoid_id': organoid_id,
                'file_name': filename,
                'file_path': storage_path,
                'file_type': 'mri_volume_h5',
                'file_size': file_path.stat().st_size,
                'mime_type': 'application/x-hdf5',
                'storage_bucket': 'organoid-files',
                'metadata': {
                    'raw_data_id': item.get('Raw_Data_ID'),
                    'well_id': item.get('Well_ID'),
                    'organoid_count': item.get('organoid_count', 0),
                    'organoid_volume_voxels': item.get('organoid_volume_voxels', 0),
                    'bbox': {
                        'min_z': item.get('bbox_min_z'),
                        'max_z': item.get('bbox_max_z'),
                        'min_y': item.get('bbox_min_y'),
                        'max_y': item.get('bbox_max_y'),
                        'min_x': item.get('bbox_min_x'),
                        'max_x': item.get('bbox_max_x'),
                    },
                    'shape': {
                        'z': item.get('shape_z'),
                        'y': item.get('shape_y'),
                        'x': item.get('shape_x'),
                    },
                    'public_url': public_url
                }
            }
            
            # 检查文件记录
            existing_file = supabase.table('organoid_files').select('id').eq('organoid_id', organoid_id).eq('file_name', filename).execute()
            
            if existing_file.data:
                supabase.table('organoid_files').update(file_metadata).eq('id', existing_file.data[0]['id']).execute()
            else:
                supabase.table('organoid_files').insert(file_metadata).execute()
            
            file_count += 1
            if file_count % 10 == 0:
                print(f"  已上传 {file_count} 个文件...")
                
        except Exception as e:
            print(f"  文件 {filename} 错误: {e}")
    
    print(f"\n文件上传完成: {file_count} 个文件")
    print("\n导入完成！")

if __name__ == '__main__':
    main()

