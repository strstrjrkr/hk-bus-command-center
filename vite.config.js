import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          leaflet: ['leaflet']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api/kmb': {
        target: 'https://data.etabus.gov.hk/v1/transport/kmb',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/kmb/, '')
      },
      '/api/ctb': {
        target: 'https://rt.data.gov.hk/v2/transport/citybus',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/ctb/, '')
      },
      '/api/td': {
        target: 'https://resource.data.one.gov.hk/td',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/td/, '')
      }
    }
  }
});
