<script setup lang="ts">
import { findEmployeeRoleByEmployeeId } from '@/api/basic/user/baseEmployee.ts'
import { findOrgRoleByOrgId } from '@/api/basic/user/baseOrg.ts'
import { ScopeTypeEnum } from '@/enums/common/base.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { useFs } from '@fast-crud/fast-crud'
import { createCrudOptions } from './employeeRole.tsx'

const data = reactive<{
  scopeType: ScopeTypeEnum
  employeeId: string
  orgId: string
  bindRoleIds: string[]
}>({
  scopeType: ScopeTypeEnum.EMPLOYEE,
  employeeId: '',
  orgId: '',
  bindRoleIds: [],
})
const { selectedRowKeys, crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: data,
})

const [Modal, modelApi] = useKpuModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const m = await modelApi.getData()
      data.scopeType = m.scopeType
      if (m.scopeType === ScopeTypeEnum.EMPLOYEE) {
        data.employeeId = m.id
        data.bindRoleIds = await findEmployeeRoleByEmployeeId(data.employeeId)
      }
      else {
        data.orgId = m.id
        data.bindRoleIds = await findOrgRoleByOrgId(data.orgId)
      }

      crudExpose.doRefresh()
    }
  },
  onClosed() {
    selectedRowKeys.value = []
  },
  onConfirm() {
    selectedRowKeys.value = []
    modelApi.close()
  },
})
</script>

<template>
  <Modal title="绑定角色" class="h-full w-[70%]" content-class="h-full">
    <FsCrud ref="crudRef" class="p-0" v-bind="crudBinding" />
  </Modal>
</template>
