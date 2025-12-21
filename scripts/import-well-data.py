#!/usr/bin/env python3
"""
导入 well 数据和文件到 Supabase
需要安装: pip install pandas openpyxl supabase h5py
"""

import pandas as pd
import os
import sys
from supabase import create_client, Client
from typing import Optional
from pathlib import Path

# Supabase 配置
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')  # 需要使用 service role key

def generate_subject_id(scan_id: str, well_id: int) -> str:
    """生成 subject_id: Scan_ID + Well_ID"""
    if pd.isna(scan_id) or scan_id is None:
        return None
    
    scan_id_str = str(scan_id).strip()
    well_id_str = f"W{int(well_id):02d}" if not pd.isna(well_id) else ''
    
    return f"{scan_id_str}{well_id_str}"

def upload_file_to_storage(supabase: Client, file_path: str, storage_path: str) -> Optional[str]:
    """上传文件到 Supabase Storage，返回公共 URL"""
    try:
        if not os.path.exists(file_path):
            print(f"  警告: 文件不存在 {file_path}")
            return None
        
        with open(file_path, 'rb') as f:
            file_data = f.read()
        
        # 上传文件（使用 upsert 避免重复上传）
        response = supabase.storage.from('organoid-files').upload(
            storage_path,
            file_data,
            file_options={"content-type": "application/x-hdf5", "upsert": "true"}
        )
        
        # 获取公共 URL
        public_url_data = supabase.storage.from('organoid-files').get_public_url(storage_path)
        if hasattr(public_url_data, 'publicUrl'):
            return public_url_data.publicUrl
        elif isinstance(public_url_data, dict) and 'publicUrl' in public_url_data:
            return public_url_data['publicUrl']
        else:
            # 手动构建 URL
            return f"{SUPABASE_URL}/storage/v1/object/public/organoid-files/{storage_path}"
    except Exception as e:
        print(f"  上传文件失败 {file_path}: {str(e)}")
        return None

def import_well_data(
    csv_path: str, 
    excel_path: str, 
    wells_dir: str,
    supabase: Client, 
    dry_run: bool = False
):
    """导入 well 数据"""
    
    print(f"读取 CSV 文件: {csv_path}")
    well_df = pd.read_csv(csv_path)
    
    print(f"读取 Excel 文件: {excel_path}")
    excel_df = pd.read_excel(excel_path)
    
    # 清理数据
    well_df = well_df.replace({pd.NA: None, 'nan': None, 'NaN': None})
    excel_df = excel_df.replace({pd.NA: None, 'nan': None, 'NaN': None})
    
    # 过滤 18-1 到 18-4 的数据
    target_raw_ids = ['18-1', '18-2', '18-3', '18-4']
    well_df = well_df[well_df['Raw_Data_ID'].isin(target_raw_ids)]
    
    print(f"找到 {len(well_df)} 条 well 记录")
    
    # 与 Excel 数据 join
    # 根据 Raw_Data_ID 和 Well_ID 进行 join
    merged_df = well_df.merge(
        excel_df,
        on='Raw_Data_ID',
        how='left',
        suffixes=('_well', '_excel')
    )
    
    print(f"Join 后共 {len(merged_df)} 条记录")
    
    success_count = 0
    error_count = 0
    file_upload_count = 0
    
    for idx, row in merged_df.iterrows():
        try:
            raw_data_id = str(row['Raw_Data_ID']).strip()
            well_id = int(row['Well_ID']) if not pd.isna(row['Well_ID']) else None
            filename = str(row['filename']).strip() if not pd.isna(row['filename']) else None
            filepath = str(row['filepath']).strip() if not pd.isna(row['filepath']) else None
            
            # 获取 Excel 中的数据
            scan_id = str(row.get('Scan_ID', '')).strip() if not pd.isna(row.get('Scan_ID')) else None
            
            if not scan_id:
                print(f"第 {idx+1} 行: 缺少 Scan_ID，跳过")
                error_count += 1
                continue
            
            # 生成 subject_id
            subject_id = generate_subject_id(scan_id, well_id)
            if not subject_id:
                print(f"第 {idx+1} 行: 无法生成 subject_id，跳过")
                error_count += 1
                continue
            
            print(f"\n处理: {raw_data_id}, Well {well_id}, Subject: {subject_id}")
            
            # 查找或创建 organoid
            organoid_resp = supabase.table('organoids').select('id').eq('subject_id', subject_id).execute()
            
            organoid_id = None
            if organoid_resp.data:
                organoid_id = organoid_resp.data[0]['id']
            else:
                # 如果不存在，尝试从 Excel 数据创建
                print(f"  organoid {subject_id} 不存在，尝试创建...")
                
                # 获取区域ID（从 Excel 数据）
                region_id = None
                if not pd.isna(row.get('Region')):
                    region_name = str(row.get('Region')).strip()
                    region_abbrev_map = {
                        'Cerebral': 'CEREBRAL',
                        'Midbrain': 'MIDBRAIN',
                        'MGE': 'MGE',
                        'Medial Ganglionic Eminence': 'MGE'
                    }
                    region_abbrev = region_abbrev_map.get(region_name, region_name.upper())
                    region_resp = supabase.table('regions').select('id').eq('abbreviation', region_abbrev).execute()
                    if region_resp.data:
                        region_id = region_resp.data[0]['id']
                
                # 获取批次ID
                batch_id = None
                if not pd.isna(row.get('Batch_ID')):
                    batch_id_val = str(row.get('Batch_ID')).strip()
                    batch_resp = supabase.table('batches').select('id').eq('batch_id', batch_id_val).execute()
                    if batch_resp.data:
                        batch_id = batch_resp.data[0]['id']
                
                # 获取细胞系ID
                line_id = None
                if not pd.isna(row.get('Line_ID')):
                    line_id_val = str(row.get('Line_ID')).strip()
                    line_resp = supabase.table('cell_lines').select('id').eq('line_id', line_id_val).execute()
                    if line_resp.data:
                        line_id = line_resp.data[0]['id']
                
                # 创建 organoid
                organoid_data = {
                    'subject_id': subject_id,
                    'raw_data_id': raw_data_id,
                    'scan_id': scan_id,
                    'well_id': str(well_id) if well_id else None,
                    'batch_id': batch_id,
                    'line_id': line_id,
                    'region_id': region_id,
                    'tracking_type': bool(row.get('Tracking_Type', False)) if not pd.isna(row.get('Tracking_Type')) else False,
                    'age': str(row.get('Age', '')).strip() if not pd.isna(row.get('Age')) else None,
                    'scan_date': None  # 可以从 Excel 解析
                }
                
                try:
                    create_resp = supabase.table('organoids').insert(organoid_data).execute()
                    if create_resp.data:
                        organoid_id = create_resp.data[0]['id']
                        print(f"  创建 organoid: {subject_id}")
                except Exception as e:
                    print(f"  创建 organoid 失败: {str(e)}")
                    error_count += 1
                    continue
            
            if not organoid_id:
                print(f"  无法获取 organoid_id，跳过")
                error_count += 1
                continue
            
            # 上传文件
            if filename and not dry_run:
                local_file_path = os.path.join(wells_dir, filename)
                storage_path = f"{subject_id}/{filename}"
                
                print(f"  上传文件: {filename}")
                public_url = upload_file_to_storage(supabase, local_file_path, storage_path)
                
                if public_url:
                    file_upload_count += 1
                    
                    # 保存文件记录到数据库
                    file_metadata = {
                        'organoid_id': organoid_id,
                        'file_name': filename,
                        'file_path': storage_path,
                        'file_type': 'mri_volume_h5',
                        'file_size': os.path.getsize(local_file_path) if os.path.exists(local_file_path) else None,
                        'mime_type': 'application/x-hdf5',
                        'storage_bucket': 'organoid-files',
                        'metadata': {
                            'raw_data_id': raw_data_id,
                            'well_id': well_id,
                            'organoid_count': int(row.get('organoid_count', 0)) if not pd.isna(row.get('organoid_count')) else 0,
                            'organoid_volume_voxels': int(row.get('organoid_volume_voxels', 0)) if not pd.isna(row.get('organoid_volume_voxels')) else 0,
                            'bbox': {
                                'min_z': int(row.get('bbox_min_z', 0)) if not pd.isna(row.get('bbox_min_z')) else None,
                                'max_z': int(row.get('bbox_max_z', 0)) if not pd.isna(row.get('bbox_max_z')) else None,
                                'min_y': int(row.get('bbox_min_y', 0)) if not pd.isna(row.get('bbox_min_y')) else None,
                                'max_y': int(row.get('bbox_max_y', 0)) if not pd.isna(row.get('bbox_max_y')) else None,
                                'min_x': int(row.get('bbox_min_x', 0)) if not pd.isna(row.get('bbox_min_x')) else None,
                                'max_x': int(row.get('bbox_max_x', 0)) if not pd.isna(row.get('bbox_max_x')) else None,
                            },
                            'shape': {
                                'z': int(row.get('shape_z', 0)) if not pd.isna(row.get('shape_z')) else None,
                                'y': int(row.get('shape_y', 0)) if not pd.isna(row.get('shape_y')) else None,
                                'x': int(row.get('shape_x', 0)) if not pd.isna(row.get('shape_x')) else None,
                            },
                            'public_url': public_url
                        }
                    }
                    
                    # 检查文件是否已存在
                    existing_file = supabase.table('organoid_files').select('id').eq('organoid_id', organoid_id).eq('file_name', filename).execute()
                    
                    if existing_file.data:
                        # 更新现有记录
                        supabase.table('organoid_files').update(file_metadata).eq('id', existing_file.data[0]['id']).execute()
                        print(f"  更新文件记录: {filename}")
                    else:
                        # 插入新记录
                        supabase.table('organoid_files').insert(file_metadata).execute()
                        print(f"  创建文件记录: {filename}")
                else:
                    print(f"  文件上传失败: {filename}")
            elif dry_run:
                print(f"  [干运行] 将上传文件: {filename}")
            
            # 更新 organoid 的 well_id 和 raw_data_id
            if not dry_run:
                update_data = {}
                if well_id and pd.isna(row.get('Well_ID', pd.NA)):
                    update_data['well_id'] = str(well_id)
                if raw_data_id:
                    update_data['raw_data_id'] = raw_data_id
                
                if update_data:
                    supabase.table('organoids').update(update_data).eq('id', organoid_id).execute()
            
            success_count += 1
            
        except Exception as e:
            print(f"第 {idx+1} 行错误: {str(e)}")
            error_count += 1
            import traceback
            traceback.print_exc()
    
    print(f"\n导入完成:")
    print(f"  成功: {success_count} 条")
    print(f"  失败: {error_count} 条")
    print(f"  文件上传: {file_upload_count} 个")

if __name__ == '__main__':
    import sys
    
    if not SUPABASE_KEY:
        print("错误: 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量")
        print("使用方法: SUPABASE_SERVICE_ROLE_KEY=your_key python import-well-data.py")
        sys.exit(1)
    
    csv_path = 'data/well_organoid_mapping.csv'
    excel_path = 'FORMA-atlas.xlsx'
    wells_dir = 'data/wells'
    
    if len(sys.argv) > 1:
        csv_path = sys.argv[1]
    if len(sys.argv) > 2:
        excel_path = sys.argv[2]
    if len(sys.argv) > 3:
        wells_dir = sys.argv[3]
    
    dry_run = '--dry-run' in sys.argv
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    if dry_run:
        print("=== 干运行模式（不会实际写入数据库和上传文件）===")
    
    import_well_data(csv_path, excel_path, wells_dir, supabase, dry_run=dry_run)

