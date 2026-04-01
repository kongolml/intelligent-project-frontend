import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    viewTransition: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [new URL('https://intelligent-project.fra1.digitaloceanspaces.com/**'), new URL('https://intelligent-project.fra1.cdn.digitaloceanspaces.com/**'), new URL('https://mir-s3-cdn-cf.behance.net/project_modules/**')]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack(config: any) {
    console.log('webpack function called, rules count:', config.module.rules.length);
    // Handle SVG imports as React components via SVGR
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  turbopack: {
    // For Turbopack Bundler
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      '@assets': path.join(__dirname, 'src/assets'),
    },
  }
};

export default nextConfig;
