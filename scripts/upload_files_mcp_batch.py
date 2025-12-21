#!/usr/bin/env python3
"""
使用 Supabase MCP API 批量上传文件
"""

import json
import base64
from pathlib import Path

def read_file_base64(file_path):
    """读取文件并转换为 base64"""
    with open(file_path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')

def main():
    # 读取文件列表
    with open('data/well_import_data.json') as f:
        data = json.load(f)
    
    wells_dir = Path('data/wells')
    
    print(f"准备上传 {len(data)} 个文件...\n")
    
    # 生成上传脚本内容（由于MCP限制，我们需要手动调用）
    upload_commands = []
    file_records_sql = []
    
    for idx, item in enumerate(data, 1):
        subject_id = item.get('subject_id')
        filename = item.get('filename')
        
        if not subject_id or not filename:
            continue
        
        file_path = wells_dir / filename
        if not file_path.exists():
            print(f"[{idx}/{len(data)}] 跳过：文件不存在 {filename}")
            continue
        
        storage_path = f"{subject_id}/{filename}"
        file_size = file_path.stat().st_size
        
        # 生成上传命令信息
        upload_commands.append({
            'index': idx,
            'total': len(data),
            'filename': filename,
            'storage_path': storage_path,
            'file_size': file_size,
            'subject_id': subject_id,
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
                }
            }
        })
    
    # 保存上传命令到JSON文件
    with open('data/upload_commands.json', 'w') as f:
        json.dump(upload_commands, f, indent=2)
    
    print(f"生成 {len(upload_commands)} 个上传任务")
    print(f"详细信息已保存到 data/upload_commands.json")
    print("\n提示：由于文件较多，请分批上传。前5个文件信息：")
    for cmd in upload_commands[:5]:
        print(f"  {cmd['index']}. {cmd['filename']} -> {cmd['storage_path']} ({cmd['file_size']} bytes)")

if __name__ == '__main__':
    main()

