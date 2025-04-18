<script setup lang="ts">
import ColorScheme from '@/layouts/components/Topbar/Toolbar/ColorScheme/index.vue'
import I18n from '@/layouts/components/Topbar/Toolbar/I18n/index.vue'
import useSettingsStore from '@/store/modules/settings.ts'
import LoginForm from '@/views/login/components/LoginForm/index.vue'
import RegisterForm from '@/views/login/components/RegisterForm/index.vue'
import ResetPasswordForm from '@/views/login/components/ResetPasswordForm/index.vue'
import themes from '../../../themes'

defineOptions({
  name: 'Login',
})
const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()

const themeList = computed(() => {
  return Object.keys(themes).map((key) => {
    return {
      label: key,
      value: (themes as any)[key][settingsStore.currentColorScheme || 'light'],
    }
  })
})

const layout = ref<'right' | 'center' | 'left'>('center')
const redirect = ref(route.query.redirect?.toString() ?? settingsStore.settings.home.fullPath)

// 表单类型，login 登录，register 注册，reset 重置密码
const formType = ref<'login' | 'register' | 'resetPassword'>('login')
const account = ref<string>()
const formRef = ref()
</script>

<template>
  <div class="bg-banner" />
  <div class="absolute right-4 top-4 z-1 flex-center border rounded-lg bg-background p-1 text-base">
    <KpuDropdown
      v-if="settingsStore.mode === 'pc'" :items="[
        [{
          label: '左侧布局',
          disabled: layout === 'left',
          handle: () => {
            layout = 'left'
          },
        }, {
          label: '居中布局',
          disabled: layout === 'center',
          handle: () => {
            layout = 'center'
          },
        }, {
          label: '右侧布局',
          disabled: layout === 'right',
          handle: () => {
            layout = 'right'
          },
        }],
      ]"
    >
      <KpuButton variant="ghost" size="icon" class="h-9 w-9">
        <KpuIcon
          :name="{
            left: 'i-icon-park-outline:left-bar',
            center: 'i-icon-park-outline:square',
            right: 'i-icon-park-outline:right-bar',
          }[layout]"
          :size="16"
        />
      </KpuButton>
    </KpuDropdown>

    <I18n v-if="settingsStore.settings.toolbar.i18n" class="rounded-full hover-bg-[var(--g-bg)]" />
    <KpuPopover class="min-w-auto p-0">
      <template #panel>
        <div class="grid grid-cols-3 w-28 gap-2 p-4">
          <div
            v-for="item in themeList" :key="item.label"
            class="m-auto h-5 w-5 flex cursor-pointer items-center justify-center border-2 border-border border-transparent rounded-full text-xs transition-border"
            :class="{
              'border-primary!': settingsStore.currentColorScheme === 'dark' ? settingsStore.settings.app.darkTheme === item.label : settingsStore.settings.app.lightTheme === item.label,
            }"
            @click="settingsStore.currentColorScheme === 'dark' ? settingsStore.settings.app.darkTheme = item.label : settingsStore.settings.app.lightTheme = item.label"
          >
            <div class="h-3 w-3 flex items-center justify-center rounded-full" :style="`background-color: hsl(${item.value['--primary']});`" />
          </div>
        </div>
      </template>
      <KpuButton variant="ghost" size="icon" class="h-9 w-9">
        <KpuIcon name="i-mdi:circle" class="text-primary" />
      </KpuButton>
    </KpuPopover>
    <ColorScheme v-if="settingsStore.settings.toolbar.colorScheme" class="rounded-full hover-bg-[var(--g-bg)]" />
  </div>

  <div class="login-box" :class="layout">
    <div class="login-banner">
      <img src="@/assets/images/logo.png" class="absolute left-4 top-4 h-30px rounded ring ring-stone-2 dark-ring-stone-8">
      <img src="@/assets/images/login-banner.png" class="banner">
      <KpuCopyright v-if="settingsStore.mode === 'pc' && ['left', 'right'].includes(layout)" class="copyright" />
    </div>
    <div class="login-form flex-col-center">
      <Transition name="fade" mode="out-in">
        <LoginForm
          v-if="formType === 'login'"
          ref="formRef"
          :account
          @on-login="router.push(redirect)"
          @on-register="(val) => { formType = 'register'; account = val }"
          @on-reset-password="(val) => { formType = 'resetPassword'; account = val }"
        />
        <RegisterForm
          v-else-if="formType === 'register'"
          ref="formRef"
          :account
          @on-register="(val) => { formType = 'login'; account = val }"
          @on-login="formType = 'login'"
        />
        <ResetPasswordForm
          v-else-if="formType === 'resetPassword'"
          ref="formRef"
          :account
          @on-reset-password="(val) => { formType = 'login'; account = val }"
          @on-login="formType = 'login'"
        />
      </Transition>
    </div>
  </div>
  <KpuCopyright v-if="settingsStore.mode === 'mobile' || 'center' === layout" class="copyright" />
</template>

<style scoped>
.bg-banner {
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(closest-side, hsl(var(--border) / 10%) 30%, hsl(var(--primary) / 20%) 30%, hsl(var(--border) / 30%) 50%) no-repeat, radial-gradient(closest-side, hsl(var(--border) / 10%) 30%, hsl(var(--primary) / 20%) 30%, hsl(var(--border) / 30%) 50%) no-repeat;
  background-position: 100% 100%, 0% 0%;
  background-size: 200vw 200vh;
  filter: blur(100px);
}

[data-mode="mobile"] {
  .login-box {
    position: relative;
    flex-direction: column;
    justify-content: start;
    width: 100%;

    .login-banner {
      width: 100%;
      padding: 20px 0;

      .banner {
        position: relative;
        top: inherit;
        right: inherit;
        display: inherit;
        width: 100%;
        max-width: 375px;
        margin: 0 auto;
        transform: translateY(0);
      }
    }

    .login-form {
      width: 100%;
    }
  }

  .copyright {
    position: relative;
  }
}

.login-box {
  position: absolute;
  display: flex;
  overflow: hidden;
  background-color: hsl(var(--background));

  [data-mode="pc"] & {
    &.center {
      --uno: shadow-md rounded-md;

      top: 50%;
      left: 50%;
      transform: translate(-50%) translateY(-50%);
    }

    &.left,
    &.right {
      width: 100%;
      height: 100%;

      .login-banner {
        flex: 1;

        .banner {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 50%;
          height: 50%;
          object-fit: contain;
          transform: translate(-50%) translateY(-50%);
        }
      }

      .login-form {
        margin: 0 5vw;
      }
    }

    &.left {
      flex-direction: row-reverse;
    }
  }

  .login-banner {
    --uno: bg-muted dark:bg-muted/30;

    position: relative;
    width: 450px;
    overflow: hidden;

    &::before {
      position: absolute;
      width: 100%;
      height: 100%;
      content: "";
      background:
        radial-gradient(closest-side, hsl(var(--border) / 10%) 30%, hsl(var(--primary) / 20%) 30%, hsl(var(--border) / 30%) 50%) no-repeat,
        radial-gradient(closest-side, hsl(var(--border) / 10%) 30%, hsl(var(--primary) / 20%) 30%, hsl(var(--border) / 30%) 50%) no-repeat;
      background-position: 100% 100%, 0% 0%;
      background-size: 200vw 200vh;
      filter: blur(100px);
    }

    .banner {
      position: absolute;
      top: 50%;
      width: 100%;
      transform: translateY(-50%);
    }
  }

  .login-form {
    width: 500px;
    transition: height 0.15s ease;
  }
}

.copyright {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
