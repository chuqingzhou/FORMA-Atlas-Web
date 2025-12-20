/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['spb-xjxyazsru1q6t6c4.supabase.opentrust.net'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // 修复 three-mesh-bvh 的 BatchedMesh 导入问题
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': require.resolve('three'),
    }
    
    return config
  },
}

module.exports = nextConfig

