import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, UserConfig } from 'vite';
import 'dotenv/config';

const viteConfig: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {},
};

if (process.env.NODE_ENV === 'development') {
  viteConfig.server.proxy = {};

  if (process.env.VITE_AUTH_PROXY_TARGET) {
    viteConfig.server.proxy['^/o5-auth/.*'] = {
      target: process.env.VITE_AUTH_PROXY_TARGET,
      changeOrigin: true,
      secure: true,
      cookieDomainRewrite: 'localhost',
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('origin', process.env.VITE_AUTH_PROXY_TARGET);
          proxyReq.setHeader('referer', process.env.VITE_AUTH_PROXY_TARGET);
          proxyReq.setHeader('x-forwarded-host', process.env.VITE_AUTH_PROXY_TARGET.replace('https://', ''));
          proxyReq.setHeader('x-forwarded-proto', 'https');

          console.info(`o5-auth proxy: [${proxyReq.method}] ${proxyReq.path} -> ${process.env.VITE_AUTH_PROXY_TARGET}${proxyReq.path}`);
        });
      },
    };
  }

  if (process.env.VITE_REALM_PROXY_TARGET) {
    viteConfig.server.proxy['^/apiproxy/.*'] = {
      target: process.env.VITE_REALM_PROXY_TARGET,
      changeOrigin: true,
      secure: true,
      cookieDomainRewrite: 'localhost',
      rewrite: (path) => path.replace(/^\/apiproxy/, ''),
      configure: (proxy) => {
        proxy.on('proxyReq', (proxyReq) => {
          proxyReq.setHeader('origin', process.env.VITE_REALM_PROXY_TARGET);
          proxyReq.setHeader('referer', process.env.VITE_REALM_PROXY_TARGET);
          proxyReq.setHeader('x-forwarded-host', process.env.VITE_REALM_PROXY_TARGET.replace('https://', ''));
          proxyReq.setHeader('x-forwarded-proto', 'https');

          console.info(`Realm Proxy [${proxyReq.method}] ${proxyReq.path}`);
        });
      },
    };
  }
}

export default defineConfig(viteConfig);
