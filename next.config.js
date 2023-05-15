/** @type {import('next').NextConfig} */
const proxy = require('http-proxy-middleware')
module.exports = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pages/login',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      // Rewrite /sign to target
      {
        source: '/sign/:path*',
        destination: 'http://www.whxy.club:5004/:path*',
      },
      // Rewrite /contract to target
      {
        source: '/contract/:path*',
        destination: 'http://www.whxy.club:5002/:path*',
      },
    ]
  },
  async serverMiddleware() {
    // Configure proxy middleware
    const proxyMiddlewareSign = proxy({
      target: 'http://www.whxy.club:5004',
      changeOrigin: true,
      pathRewrite: { '^/sign': '' },
    })

    const proxyMiddlewareContract = proxy({
      target: 'http://www.whxy.club:5002',
      changeOrigin: true,
      pathRewrite: { '^/contract': '' },
    })

    return [
      { path: '/sign', handler: proxyMiddlewareSign },
      { path: '/contract', handler: proxyMiddlewareContract },
    ]
  },
}
