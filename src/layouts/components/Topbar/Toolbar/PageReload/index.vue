<script setup lang="ts">
import useSettingsStore from '@/store/modules/settings.ts'
import hotkeys from 'hotkeys-js'

defineOptions({
  name: 'PageReload',
})

const settingsStore = useSettingsStore()
const mainPage = useMainPage()

const isAnimating = ref(false)

onMounted(() => {
  hotkeys('f5', (e) => {
    if (settingsStore.settings.toolbar.pageReload) {
      e.preventDefault()
      mainPage.reload()
    }
  })
})
onUnmounted(() => {
  hotkeys.unbind('f5')
})

function handleClick() {
  isAnimating.value = true
  mainPage.reload()
}
function handleCtrlClick() {
  location.reload()
}
</script>

<template>
  <KpuTooltip side="bottom" :disabled="settingsStore.os === 'mac'">
    <template #content>
      <div class="flex-col-center gap-2">
        <p>按住 <KpuKbd>Ctrl</KpuKbd> 键并点击</p>
        <p>可切换为浏览器原生刷新</p>
      </div>
    </template>
    <KpuButton variant="ghost" size="icon" class="size-9" @click.exact="handleClick" @click.ctrl.exact="handleCtrlClick" @animationend="isAnimating = false">
      <KpuIcon name="i-iconoir:refresh-double" class="size-4" :class="{ animation: isAnimating }" />
    </KpuButton>
  </KpuTooltip>
</template>

<style scoped>
.animation {
  animation: animation 1s;
}

@keyframes animation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
