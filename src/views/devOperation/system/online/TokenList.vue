<script lang="ts" setup>
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { useFs } from '@fast-crud/fast-crud'
import { createCrudOptions } from './data/tokenList'

defineOptions({
  name: 'Token列表',
  inheritAttrs: false,
})

const sessionId = ref<string>('')
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: {
    sessionId,
  },
})
const [Modal, modalApi] = useKpuModal({
  onOpenChange(open) {
    if (open) {
      sessionId.value = modalApi?.getData().sessionId
      crudExpose.doRefresh()
    }
  },
})
defineExpose({
  ...modalApi,
})
</script>

<template>
  <Modal title="Token详情" class="h-[70%] w-[70%]">
    <FsPage class="p-6">
      <FsCrud ref="crudRef" v-bind="crudBinding" />
    </FsPage>
  </Modal>
</template>
