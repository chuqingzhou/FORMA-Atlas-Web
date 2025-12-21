#!/usr/bin/env python3
"""
批量上传所有 H5 文件到 Supabase Storage 并创建文件记录
使用正确的 Storage API
"""

import json
from pathlib import Path
from supabase import create_client
import time

SUPABASE_URL = 'https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net'
SUPABASE_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwicmVmIjoic3BiLXhqeHlhenNydTFxNnQ2YzQiLCJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjE1OTgwMiwiZXhwIjoyMDgxNzM1ODAyfQ.tMaroFQCeIpy315pB9qN9P-jxbJEBFekN0p_rM-KoHQ'

def main():
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    storage = supabase.storage
    bucket = storage.from_('organoid-files')
    
    # 读取文件信息
    with open('data/well_import_data.json', 'r') as f:
        data = json.load(f)
    
    wells_dir = Path('data/wells')
    success_count = 0
    error_count = 0
    skip_count = 0
    
    print(f"准备上传 {len(data)} 个文件...\n")
    
    for idx, item in enumerate(data, 1):
        try:
            subject_id = item.get('subject_id')
            filename = item.get('filename')
            
            if not subject_id or not filename:
                print(f"[{idx}/{len(data)}] 跳过：缺少 subject_id 或 filename")
                skip_count += 1
                continue
            
            file_path = wells_dir / filename
            if not file_path.exists():
                print(f"[{idx}/{len(data)}] 跳过：文件不存在 {filename}")
                skip_count += 1
                continue
            
            # 获取 organoid_id
            organoid_resp = supabase.table('organoids').select('id').eq('subject_id', subject_id).execute()
            if not organoid_resp.data:
                print(f"[{idx}/{len(data)}] 跳过：Organoid 不存在 {subject_id}")
                skip_count += 1
                continue
            
            organoid_id = organoid_resp.data[0]['id']
            storage_path = f"{subject_id}/{filename}"
            
            # 上传文件
            print(f"[{idx}/{len(data)}] 上传: {filename} ({file_path.stat().st_size / 1024:.1f} KB)")
            with open(file_path, 'rb') as f:
                file_data = f.read()
            
            try:
                bucket.upload(
                    storage_path,
                    file_data,
                    file_options={"content-type": "application/x-hdf5", "upsert": "true"}
                )
                print(f"  ✅ 文件上传成功")
            except Exception as upload_error:
                error_msg = str(upload_error)
                # 如果文件已存在，尝试更新
                if "already exists" in error_msg.lower() or "duplicate" in error_msg.lower():
                    try:
                        bucket.update(
                            storage_path,
                            file_data,
                            file_options={"content-type": "application/x-hdf5"}
                        )
                        print(f"  ✅ 文件更新成功")
                    except Exception as update_error:
                        print(f"  ⚠️  文件更新失败: {str(update_error)}")
                        error_count += 1
                        continue
                else:
                    print(f"  ⚠️  文件上传失败: {error_msg}")
                    error_count += 1
                    continue
            
            # 获取公共 URL
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/organoid-files/{storage_path}"
            
            # 创建/更新文件记录
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
                print(f"  ✅ 更新文件记录")
            else:
                supabase.table('organoid_files').insert(file_metadata).execute()
                print(f"  ✅ 创建文件记录")
            
            success_count += 1
            
            # 每10个文件休息一下，避免速率限制
            if idx % 10 == 0:
                print(f"\n已完成 {idx}/{len(data)} 个文件，休息 1 秒...\n")
                time.sleep(1)
                
        except Exception as e:
            print(f"[{idx}/{len(data)}] ❌ 错误 {filename}: {str(e)}")
            error_count += 1
            import traceback
            traceback.print_exc()
    
    print(f"\n{'='*50}")
    print(f"上传完成!")
    print(f"  成功: {success_count}")
    print(f"  失败: {error_count}")
    print(f"  跳过: {skip_count}")
    print(f"{'='*50}")

if __name__ == '__main__':
    main()

