#!/usr/bin/env python3
"""
使用 Supabase Python 客户端导入 well 数据
"""

import json
import os
from supabase import create_client
from pathlib import Path

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwicmVmIjoic3BiLXhqeHlhenNydTFxNnQ2YzQiLCJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjE1OTgwMiwiZXhwIjoyMDgxNzM1ODAyfQ.tMaroFQCeIpy315pB9qN9P-jxbJEBFekN0p_rM-KoHQ')

def parse_scan_date(date_val):
    """解析扫描日期"""
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
    # 初始化 Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 读取 JSON 数据
    json_path = Path('data/well_import_data.json')
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    print(f"读取到 {len(data)} 条记录")
    
    # 收集唯一值
    unique_batches = set()
    unique_lines = set()
    unique_regions = set()
    
    for item in data:
        if item.get('Batch_ID'):
            unique_batches.add((item['Batch_ID'], item.get('Batch_Tag ')))
        if item.get('Line_ID'):
            unique_lines.add((item['Line_ID'], item.get('Line'), item.get('Diagnose')))
        if item.get('Region'):
            unique_regions.add(item['Region'])
    
    # 创建批次
    batch_map = {}
    for batch_id, batch_tag in unique_batches:
        try:
            # 检查是否存在
            existing = supabase.table('batches').select('id').eq('batch_id', batch_id).execute()
            if existing.data:
                batch_map[batch_id] = existing.data[0]['id']
                print(f"批次 {batch_id} 已存在")
            else:
                result = supabase.table('batches').insert({
                    'batch_id': batch_id,
                    'batch_tag': batch_tag
                }).execute()
                batch_map[batch_id] = result.data[0]['id']
                print(f"创建批次: {batch_id}")
        except Exception as e:
            print(f"处理批次 {batch_id} 错误: {e}")
    
    # 创建细胞系
    line_map = {}
    for line_id, line_name, diagnose in unique_lines:
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
            print(f"处理细胞系 {line_id} 错误: {e}")
    
    # 获取区域映射
    regions_resp = supabase.table('regions').select('id, abbreviation').execute()
    region_map = {}
    for r in regions_resp.data:
        region_map[r['abbreviation']] = r['id']
    
    # 区域名称映射
    region_name_map = {
        'Cerebral': 'CEREBRAL',
        'Midbrain': 'MIDBRAIN',
        'MGE': 'MGE',
        'Medial Ganglionic Eminence': 'MGE'
    }
    
    # 导入 organoid 数据
    organoid_ids = {}
    success_count = 0
    error_count = 0
    
    for item in data:
        try:
            subject_id = item.get('subject_id')
            if not subject_id:
                continue
            
            # 获取区域ID
            region_id = None
            if item.get('Region'):
                region_name = item['Region']
                region_abbrev = region_name_map.get(region_name, region_name.upper())
                region_id = region_map.get(region_abbrev)
            
            # 准备 organoid 数据
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
            
            # 检查是否存在
            existing = supabase.table('organoids').select('id').eq('subject_id', subject_id).execute()
            
            if existing.data:
                # 更新
                supabase.table('organoids').update(organoid_data).eq('subject_id', subject_id).execute()
                organoid_ids[subject_id] = existing.data[0]['id']
                print(f"更新: {subject_id}")
            else:
                # 插入
                result = supabase.table('organoids').insert(organoid_data).execute()
                organoid_ids[subject_id] = result.data[0]['id']
                print(f"创建: {subject_id}")
            
            success_count += 1
            
        except Exception as e:
            print(f"处理 {item.get('subject_id')} 错误: {e}")
            error_count += 1
    
    print(f"\nOrganoid 导入完成: 成功 {success_count}, 失败 {error_count}")
    
    # 上传文件并创建文件记录
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
                print(f"文件不存在: {filename}")
                continue
            
            # 上传文件
            storage_path = f"{subject_id}/{filename}"
            try:
                with open(file_path, 'rb') as f:
                    file_data = f.read()
                
                # 上传文件到 Storage
                storage_response = supabase.storage.from('organoid-files').upload(
                    storage_path,
                    file_data,
                    file_options={"content-type": "application/x-hdf5", "upsert": "true"}
                )
                
                # 获取公共 URL
                public_url = f"{SUPABASE_URL}/storage/v1/object/public/organoid-files/{storage_path}"
                
                # 创建文件记录
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
                
                # 检查文件记录是否存在
                existing_file = supabase.table('organoid_files').select('id').eq('organoid_id', organoid_id).eq('file_name', filename).execute()
                
                if existing_file.data:
                    supabase.table('organoid_files').update(file_metadata).eq('id', existing_file.data[0]['id']).execute()
                else:
                    supabase.table('organoid_files').insert(file_metadata).execute()
                
                file_count += 1
                if file_count % 10 == 0:
                    print(f"已处理 {file_count} 个文件...")
                    
            except Exception as e:
                print(f"上传文件 {filename} 错误: {e}")
                
        except Exception as e:
            print(f"处理文件记录错误: {e}")
    
    print(f"\n文件上传完成: {file_count} 个文件")

if __name__ == '__main__':
    main()

