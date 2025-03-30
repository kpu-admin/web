<script setup lang="ts">
import { findEmployeeIdByRoleId } from '@/api/basic/system/baseRole.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { useFs } from '@fast-crud/fast-crud'
import { createCrudOptions } from './data/roleEmployee.tsx'

const data = reactive<{
  roleId: string
  bindEmployeeIds: string[]
}>({
  roleId: '',
  bindEmployeeIds: [],
})
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: data,
})

const [Modal, modelApi] = useKpuModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      data.roleId = modelApi.getData().id
      data.bindEmployeeIds = await findEmployeeIdByRoleId(data.roleId)
      crudExpose.setSearchFormData({
        form: {
          roleId: data.roleId,
        },
      })
      crudExpose.doRefresh()
    }
  },
})
</script>

<template>
  <Modal title="绑定员工" class="h-full w-[70%]" content-class="h-full">
    <FsCrud ref="crudRef" class="p-0" v-bind="crudBinding" />
  </Modal>
</template>
