/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: false, // 禁用严格模式，消除findDOMNode警告
  env: {
    DISABLE_ANTD_COMPATIBLE_WARNING: 'true',
  },
}

module.exports = nextConfig
