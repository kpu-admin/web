<script setup lang="ts">
import { $t } from '@/locales/utils'
import useSettingsStore from '@/store/modules/settings'
import useUserStore from '@/store/modules/user'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import eventBus from '@/utils/eventBus'
import Profile from './profile.vue'

const router = useRouter()

const settingsStore = useSettingsStore()
const userStore = useUserStore()
const { generateI18nTitle } = useMenu()
// const isProfileShow = ref(false)
const [KpuModal, _modalApi] = useKpuModal({
})
</script>

<template>
  <KpuDropdown
    align="end" :items="[
      [
        { label: generateI18nTitle(settingsStore.settings.home.title), icon: 'i-mdi:home', handle: () => router.push({ path: settingsStore.settings.home.fullPath }), hide: !settingsStore.settings.home.enable },
        { label: $t('app.profile'), icon: 'i-mdi:account', handle: () => router.push({ name: 'personal' }) },
      ],
      [
        { label: $t('app.hotkeys.title'), icon: 'i-mdi:keyboard', handle: () => eventBus.emit('global-hotkeys-intro-toggle'), hide: settingsStore.mode !== 'pc' },
      ],
      [
        { label: $t('app.logout'), icon: 'i-mdi:logout', handle: () => userStore.logout(settingsStore.settings.home.fullPath) },
      ],
    ]" class="flex-center"
  >
    <template #label>
      <div class="space-y-2">
        <div class="text-xs text-secondary-foreground/50 font-light">
          {{ $t('app.currentAccount') }}
        </div>
        <div class="flex-center-start gap-2">
          <KpuAvatar :src="userStore.userInfo.avatar" :fallback="userStore.account.slice(0, 5)" shape="square" />
          <div class="space-y-1">
            <div class="text-base lh-none">
              {{ userStore.account }}
            </div>
            <div class="text-xs text-secondary-foreground/50 font-normal">
              这里可以显示邮箱
            </div>
          </div>
        </div>
      </div>
    </template>
    <KpuButton variant="ghost" class="h-9 flex-center gap-1 px-2">
      <KpuAvatar :src="userStore.userInfo.avatar" class="size-6">
        <KpuIcon name="i-carbon:user-avatar-filled-alt" :size="24" class="text-secondary-foreground/50" />
      </KpuAvatar>
      <template v-if="settingsStore.mode === 'pc'">
        {{ userStore.account }}
        <KpuIcon name="i-ep:caret-bottom" />
      </template>
    </KpuButton>
  </KpuDropdown>
  <KpuModal align-center :closable="false" :fullscreen-button="false" :header="false" :footer="false" :close-on-click-overlay="false" :close-on-press-escape="false" class="h-500px min-w-600px overflow-hidden" content-class="min-h-full p-0 flex">
    <Profile />
  </KpuModal>
</template>
