<script setup lang="ts">
import { $t } from '@/locales'
import useSettingsStore from '@/store/modules/settings'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import Search from './search.vue'

defineOptions({
  name: 'NavSearch',
})

const settingsStore = useSettingsStore()
const [KModal, modalApi] = useKpuModal({
  connectedComponent: Search,
})
</script>

<template>
  <KpuButton :variant="settingsStore.mode === 'pc' ? 'outline' : 'ghost'" :size="settingsStore.mode === 'pc' ? undefined : 'icon'"
             :class="{ 'mx-2 px-3 h-9': settingsStore.mode === 'pc', 'size-9': settingsStore.mode !== 'pc' }" @click="() => modalApi.open()">
    <KpuIcon name="i-ri:search-line" :size="16" />
    <template v-if="settingsStore.mode === 'pc'">
      <span class="text-sm text-muted-foreground/60 transition group-hover-text-muted-foreground">{{ $t('app.search.text') }}</span>
      <KpuKbd v-if="settingsStore.settings.navSearch.enableHotkeys">
        {{ settingsStore.os === 'mac' ? '⌘' : 'Ctrl' }} K
      </KpuKbd>
    </template>
  </KpuButton>
  <KModal />
</template>
