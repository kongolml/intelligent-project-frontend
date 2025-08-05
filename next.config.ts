import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://intelligent-project.fra1.digitaloceanspaces.com/portfolio/**'), new URL('https://mir-s3-cdn-cf.behance.net/project_modules/**')]
  },
  // webpack(config) {
  //   // For Webpack Bundler
  //   config.module.rules.push({
  //     test: /\.svg$/i,
  //     issuer: /\.[jt]sx?$/,
  //     resourceQuery: { not: /url/ },
  //     use: ['@svgr/webpack'],
  //   });
  //   return config;
  // },
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
