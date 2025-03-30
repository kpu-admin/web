import pinia from '@/store'
import useSettingsStore from '@/store/modules/settings'

import { loadingFadeOut } from 'virtual:app-loading'
import { createRouter, createWebHashHistory } from 'vue-router'
import setupExtensions from './extensions.ts'
import setupGuards from './guards.ts'
// 路由相关数据
import { constantRoutes, constantRoutesByFilesystem } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: useSettingsStore(pinia).settings.app.routeBaseOn === 'filesystem' ? constantRoutesByFilesystem : constantRoutes,
})

setupGuards(router)
setupExtensions(router)

router.isReady().then(() => {
  loadingFadeOut()
})
export default router
