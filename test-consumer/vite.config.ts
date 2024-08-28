import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      ['/stage-api']: {
        /** portal */
        target: 'http://100.98.1.107:30120',
        /** val */
        // target: 'http://100.98.1.107:30143',
        /** copf-site */
        // target: 'http://100.98.1.107:30113/',
        changeOrigin: true,
        headers: {
          EportalToken: '7820fbf0-1eaa-47ef-91df-ccde4658a4a5',
        },
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
