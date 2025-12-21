#!/usr/bin/env python3
"""读取文件并准备上传数据"""

import json
import base64
from pathlib import Path

# 读取第一个文件
with open('data/well_import_data.json') as f:
    data = json.load(f)

item = data[0]
file_path = Path('data/wells') / item['filename']

# 读取文件并编码
with open(file_path, 'rb') as f:
    file_content_base64 = base64.b64encode(f.read()).decode('utf-8')

storage_path = f"{item['subject_id']}/{item['filename']}"

print(f"文件: {item['filename']}")
print(f"存储路径: {storage_path}")
print(f"Base64内容长度: {len(file_content_base64)} 字符")
print(f"\n文件内容（前100字符）:")
print(file_content_base64[:100])

