/**
 * 将 source Supabase (spb-xjxyazsru1q6t6c4) 的 organoid-files 存储桶文件
 * 复制到 target (spb-bp106195q465mbtj)。需在项目根目录运行：
 * SUPABASE_SERVICE_ROLE_KEY=<target_service_role_key> node scripts/copy-storage-source-to-target.mjs
 */
const SOURCE_URL = 'https://spb-xjxyazsru1q6t6c4.supabase.opentrust.net'
const TARGET_URL = 'https://spb-bp106195q465mbtj.supabase.opentrust.net'
const BUCKET = 'organoid-files'

const targetServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!targetServiceKey) {
  console.error('请设置环境变量 SUPABASE_SERVICE_ROLE_KEY（target 的 service role key）')
  process.exit(1)
}

const files = [
  'S113W01/18-1-1.h5','S113W02/18-1-2.h5','S113W03/18-1-3.h5','S113W04/18-1-4.h5','S113W05/18-1-5.h5',
  'S113W06/18-1-6.h5','S113W07/18-1-7.h5','S113W08/18-1-8.h5','S113W09/18-1-9.h5','S113W10/18-1-10.h5',
  'S113W11/18-1-11.h5','S113W12/18-1-12.h5','S113W13/18-1-13.h5','S113W14/18-1-14.h5','S113W15/18-1-15.h5',
  'S114W01/18-2-1.h5','S114W02/18-2-2.h5','S114W03/18-2-3.h5','S114W04/18-2-4.h5','S114W05/18-2-5.h5',
  'S114W06/18-2-6.h5','S114W07/18-2-7.h5','S114W08/18-2-8.h5','S114W09/18-2-9.h5','S114W10/18-2-10.h5',
  'S114W11/18-2-11.h5','S114W12/18-2-12.h5','S114W13/18-2-13.h5','S114W14/18-2-14.h5','S114W15/18-2-15.h5',
  'S115W01/18-3-1.h5','S115W02/18-3-2.h5','S115W03/18-3-3.h5','S115W04/18-3-4.h5','S115W05/18-3-5.h5',
  'S115W06/18-3-6.h5','S115W07/18-3-7.h5','S115W08/18-3-8.h5','S115W09/18-3-9.h5','S115W10/18-3-10.h5',
  'S115W11/18-3-11.h5','S115W12/18-3-12.h5','S115W13/18-3-13.h5','S115W14/18-3-14.h5','S115W15/18-3-15.h5',
  'S116W01/18-4-1.h5','S116W02/18-4-2.h5','S116W03/18-4-3.h5','S116W04/18-4-4.h5','S116W05/18-4-5.h5',
  'S116W06/18-4-6.h5','S116W07/18-4-7.h5','S116W08/18-4-8.h5','S116W09/18-4-9.h5','S116W10/18-4-10.h5',
  'S116W11/18-4-11.h5','S116W12/18-4-12.h5','S116W13/18-4-13.h5','S116W14/18-4-14.h5','S116W15/18-4-15.h5'
]

async function main() {
  const { createClient } = await import('@supabase/supabase-js')
  const target = createClient(TARGET_URL, targetServiceKey)
  let ok = 0
  let fail = 0
  for (const path of files) {
    const publicUrl = `${SOURCE_URL}/storage/v1/object/public/${BUCKET}/${path}`
    try {
      const res = await fetch(publicUrl)
      if (!res.ok) throw new Error(res.status)
      const buf = await res.arrayBuffer()
      const { error } = await target.storage.from(BUCKET).upload(path, buf, { upsert: true, contentType: 'application/x-hdf5' })
      if (error) throw error
      ok++
      console.log('ok', path)
    } catch (e) {
      fail++
      console.error('fail', path, e.message || e)
    }
  }
  console.log('done:', ok, 'ok', fail, 'fail')
}

main()
