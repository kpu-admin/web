<script setup lang="ts">
import type { IntervalHandle } from '#/index'
import { $t } from '@/locales'
import useSettingsStore from '@/store/modules/settings.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'

interface Props {
  // 轮训时间，分钟
  // checkUpdatesInterval?: number
  // 检查更新的地址
  checkUpdateUrl?: string
}

defineOptions({ name: 'CheckUpdates' })
const props = withDefaults(defineProps<Props>(), {
  // checkUpdatesInterval: 1,
  checkUpdateUrl: import.meta.env.BASE_URL || '/',
})
const settingsStore = useSettingsStore()
let isCheckingUpdates = false
const currentVersionTag = ref('')
const lastVersionTag = ref('')
const timer = ref<IntervalHandle>()

const [UpdateNoticeModal, modalApi] = useKpuModal({
  closable: false,
  closeOnPressEscape: false,
  closeOnClickModal: false,
  onConfirm() {
    lastVersionTag.value = currentVersionTag.value
    window.location.reload()
    // handleSubmitLogout();
  },
})

async function getVersionTag() {
  try {
    if (
      location.hostname === 'localhost'
      || location.hostname === '127.0.0.1'
    ) {
      return null
    }
    const response = await fetch(props.checkUpdateUrl, {
      cache: 'no-cache',
      method: 'HEAD',
    })

    return (
      response.headers.get('etag') || response.headers.get('last-modified')
    )
  }
  catch {
    console.error('Failed to fetch version tag')
    return null
  }
}

async function checkForUpdates() {
  const versionTag = await getVersionTag()
  if (!versionTag) {
    return
  }

  // 首次运行时不提示更新
  if (!lastVersionTag.value) {
    lastVersionTag.value = versionTag
    return
  }

  if (lastVersionTag.value !== versionTag && versionTag) {
    clearInterval(timer.value)
    handleNotice(versionTag)
  }
}
function handleNotice(versionTag: string) {
  currentVersionTag.value = versionTag
  modalApi.open()
}

function start() {
  if (settingsStore.settings.app.checkUpdatesInterval <= 0) {
    return
  }

  // 每 checkUpdatesInterval(默认值为1) 分钟检查一次
  timer.value = setInterval(
    checkForUpdates,
    settingsStore.settings.app.checkUpdatesInterval * 60 * 1000,
  )
}

function handleVisibilitychange() {
  if (document.hidden) {
    stop()
  }
  else {
    if (!isCheckingUpdates) {
      isCheckingUpdates = true
      checkForUpdates().finally(() => {
        isCheckingUpdates = false
        start()
      })
    }
  }
}

function stop() {
  clearInterval(timer.value)
}

onMounted(() => {
  if (settingsStore.settings.app.enableCheckUpdates) {
    start()
    document.addEventListener('visibilitychange', handleVisibilitychange)
  }
})

onUnmounted(() => {
  if (settingsStore.settings.app.enableCheckUpdates) {
    stop()
    document.removeEventListener('visibilitychange', handleVisibilitychange)
  }
})
</script>

<template>
  <UpdateNoticeModal
    :cancel-text="$t('common.cancel')"
    :confirm-text="$t('common.refresh')"
    :fullscreen-button="false"
    :title="$t('app.checkUpdatesTitle')"
    centered
    content-class="px-8 min-h-10"
    footer-class="border-none mb-3 mr-3"
    header-class="border-none"
  >
    {{ $t('app.checkUpdatesDescription') }}
  </UpdateNoticeModal>
</template>
