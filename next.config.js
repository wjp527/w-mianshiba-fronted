/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: false, // 禁用严格模式，消除findDOMNode警告
  env: {
    DISABLE_ANTD_COMPATIBLE_WARNING: 'true',
  },
  // 配置图片域名
  images: {
    domains: ['localhost', '127.0.0.1', 'https://w-mianshiba-1308962059.cos.ap-nanjing.myqcloud.com'],
  },
}

module.exports = nextConfig
