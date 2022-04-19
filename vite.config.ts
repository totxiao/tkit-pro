import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as path from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // 以文件系统为基础的路由
    Pages({
      dirs: [{ dir: 'src/views', baseRoute: '/' }],
    }),
    Layouts({
      defaultLayout: 'BasicLayout',
    }),
    Components({
      resolvers: [AntDesignVueResolver()],
      dts: 'types/components.d.ts',
    }),
    // 自动引入依赖的黑科技,如果影响代码可读性,可注释
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'types/auto-imports.d.ts',
      eslintrc: {
        enabled: true, // Default `false`
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@comps': path.resolve(__dirname, 'src/components'),
    },
  },
  define: {
    'process.env': {},
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_ROOT_URL,
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
