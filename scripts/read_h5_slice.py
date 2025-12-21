#!/usr/bin/env python3
"""
读取H5文件并返回指定维度的切片数据
"""
import sys
import json
import numpy as np
import h5py
import requests
from pathlib import Path

def read_h5_slice_from_url(url, dimension='z', slice_index=0, include_prediction=False):
    """
    从URL下载H5文件并读取切片数据
    
    参数:
        url: H5文件的URL
        dimension: 维度 ('x', 'y', 'z')
        slice_index: 切片索引
        include_prediction: 是否包含预测数据
    
    返回:
        字典，包含切片数据和相关信息
    """
    try:
        # 下载文件
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # 保存到临时文件
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.h5') as tmp_file:
            tmp_file.write(response.content)
            tmp_file_path = tmp_file.name
        
        # 读取H5文件
        with h5py.File(tmp_file_path, 'r') as f:
            raw_data = f['raw'][:]
            shape = raw_data.shape
            
            # 根据维度提取切片
            if dimension == 'z':
                # Z维度：显示X-Y平面 (Z slice)
                if slice_index >= shape[0]:
                    slice_index = shape[0] - 1
                slice_raw = raw_data[slice_index, :, :]
                if include_prediction and 'prediction' in f:
                    slice_pred = f['prediction'][slice_index, :, :]
                else:
                    slice_pred = None
            elif dimension == 'y':
                # Y维度：显示X-Z平面 (Y slice)
                if slice_index >= shape[1]:
                    slice_index = shape[1] - 1
                slice_raw = raw_data[:, slice_index, :]
                if include_prediction and 'prediction' in f:
                    slice_pred = f['prediction'][:, slice_index, :]
                else:
                    slice_pred = None
            else:  # dimension == 'x'
                # X维度：显示Y-Z平面 (X slice)
                if slice_index >= shape[2]:
                    slice_index = shape[2] - 1
                slice_raw = raw_data[:, :, slice_index]
                if include_prediction and 'prediction' in f:
                    slice_pred = f['prediction'][:, :, slice_index]
                else:
                    slice_pred = None
            
            # 归一化到0-255
            if slice_raw.max() > slice_raw.min():
                slice_raw_normalized = ((slice_raw - slice_raw.min()) / (slice_raw.max() - slice_raw.min()) * 255).astype(np.uint8)
            else:
                slice_raw_normalized = np.zeros_like(slice_raw, dtype=np.uint8)
            
            result = {
                'raw': slice_raw_normalized.tolist(),
                'shape': list(slice_raw.shape),
                'dimension': dimension,
                'sliceIndex': slice_index,
            }
            
            if slice_pred is not None:
                slice_pred_binary = (slice_pred > 0.5).astype(np.uint8) * 255
                result['prediction'] = slice_pred_binary.tolist()
            
            # 清理临时文件
            import os
            os.unlink(tmp_file_path)
            
            return result
            
    except Exception as e:
        import os
        if 'tmp_file_path' in locals() and os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)
        raise e

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Missing URL parameter'}))
        sys.exit(1)
    
    url = sys.argv[1]
    dimension = sys.argv[2] if len(sys.argv) > 2 else 'z'
    slice_index = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    include_prediction = sys.argv[4].lower() == 'true' if len(sys.argv) > 4 else False
    
    try:
        result = read_h5_slice_from_url(url, dimension, slice_index, include_prediction)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)

