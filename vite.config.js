import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/sqooli-api': {
        target: 'https://api.antodb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sqooli-api/, '/api'),
      },
    },
  },
})
