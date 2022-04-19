import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

const routes = setupLayouts(generatedRoutes)

// 路由权限可在此处设计
//...

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
