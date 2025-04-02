<script setup lang="ts">
import { useMessage } from '@/hooks/useMessage.tsx'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { List } from 'ant-design-vue'
import SecureEmail from './modules/secure-email.vue'
import SecureMobile from './modules/secure-mobile.vue'
import SecurePassword from './modules/secure-pwd.vue'

const { createMessage } = useMessage()
const [SecurePasswordModal, securePasswordModelApi] = useKpuModal({
  connectedComponent: SecurePassword,
})
const [SecureEmailModal, secureEmaiModelApi] = useKpuModal({
  connectedComponent: SecureEmail,
})
const [SecureMobileModal, secureMobileModelApi] = useKpuModal({
  connectedComponent: SecureMobile,
})
function handleExtra(key: string) {
  if (key === '1') {
    securePasswordModelApi.open()
  }
  else if (key === '2') {
    secureMobileModelApi.open()
  }
  else if (key === '3') {
    secureEmaiModelApi.open()
  }
  else {
    createMessage.warn('敬请期待~')
  }
}
</script>

<template>
  <List>
    <List.Item>
      <List.Item.Meta>
        <template #title>
          密码
          <div class="extra" @click="handleExtra('1')">
            修改
          </div>
        </template>
        <template #description>
          <div> 登录系统时需要的密码</div>
          <SecurePasswordModal />
        </template>
      </List.Item.Meta>
    </List.Item>
    <List.Item>
      <List.Item.Meta>
        <template #title>
          手机号
          <div class="extra" @click="handleExtra('2')">
            修改
          </div>
        </template>
        <template #description>
          <div> 登录系统的手机号</div>
          <SecureMobileModal />
        </template>
      </List.Item.Meta>
    </List.Item>
    <List.Item>
      <List.Item.Meta>
        <template #title>
          邮箱
          <div class="extra" @click="handleExtra('3')">
            修改
          </div>
        </template>
        <template #description>
          <div> 登录系统的邮箱</div>
          <SecureEmailModal />
        </template>
      </List.Item.Meta>
    </List.Item>
  </List>
</template>

<style scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
</style>
