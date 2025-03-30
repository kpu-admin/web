<script lang="ts" setup>
import type { DropMenu } from '@/components/Dropdown/typing.ts'
import {
  clear,
} from '@/api/devOperation/system/defLoginLog.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { useFs } from '@fast-crud/fast-crud'
import { onMounted } from 'vue'
import { clearList, createCrudOptions } from './data/crud'

defineOptions({
  name: '全局登录日志',
  inheritAttrs: false,
})

const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions })

// 页面打开后获取列表数据
onMounted(async () => {
  crudExpose.doRefresh()
})
const { createConfirm } = useMessage()
function handleClearEvent(menu: DropMenu) {
  createConfirm({
    iconType: 'warning',
    content: '确认要清理数据吗？',
    onOk: async () => {
      await clear(menu.event)
      crudExpose.doRefresh()
    },
  })
}
</script>

<template>
  <FsPage>
    <FsCrud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <Dropdown
          :drop-menu-list="clearList"
          :trigger="['click']"
          overlay-class-name="app-locale-picker-overlay"
          placement="bottom"
          @menu-event="handleClearEvent"
        >
          <AButton type="primary">
            清理日志
          </AButton>
        </Dropdown>
      </template>
    </FsCrud>
  </FsPage>
</template>
