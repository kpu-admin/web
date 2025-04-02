import type { Settings } from '#/global'
import type { DefUserInfoResultVO, VisibleResourceVO } from '@/api/modules/model/oauthModel.ts'
import { requestClient } from '@/api'
import { findResourceList, getUserInfoById } from '@/api/modules/user.ts'
import router from '@/router'
import settingsDefault from '@/settings'
import useMenuStore from '@/store/modules/menu'
import useSettingsStore from '@/store/modules/settings'
import useTabbarStore from '@/store/modules/tabbar'
import eventBus from '@/utils/eventBus'
import { mergeWithArrayOverride } from '@/utils/object.ts'
import storage from '@/utils/storage'
import { cloneDeep } from 'es-toolkit'
import useRouteStore from './route'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const routeStore = useRouteStore()
    const settingsStore = useSettingsStore()
    const tabbarStore = useTabbarStore()
    const menuStore = useMenuStore()

    const account = ref(storage.local.get('account') ?? '')
    // const avatar = ref(storage.local.get('avatar') ?? '')
    const token = ref(storage.local.get('token') ?? '')
    const userInfo = ref<DefUserInfoResultVO>(JSON.parse(storage.local.get('userInfo') as string) || {} as DefUserInfoResultVO)
    const permissions = ref<string[]>([])
    // const roles = ref<string[]>([])
    const visibleResource = ref<VisibleResourceVO>({} as VisibleResourceVO)
    const isLogin = computed(() => {
      if (token.value) {
        return true
      }
      return false
    })

    // 登录
    async function login(data: {
      username: string
      password: string
    }) {
      // 通过 mock 进行登录
      const res = await requestClient.post<any>('/anyTenant/login', {
        username: data.username,
        password: data.password,
        grantType: 'PASSWORD',
      })
      storage.local.set('account', data.username)
      storage.local.set('token', res.token)
      storage.local.set('refreshToken', res.refreshToken)
      account.value = data.username
      token.value = res.token
    }
    // 登出
    async function logout(redirect = router.currentRoute.value.fullPath) {
      storage.local.remove('token')
      storage.local.remove('refreshToken')
      token.value = ''
      router.push({
        name: 'login',
        query: {
          ...(redirect !== settingsStore.settings.home.fullPath && router.currentRoute.value.name !== 'login' && { redirect }),
        },
      }).then(logoutCleanStatus)
    }
    function requestLogout() {
      storage.local.remove('token')
      storage.local.remove('refreshToken')

      token.value = ''
      if (settingsStore.settings.app.loginExpiredMode === 'redirect') {
        router.push({
          name: 'login',
          query: {
            ...router.currentRoute.value.fullPath !== settingsStore.settings.home.fullPath && router.currentRoute.value.name !== 'login' && {
              redirect: router.currentRoute.value.fullPath,
            },
          },
        }).then(logoutCleanStatus)
      }
      else {
        eventBus.emit('global-login-again-visible')
      }
    }
    function logoutCleanStatus() {
      storage.local.remove('account')
      storage.local.remove('userInfo')

      account.value = ''
      userInfo.value = {} as DefUserInfoResultVO
      permissions.value = []
      settingsStore.updateSettings({}, true)
      tabbarStore.clean()
      routeStore.removeRoutes()
      menuStore.setActived(0)
    }

    // 刷新时加载用户信息
    async function getUserInfo() {
      const res = await getUserInfoById()
      userInfo.value = res
      return res
    }
    // 获取我的权限
    async function getPermissions() {
      // 通过 mock 获取权限
      const res = await findResourceList()
      visibleResource.value = res
      permissions.value = res.resourceList
      return res
    }
    // 修改密码
    async function editPassword(data: {
      password: string
      newPassword: string
    }) {
      await requestClient.post('/member/edit/password', {
        data: {
          account: account.value,
          password: data.password,
          newpassword: data.newPassword,
        },
      })
    }
    const preferences = ref({
      app: {
        themeSync: settingsDefault.app.themeSync,
        colorScheme: settingsDefault.app.colorScheme,
        lightTheme: settingsDefault.app.lightTheme,
        darkTheme: settingsDefault.app.darkTheme,
        radius: settingsDefault.app.radius,
        enableColorAmblyopiaMode: settingsDefault.app.enableColorAmblyopiaMode,
        enableProgress: settingsDefault.app.enableProgress,
        defaultLang: settingsDefault.app.defaultLang,
      },
      menu: {
        mode: settingsDefault.menu.mode,
        style: settingsDefault.menu.style,
        mainMenuClickMode: settingsDefault.menu.mainMenuClickMode,
        subMenuUniqueOpened: settingsDefault.menu.subMenuUniqueOpened,
        subMenuCollapse: settingsDefault.menu.subMenuCollapse,
        subMenuAutoCollapse: settingsDefault.menu.subMenuAutoCollapse,
        enableSubMenuCollapseButton: settingsDefault.menu.enableSubMenuCollapseButton,
      },
      layout: {
        widthMode: settingsDefault.layout.widthMode,
      },
      mainPage: {
        enableTransition: settingsDefault.mainPage.enableTransition,
        transitionMode: settingsDefault.mainPage.transitionMode,
      },
      topbar: {
        mode: settingsDefault.topbar.mode,
        switchTabbarAndToolbar: settingsDefault.topbar.switchTabbarAndToolbar,
      },
      tabbar: {
        style: settingsDefault.tabbar.style,
        enableIcon: settingsDefault.tabbar.enableIcon,
        dblclickAction: settingsDefault.tabbar.dblclickAction,
        enableMemory: settingsDefault.tabbar.enableMemory,
      },
      toolbar: {
        breadcrumb: settingsDefault.toolbar.breadcrumb,
        navSearch: settingsDefault.toolbar.navSearch,
        fullscreen: settingsDefault.toolbar.fullscreen,
        pageReload: settingsDefault.toolbar.pageReload,
        colorScheme: settingsDefault.toolbar.colorScheme,
        layout: settingsDefault.toolbar.layout,
      },
      breadcrumb: {
        style: settingsDefault.breadcrumb.style,
        enableMainMenu: settingsDefault.breadcrumb.enableMainMenu,
      },
    })
    // isPreferencesUpdating 用于防止循环更新
    let isPreferencesUpdating = false
    watch(
      () => settingsStore.settings,
      (val) => {
        if (!settingsStore.settings.userPreferences.enable) {
          return
        }
        if (!isPreferencesUpdating) {
          isPreferencesUpdating = true
          preferences.value = mergeWithArrayOverride(val, preferences.value)
        }
        else {
          isPreferencesUpdating = false
        }
      },
      {
        deep: true,
      },
    )

    watch(
      preferences,
      (val) => {
        if (!settingsStore.settings.userPreferences.enable) {
          return
        }
        if (!isPreferencesUpdating) {
          isPreferencesUpdating = true
          settingsStore.updateSettings(cloneDeep(val))
        }
        else {
          isPreferencesUpdating = false
        }
        updatePreferences(cloneDeep(val))
      },
      {
        deep: true,
      },
    )
    // isPreferencesInited 用于防止初始化时触发更新
    let isPreferencesInited = false
    // preferencesInited 用于防止初始化时触发更新
    let preferencesInited = false
    // 获取偏好设置
    async function getPreferences() {
      let data: Settings.all = {}
      if (!preferencesInited) {
        preferencesInited = true
        if (settingsStore.settings.userPreferences.storageTo === 'local') {
          if (storage.local.has('userPreferences')) {
            data
            = JSON.parse(storage.local.get('userPreferences') as string)[
                account.value
              ] || {}
          }
        }
        else if (
          settingsStore.settings.userPreferences.storageTo === 'server'
        ) {
          const res = await requestClient.post<any>('/anyTenant/user/preferences')
          data = JSON.parse(res.data.preferences || '{}') as Settings.all
        }
      }
      preferences.value = mergeWithArrayOverride(data, preferences.value)
    }
    // 更新偏好设置
    async function updatePreferences(data: Settings.all = {}) {
      if (!isPreferencesInited) {
        isPreferencesInited = true
        return
      }
      if (!isLogin.value) {
        return
      }
      if (settingsStore.settings.userPreferences.storageTo === 'local') {
        const userPreferencesData = storage.local.has('userPreferences')
          ? JSON.parse(storage.local.get('userPreferences') as string)
          : {}
        userPreferencesData[account.value] = data
        storage.local.set(
          'userPreferences',
          JSON.stringify(userPreferencesData),
        )
      }
      else if (
        settingsStore.settings.userPreferences.storageTo === 'server'
      ) {
        await requestClient.post<any>('/anyTenant/user/preferences/edit', {
          preferences: JSON.stringify(data),
        })
      }
    }

    return {
      account,
      // avatar,
      token,
      userInfo,
      permissions,
      visibleResource,
      isLogin,
      login,
      logout,
      requestLogout,
      getUserInfo,
      getPermissions,
      editPassword,
      preferences,
      updatePreferences,
      getPreferences,
    }
  },
)

export default useUserStore
