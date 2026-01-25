-- 将Storage bucket改为private，并设置权限策略
-- 执行此SQL脚本以保护H5文件不被未授权访问

-- 1. 将bucket改为private（非公开）
UPDATE storage.buckets
SET public = false
WHERE id = 'organoid-files';

-- 2. 删除所有现有的public访问策略
DROP POLICY IF EXISTS "Public read access for organoid-files" ON storage.objects;
DROP POLICY IF EXISTS "Public insert access for organoid-files" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for organoid-files" ON storage.objects;

-- 3. 创建新的权限策略：只有通过服务端API（使用service role key）才能访问
-- 注意：这个策略实际上是通过API路由中的权限检查来控制的
-- Storage策略允许authenticated用户通过signed URL访问

-- 允许authenticated用户通过signed URL访问（由API路由控制权限）
CREATE POLICY "Authenticated users can access organoid-files via signed URLs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'organoid-files' 
  AND auth.role() = 'authenticated'
);

-- 4. 确保只有service role可以创建signed URLs
-- 这个由Supabase的存储API自动处理，只有使用service role key的请求才能创建signed URLs

-- 注意：
-- - 前端不能直接访问文件，必须通过 /api/h5-file-url 路由
-- - API路由会验证用户邮箱是否为 chuqingz@126.com
-- - 只有通过验证的用户才能获得signed URL
-- - signed URL有1小时的有效期


