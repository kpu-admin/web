<script setup lang="ts">
import { Api } from '@/api/basic/user/basePosition.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
// import RoleEmployee from './roleEmployee.vue'
import BaseOrgTree from '@/views/basic/user/baseOrg/modules/Tree.vue'
import { useFs } from '@fast-crud/fast-crud'
import { onMounted } from 'vue'
import { createCrudOptions, frontRules } from './data/crud.tsx'

const treeRef = useTemplateRef<any>('treeRef')
const orgIdList = ref([])
// function getTreeRef() {
//   return unref(treeRef)
// }
// const [RoleEmployeeModal, modelApi] = useKpuModal({
//   connectedComponent: RoleEmployee,
// })

const { crudRef, crudBinding, crudExpose, appendCrudOptions } = useFs({
  createCrudOptions,
  context: {
    orgIdList,
  },
})

// 重置密码
function handleReset() {
  orgIdList.value = []

  crudExpose.doSearch({
    form: {},
  })
}

function handleOrgSelect(_parent = {}, _record = { id: '' }, childrenIds = []) {
  orgIdList.value = childrenIds
  crudExpose.doRefresh()
}

// 页面打开后获取列表数据
onMounted(async () => {
  const addFormOptions = await getValidateRulesByKpu({
    Api: Api.Save,
    mode: ActionEnum.ADD,
    customRules: frontRules(crudExpose, ActionEnum.ADD),
    trigger: 'change',
  })
  const editFormOptions = await getValidateRulesByKpu({
    Api: Api.Update,
    mode: ActionEnum.EDIT,
    customRules: frontRules(crudExpose, ActionEnum.EDIT),
    trigger: 'change',
  })
  appendCrudOptions({ ...addFormOptions, ...editFormOptions })
  crudExpose.doRefresh()
})
// RoleCategoryEnum
</script>

<template>
  <div>
    <KpuLayoutContainer left-side-width="350px">
      <template #leftSide>
        <BaseOrgTree
          ref="treeRef"
          query
          @reset="handleReset"
          @select="handleOrgSelect"
        />
      </template>
      <FsCrud ref="crudRef" v-bind="crudBinding" />
    </KpuLayoutContainer>
  </div>
</template>
