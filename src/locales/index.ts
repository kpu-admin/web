import type { LocaleType } from '@/types'

import type { Locale } from 'ant-design-vue/es/locale'

import type { App } from 'vue'
import type { LocaleSetupOptions, SupportedLanguagesType } from './utils'
import useSettingsStore from '@/store/modules/settings'

import antdEnLocale from 'ant-design-vue/es/locale/en_US'
import antdDefaultLocale from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import { ref } from 'vue'
import {
  $t,
  setupI18n as coreSetup,
  loadLocalesMapFromDir,
} from './utils'

const antdLocale = ref<Locale>(antdDefaultLocale)

const modules = import.meta.glob('./langs/**/*.json')

const localesMap = loadLocalesMapFromDir(
  /\.\/langs\/([^/]+)\/(.*)\.json$/,
  modules,
)
/**
 * 加载应用特有的语言包
 * 这里也可以改造为从服务端获取翻译数据
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
  const [appLocaleMessages] = await Promise.all([
    localesMap[lang]?.(),
    loadThirdPartyMessage(lang),
  ])
  return appLocaleMessages?.default
}

/**
 * 加载第三方组件库的语言包
 * @param lang
 */
async function loadThirdPartyMessage(lang: SupportedLanguagesType) {
  await Promise.all([loadAntdLocale(lang), loadDayjsLocale(lang)])
}

/**
 * 加载dayjs的语言包
 * @param lang
 */
async function loadDayjsLocale(lang: SupportedLanguagesType) {
  let locale
  switch (lang) {
    case 'en': {
      locale = await import('dayjs/locale/en')
      break
    }
    case 'zh-cn': {
      locale = await import('dayjs/locale/zh-cn')
      break
    }
    // 默认使用英语
    default: {
      locale = await import('dayjs/locale/en')
    }
  }
  if (locale) {
    dayjs.locale(locale)
  }
  else {
    console.error(`Failed to load dayjs locale for ${lang}`)
  }
}

/**
 * 加载第三方组件库的语言包
 * @param lang
 */
async function loadAntdLocale(lang: SupportedLanguagesType) {
  switch (lang) {
    case 'en': {
      antdLocale.value = antdEnLocale
      break
    }
    case 'zh-cn': {
      antdLocale.value = antdDefaultLocale
      break
    }
  }
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  const settingsStore = useSettingsStore()
  let locale = settingsStore.settings.app.defaultLang

  if (!locale) {
    // navigator.language || navigator.browserLanguage
    const lang = (navigator.language).toLowerCase() as LocaleType
    locale = lang
    setTimeout(() => {
      settingsStore.setDefaultLang(lang)
    }, 100)
  }
  await coreSetup(app, {
    defaultLocale: locale,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
    ...options,
  })
}

export { $t, antdLocale, setupI18n }
