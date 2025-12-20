#!/usr/bin/env python3
"""
从 FORMA-atlas.xlsx 导入数据到 Supabase
需要安装: pip install pandas openpyxl supabase
"""

import pandas as pd
import os
from supabase import create_client, Client
from typing import Optional
import re

# Supabase 配置
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')  # 需要使用 service role key

def parse_age(age_str: Optional[str]) -> Optional[str]:
    """解析年龄字符串，如 'Day68' -> 'Day68'"""
    if pd.isna(age_str) or age_str is None:
        return None
    return str(age_str).strip()

def parse_scan_date(date_val) -> Optional[str]:
    """解析扫描日期，从 Excel 日期格式转换为 YYYY-MM-DD"""
    if pd.isna(date_val) or date_val is None:
        return None
    try:
        # Excel 日期可能是浮点数（如 20250716.0）
        if isinstance(date_val, float):
            date_str = str(int(date_val))
            if len(date_str) == 8:  # YYYYMMDD
                return f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
        # 或者已经是日期对象
        if hasattr(date_val, 'strftime'):
            return date_val.strftime('%Y-%m-%d')
    except:
        pass
    return None

def generate_subject_id(scan_id: str, well_id: Optional[str]) -> str:
    """生成 subject_id: Scan_ID + Well_ID"""
    if pd.isna(scan_id) or scan_id is None:
        return None
    
    scan_id_str = str(scan_id).strip()
    
    if pd.isna(well_id) or well_id is None:
        # 如果没有 well_id，尝试从 raw_data_id 提取
        return scan_id_str
    
    well_id_str = str(well_id).strip() if not pd.isna(well_id) else ''
    
    # 如果 well_id 是数字，格式化为 W01, W02 等
    if well_id_str.isdigit():
        well_id_str = f"W{int(well_id_str):02d}"
    elif not well_id_str.startswith('W'):
        well_id_str = f"W{well_id_str}"
    
    return f"{scan_id_str}{well_id_str}"

def import_data(excel_path: str, supabase: Client, dry_run: bool = False):
    """导入 Excel 数据到 Supabase"""
    
    print(f"读取 Excel 文件: {excel_path}")
    df = pd.read_excel(excel_path)
    
    print(f"共 {len(df)} 行数据")
    
    # 清理数据
    df = df.replace({pd.NA: None, 'nan': None, 'NaN': None})
    
    # 获取或创建区域映射
    regions_map = {}
    regions_resp = supabase.table('regions').select('id, abbreviation').execute()
    for region in regions_resp.data:
        regions_map[region['abbreviation']] = region['id']
    
    # 处理每一行
    success_count = 0
    error_count = 0
    
    for idx, row in df.iterrows():
        try:
            # 跳过完全空的行
            if pd.isna(row.get('Scan_ID')) and pd.isna(row.get('Raw_Data_ID')):
                continue
            
            # 生成 subject_id
            scan_id = str(row.get('Scan_ID', '')).strip() if not pd.isna(row.get('Scan_ID')) else None
            well_id = row.get('Well_ID')
            subject_id = row.get('Subject_ID')
            
            if not subject_id or pd.isna(subject_id):
                subject_id = generate_subject_id(scan_id, well_id)
            
            if not subject_id:
                print(f"第 {idx+1} 行: 无法生成 subject_id，跳过")
                error_count += 1
                continue
            
            # 处理批次
            batch_id = None
            if not pd.isna(row.get('Batch_ID')):
                batch_id_val = str(row.get('Batch_ID')).strip()
                batch_tag = str(row.get('Batch_Tag ', '')).strip() if not pd.isna(row.get('Batch_Tag ')) else None
                
                # 查找或创建批次
                batch_resp = supabase.table('batches').select('id').eq('batch_id', batch_id_val).execute()
                if batch_resp.data:
                    batch_id = batch_resp.data[0]['id']
                else:
                    if not dry_run:
                        batch_resp = supabase.table('batches').insert({
                            'batch_id': batch_id_val,
                            'batch_tag': batch_tag
                        }).execute()
                        batch_id = batch_resp.data[0]['id']
                    else:
                        print(f"  将创建批次: {batch_id_val}")
            
            # 处理细胞系
            line_id = None
            if not pd.isna(row.get('Line_ID')):
                line_id_val = str(row.get('Line_ID')).strip()
                line_name = str(row.get('Line', '')).strip() if not pd.isna(row.get('Line')) else None
                diagnose = str(row.get('Diagnose', '')).strip() if not pd.isna(row.get('Diagnose')) else None
                
                # 查找或创建细胞系
                line_resp = supabase.table('cell_lines').select('id').eq('line_id', line_id_val).execute()
                if line_resp.data:
                    line_id = line_resp.data[0]['id']
                else:
                    if not dry_run:
                        line_resp = supabase.table('cell_lines').insert({
                            'line_id': line_id_val,
                            'line_name': line_name,
                            'diagnose': diagnose
                        }).execute()
                        line_id = line_resp.data[0]['id']
                    else:
                        print(f"  将创建细胞系: {line_id_val}")
            
            # 处理区域
            region_id = None
            if not pd.isna(row.get('Region')):
                region_name = str(row.get('Region')).strip()
                # 映射区域名称到缩写
                region_abbrev_map = {
                    'Cerebral': 'CEREBRAL',
                    'Midbrain': 'MIDBRAIN',
                    'MGE': 'MGE',
                    'Medial Ganglionic Eminence': 'MGE'
                }
                region_abbrev = region_abbrev_map.get(region_name, region_name.upper())
                region_id = regions_map.get(region_abbrev)
            
            # 处理追踪组
            tracked_id = None
            if not pd.isna(row.get('Tracked_ID')):
                tracked_id_val = str(row.get('Tracked_ID')).strip()
                # 查找或创建追踪组
                track_resp = supabase.table('tracking_groups').select('id').eq('tracked_id', tracked_id_val).execute()
                if track_resp.data:
                    tracked_id = track_resp.data[0]['id']
                else:
                    if not dry_run:
                        track_resp = supabase.table('tracking_groups').insert({
                            'tracked_id': tracked_id_val
                        }).execute()
                        tracked_id = track_resp.data[0]['id']
                    else:
                        print(f"  将创建追踪组: {tracked_id_val}")
            
            # 准备类器官数据
            organoid_data = {
                'subject_id': subject_id,
                'raw_data_id': str(row.get('Raw_Data_ID', '')).strip() if not pd.isna(row.get('Raw_Data_ID')) else None,
                'scan_id': scan_id,
                'well_id': str(well_id).strip() if not pd.isna(well_id) else None,
                'batch_id': batch_id,
                'line_id': line_id,
                'region_id': region_id,
                'tracking_type': bool(row.get('Tracking_Type', False)) if not pd.isna(row.get('Tracking_Type')) else False,
                'tracked_id': tracked_id,
                'age': parse_age(row.get('Age')),
                'scan_date': parse_scan_date(row.get('Scan Date')),
                'notes': None
            }
            
            # 插入或更新类器官
            if not dry_run:
                # 检查是否已存在
                existing = supabase.table('organoids').select('id').eq('subject_id', subject_id).execute()
                if existing.data:
                    # 更新
                    supabase.table('organoids').update(organoid_data).eq('subject_id', subject_id).execute()
                    print(f"第 {idx+1} 行: 更新 {subject_id}")
                else:
                    # 插入
                    supabase.table('organoids').insert(organoid_data).execute()
                    print(f"第 {idx+1} 行: 插入 {subject_id}")
            else:
                print(f"第 {idx+1} 行: {subject_id} - {organoid_data}")
            
            success_count += 1
            
        except Exception as e:
            print(f"第 {idx+1} 行错误: {str(e)}")
            error_count += 1
            import traceback
            traceback.print_exc()
    
    print(f"\n导入完成: 成功 {success_count} 条, 失败 {error_count} 条")

if __name__ == '__main__':
    import sys
    
    if not SUPABASE_KEY:
        print("错误: 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量")
        print("使用方法: SUPABASE_SERVICE_ROLE_KEY=your_key python import-excel-data.py")
        sys.exit(1)
    
    excel_path = 'FORMA-atlas.xlsx'
    if len(sys.argv) > 1:
        excel_path = sys.argv[1]
    
    dry_run = '--dry-run' in sys.argv
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    if dry_run:
        print("=== 干运行模式（不会实际写入数据库）===")
    
    import_data(excel_path, supabase, dry_run=dry_run)

