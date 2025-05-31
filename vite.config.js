import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import preact from '@preact/preset-vite'

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()]
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/auth': {
        target: 'https://localhost:7040',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('auth proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Auth Request:', req.method, req.url);
            if (req.headers.cookie) {
              proxyReq.setHeader('cookie', req.headers.cookie);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Auth Response from:', req.url, proxyRes.statusCode);
            if (proxyRes.headers['set-cookie']) {
              console.log('Setting auth cookies:', proxyRes.headers['set-cookie']);
            }
          });
        }
      },
      '/services': {
        target: 'https://localhost:7040',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('services proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Services Request:', req.method, req.url);
            if (req.headers.cookie) {
              proxyReq.setHeader('cookie', req.headers.cookie);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Services Response from:', req.url, proxyRes.statusCode);
            if (proxyRes.headers['set-cookie']) {
              console.log('Setting services cookies:', proxyRes.headers['set-cookie']);
            }
          });
        }
      },
      '/bookings': {
        target: 'https://localhost:7040',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('bookings proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Bookings Request:', req.method, req.url);
            if (req.headers.cookie) {
              proxyReq.setHeader('cookie', req.headers.cookie);
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Bookings Response from:', req.url, proxyRes.statusCode);
            if (proxyRes.headers['set-cookie']) {
              console.log('Setting bookings cookies:', proxyRes.headers['set-cookie']);
            }
          });
        }
      }
    }
  },
  plugins: [preact()],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime'
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
})
