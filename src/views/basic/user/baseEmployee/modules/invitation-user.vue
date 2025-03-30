<script setup lang="ts">
import { invitationUser } from '@/api/basic/user/baseEmployee.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { useFs } from '@fast-crud/fast-crud'
import { createCrudOptions } from './invitationUser.tsx'

const emits = defineEmits<{
  success: []
}>()
const data = reactive<{
  selectedRowKeys: string[]
}>({
  selectedRowKeys: [],
})
const { createMessage } = useMessage()
const { crudRef, crudBinding } = useFs({
  createCrudOptions,
  context: data,
})

const [Modal, modelApi] = useKpuModal({
  onConfirm,
})
async function onConfirm() {
  if (!data.selectedRowKeys) {
    createMessage.warning('请选择待邀请用户')
    return
  }
  try {
    modelApi.setState({
      loading: !0,
      confirmLoading: !0,
    })
    const form = {
      userIdList: data.selectedRowKeys,
      isBind: !0,
    }
    await invitationUser(form)
    createMessage.success('邀请成功')
    modelApi.close()
    emits('success')
  }
  finally {
    modelApi.setState({
      loading: !1,
      confirmLoading: !1,
    })
  }
}
</script>

<template>
  <Modal title="邀请用户" class="h-full w-[70%]" content-class="h-full">
    <FsCrud ref="crudRef" class="p-0" v-bind="crudBinding" />
  </Modal>
</template>
