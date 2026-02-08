#!/usr/bin/env python3
"""Import FORMA_Atlas_online_v1.0.xlsx to atlas_organoids via Supabase REST API."""
import os
import sys

SUPABASE_URL = os.environ.get('NEXT_PUBLIC_SUPABASE_URL') or 'https://spb-bp106195q465mbtj.supabase.opentrust.net'
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

def to_float(v):
    if v is None or v == '' or (isinstance(v, str) and v.strip() == ''):
        return None
    try:
        return float(v)
    except (ValueError, TypeError):
        return None

def to_int(v):
    if v is None or v == '' or (isinstance(v, str) and v.strip() == ''):
        return None
    try:
        return int(v)
    except (ValueError, TypeError):
        return None

def main():
    if not SUPABASE_KEY:
        print('Error: set SUPABASE_SERVICE_ROLE_KEY environment variable')
        sys.exit(1)

    from supabase import create_client
    import openpyxl

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    excel_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'FORMA_Atlas_online_v1.0.xlsx')
    wb = openpyxl.load_workbook(excel_path, read_only=True)
    ws = wb['Sheet1']

    rows = []
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        tracked_id = row[6]
        if tracked_id is not None and str(tracked_id).strip() != '':
            tracked_id = str(tracked_id)
        else:
            tracked_id = None
        rows.append({
            'organoid_id': str(row[0]),
            'scan_id': str(row[1]),
            'connect_id': to_int(row[2]),
            'batch_id': str(row[3]) if row[3] else None,
            'line_id': str(row[4]) if row[4] else None,
            'tracking_type': bool(row[5]),
            'tracked_id': tracked_id,
            'age': str(row[7]) if row[7] else None,
            'diagnose': str(row[8]) if row[8] else None,
            'region': str(row[9]) if row[9] else None,
            'voxel_count': to_int(row[10]),
            'volume': to_float(row[11]),
            'sav_ratio': to_float(row[12]),
            'sphericity': to_float(row[13]),
            'intensity_mean': to_float(row[14]),
            'inner_20_mean': to_float(row[15]),
            'outer_20_mean': to_float(row[16]),
            'intensity_cv': to_float(row[17]),
            'radial_intensity_slope': to_float(row[18]),
            'inner_outer_20_ratio': to_float(row[19]),
        })
    wb.close()

    batch_size = 200
    total = 0
    for start in range(0, len(rows), batch_size):
        chunk = rows[start:start + batch_size]
        try:
            result = supabase.table('atlas_organoids').insert(chunk).execute()
            total += len(chunk)
            print(f'Inserted {start + len(chunk)}/{len(rows)} rows')
        except Exception as e:
            print(f'Error at batch {start}: {e}')
            raise
    print(f'Done. Total imported: {total} rows')

if __name__ == '__main__':
    main()
