import type { Locale } from './use-simple-locale/messages'

import { createSharedComposable } from '@vueuse/core'

import { computed, ref } from 'vue'

import { getMessages } from './use-simple-locale/messages'

export const useSimpleLocale = createSharedComposable(() => {
  const currentLocale = ref<Locale>('zh-cn')

  const setSimpleLocale = (locale: Locale) => {
    currentLocale.value = locale
  }

  const $t = computed(() => {
    const localeMessages = getMessages(currentLocale.value)
    return (key: string) => {
      return localeMessages[key] || key
    }
  })
  return {
    $t,
    currentLocale,
    setSimpleLocale,
  }
})
