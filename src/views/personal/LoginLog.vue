<script setup lang="ts">
import { anyonePage } from '@/api/basic/system/baseLoginLog'
import { $t } from '@/locales'
import useUserStore from '@/store/modules/user.ts'
import { Card } from 'ant-design-vue'
import { onMounted, ref } from 'vue'

const loginLogList = ref<any[]>([])
const userStore = useUserStore()
onMounted(async () => {
  const list = await anyonePage({
    current: 1,
    size: 10,
    model: { userId: userStore.userInfo.id },
  })
  loginLogList.value = list.records
})
</script>

<template>
  <a-timeline mode="left">
    <a-timeline-item v-for="(item, index) of loginLogList" :key="index">
      <Card :title="`登录时间：${item.createdTime}`">
        <p>
          <KpuIcon name="ant-design:link-outlined" />
          {{ $t('devOperation.system.defLoginLog.requestIp') }}：{{ item.requestIp }}
        </p>
        <p>
          <KpuIcon name="ant-design:environment-outlined" />
          {{ $t('devOperation.system.defLoginLog.location') }}：{{ item.location }}
        </p>
        <p>
          <KpuIcon name="ant-design:chrome-filled" />
          {{ $t('devOperation.system.defLoginLog.browser') }}：{{ item.browser }}
        </p>
        <p>
          <KpuIcon name="ant-design:windows-outlined" />
          {{ $t('devOperation.system.defLoginLog.operatingSystem') }}：{{ item.operatingSystem }}
        </p>
      </Card>
    </a-timeline-item>
  </a-timeline>
</template>

<style scoped>
  .extra {
    float: right;
    margin-top: 10px;
    margin-right: 30px;
  }
</style>
