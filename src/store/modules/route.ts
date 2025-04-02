import type { Route } from '#/global'
import type { VisibleResourceVO } from '@/api/modules/model/oauthModel.ts'
import type { RouteRecordRaw, RouterMatcher } from 'vue-router'
import { systemRoutes as systemRoutesRaw } from '@/router/routes'
import { cloneDeep } from 'es-toolkit'
import { createRouterMatcher } from 'vue-router'
import useSettingsStore from './settings'
import useTabbarStore from './tabbar'

const useRouteStore = defineStore(
  // 唯一ID
  'route',
  () => {
    const settingsStore = useSettingsStore()
    const tabbarStore = useTabbarStore()
    const isGenerate = ref(false)
    // 原始路由
    const routesRaw = ref<Route.recordMainRaw[]>([])
    // 文件系统原始路由
    const filesystemRoutesRaw = ref<RouteRecordRaw[]>([])
    // 已注册的路由，用于登出时删除路由
    const currentRemoveRoutes = ref<(() => void)[]>([])

    // 实际路由
    const routes = computed(() => {
      const returnRoutes: RouteRecordRaw[] = []
      if (settingsStore.settings.app.routeBaseOn !== 'filesystem') {
        if (routesRaw.value) {
          routesRaw.value.forEach((item) => {
            const tmpRoutes = cloneDeep(item.children) as RouteRecordRaw[]
            tmpRoutes.map((v) => {
              if (!v.meta) {
                v.meta = {}
              }
              v.meta.auth = item.meta?.auth ?? v.meta?.auth
              return v
            })
            returnRoutes.push(...tmpRoutes)
          })
          returnRoutes.forEach((item) => {
            if (item.children) {
              item.children = deleteMiddleRouteComponent(item.children)
            }
            return item
          })
        }
      }
      else {
        returnRoutes.push(...cloneDeep(filesystemRoutesRaw.value) as RouteRecordRaw[])
      }
      return returnRoutes
    })

    // 系统路由
    const systemRoutes = computed(() => {
      const routes = [...systemRoutesRaw]
      routes.forEach((item) => {
        if (item.children) {
          item.children = deleteMiddleRouteComponent(item.children)
        }
      })
      return routes
    })

    // 删除路由中间层级对应的组件
    function deleteMiddleRouteComponent(routes: RouteRecordRaw[]) {
      const res: RouteRecordRaw[] = []
      routes.forEach((route) => {
        if (route.children?.length) {
          delete route.component
          route.children = deleteMiddleRouteComponent(route.children)
        }
        else {
          delete route.children
        }
        res.push(route)
      })
      return res
    }

    // 路由匹配器
    const routesMatcher = ref<RouterMatcher>()
    // 根据路径获取匹配的路由
    function getRouteMatchedByPath(path: string) {
      return routesMatcher.value?.resolve({ path }, undefined!)?.matched ?? []
    }

    function sortRoutes<T extends Route.recordMainRaw[]>(routes: T): T {
      routes.sort((a, b) => (b.meta?.sort ?? 0) - (a.meta?.sort ?? 0))

      routes.forEach(route => route.children && (route.children = sortRoutes(route.children as any)))

      // 返回排序并处理后的数组 y
      return routes
    }

    // 将设置 meta.singleMenu 的一级路由转换成二级路由
    function convertSingleRoutes<T extends Route.recordMainRaw[]>(routes: T): T {
      routes.map((route) => {
        if (route.children) {
          route.children.forEach((item, index, arr) => {
            if (item.meta?.singleMenu) {
              arr[index] = {
                ...item,
                component: () => import('@/layouts/index.vue'),
                children: [
                  {
                    path: '',
                    name: item.name,
                    component: item.component,
                    meta: {
                      title: item.meta.title,
                      menu: false,
                      breadcrumb: false,
                    },
                  },
                ],
              } as RouteRecordRaw
              delete arr[index].name
              delete arr[index].meta!.singleMenu
            }
          })
        }
        return route
      })
      return routes
    }

    // 格式化后端路由数据
    function formatBackRoutes(routes: any, views = import.meta.glob('../../views/**/*.vue')): Route.recordMainRaw[] {
      return routes.map((route: any) => {
        switch (route.component) {
          case 'LAYOUT':
          case 'Layout':
            route.component = () => import('@/layouts/index.vue')
            break
          default:
            if (route.component) {
              if (route.component.includes('.vue')) {
                route.component = views[`../../views/${route.component}`]
              }
              else {
                route.component = views[`../../views${route.component}.vue`]
              }
            }
            else {
              delete route.component
            }
        }
        if (route.children) {
          route.children = formatBackRoutes(route.children, views)
        }
        return route
      })
    }

    // 生成路由（前端生成）
    function generateRoutesAtFront(asyncRoutes: Route.recordMainRaw[]) {
      // 设置 routes 数据
      routesRaw.value = convertSingleRoutes(sortRoutes(cloneDeep(asyncRoutes) as any))
      // 创建路由匹配器
      const routes: RouteRecordRaw[] = []
      routesRaw.value.forEach((route) => {
        if (route.children) {
          routes.push(...route.children)
        }
      })
      routesMatcher.value = createRouterMatcher(routes, {})
      isGenerate.value = true
      // 加载常驻标签页
      if (settingsStore.settings.tabbar.enable) {
        tabbarStore.initPermanentTab()
      }
    }

    // 生成路由（后端获取）
    async function generateRoutesAtBack(visibleResource: VisibleResourceVO) {
      // 设置 routes 数据
      routesRaw.value = convertSingleRoutes(sortRoutes(formatBackRoutes(visibleResource.routerList) as any))
      // 创建路由匹配器
      const routes: RouteRecordRaw[] = []
      routesRaw.value.forEach((route) => {
        if (route.children) {
          routes.push(...route.children)
        }
      })
      routesMatcher.value = createRouterMatcher(routes, {})
      isGenerate.value = true
      // 初始化常驻标签页
      if (settingsStore.settings.tabbar.enable) {
        tabbarStore.initPermanentTab()
      }
    }
    // 生成路由（文件系统生成）
    function generateRoutesAtFilesystem(asyncRoutes: RouteRecordRaw[]) {
      // 设置 routes 数据
      filesystemRoutesRaw.value = convertSingleRoutes(sortRoutes(cloneDeep(asyncRoutes) as any))
      isGenerate.value = true
      // 加载常驻标签页
      if (settingsStore.settings.tabbar.enable) {
        tabbarStore.initPermanentTab()
      }
    }
    // 记录 accessRoutes 路由，用于登出时删除路由
    function setCurrentRemoveRoutes(routes: (() => void)[]) {
      currentRemoveRoutes.value = routes
    }
    // 清空动态路由
    function removeRoutes() {
      isGenerate.value = false
      routesRaw.value = []
      filesystemRoutesRaw.value = []
      currentRemoveRoutes.value.forEach((removeRoute) => {
        removeRoute()
      })
      currentRemoveRoutes.value = []
    }

    return {
      isGenerate,
      routesRaw,
      currentRemoveRoutes,
      routes,
      systemRoutes,
      getRouteMatchedByPath,
      generateRoutesAtFront,
      generateRoutesAtBack,
      generateRoutesAtFilesystem,
      setCurrentRemoveRoutes,
      removeRoutes,
    }
  },
)

export default useRouteStore
