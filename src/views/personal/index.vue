<script setup lang="ts">
import { TabPane, Tabs } from 'ant-design-vue'
import BaseSetting from './BaseSetting.vue'
import LoginLog from './LoginLog.vue'
import SecureSetting from './SecureSetting.vue'

const tabBarStyle = ref({
  width: '220px',
})
const settingList = ref([
  {
    key: '1',
    name: '基本设置',
    component: BaseSetting,
  },
  {
    key: '2',
    name: '安全设置',
    component: SecureSetting,
  },
  {
    key: '3',
    name: '登录日志',
    component: LoginLog,
  },
])
</script>

<template>
  <div class="absolute h-full w-full">
    <KpuScrollArea :scrollbar="true" :style="{ height: '100%' }">
      <KpuPageMain>
        <!--    -->
        <Tabs tab-position="left" :tab-bar-style="tabBarStyle">
          <template v-for="item in settingList" :key="item.key">
            <TabPane :tab="item.name">
              <component :is="item.component" />
            </TabPane>
          </template>
        </Tabs>
      </KpuPageMain>
    </KpuScrollArea>
  </div>
</template>
