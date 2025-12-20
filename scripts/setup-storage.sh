#!/bin/bash
# 设置 Supabase Storage bucket

echo "设置 Supabase Storage..."

# 注意：这个脚本需要手动在 Supabase Dashboard 中执行，或者使用 Supabase CLI
# 这里提供 SQL 命令用于创建 bucket

cat << 'EOF'
-- 在 Supabase Dashboard 的 SQL Editor 中执行以下命令：

-- 创建存储 bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('organoid-files', 'organoid-files', true)
ON CONFLICT (id) DO NOTHING;

-- 设置 bucket 策略（允许公开读取）
CREATE POLICY "Public read access for organoid-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'organoid-files');

-- 设置 bucket 策略（允许上传，生产环境应该限制为认证用户）
CREATE POLICY "Public insert access for organoid-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'organoid-files');

-- 设置 bucket 策略（允许删除，生产环境应该限制为认证用户）
CREATE POLICY "Public delete access for organoid-files"
ON storage.objects FOR DELETE
USING (bucket_id = 'organoid-files');
EOF

echo ""
echo "或者使用 Supabase CLI:"
echo "  supabase storage create organoid-files --public"
echo "  supabase storage policy create organoid-files public-read --bucket organoid-files --operation select"
echo "  supabase storage policy create organoid-files public-upload --bucket organoid-files --operation insert"

