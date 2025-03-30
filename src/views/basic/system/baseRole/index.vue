<script setup lang="ts">
import { Api } from '@/api/basic/system/baseRole.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { useFs } from '@fast-crud/fast-crud'
import { onMounted } from 'vue'
import ApplicationTrees from './ApplicationTrees.vue'
import { createCrudOptions, frontRules } from './data/crud.tsx'
import RoleEmployee from './roleEmployee.vue'

const treeRef = useTemplateRef<any>('treeRef')

function getTreeRef() {
  return unref(treeRef)
}
const [RoleEmployeeModal, modelApi] = useKpuModal({
  connectedComponent: RoleEmployee,
})
const loading = ref(false)
function getModelApi() {
  return modelApi
}
async function select(row: any) {
  try {
    // m()
    loading.value = true
    await getTreeRef().load(row)
  }
  finally {
    // h()
    loading.value = false
  }
}
const { crudRef, crudBinding, crudExpose, appendCrudOptions } = useFs({
  createCrudOptions,
  context: {
    select,
    modelApi: getModelApi,
  },
})

// 页面打开后获取列表数据
onMounted(async () => {
  const addFormOptions = await getValidateRulesByKpu({
    Api: Api.Save,
    mode: ActionEnum.ADD,
    customRules: frontRules.addForm.rules,
    trigger: 'change',
  })
  const editFormOptions = await getValidateRulesByKpu({
    Api: Api.Update,
    mode: ActionEnum.EDIT,
    customRules: frontRules.editForm.rules,
    trigger: 'change',
  })
  appendCrudOptions({ ...addFormOptions, ...editFormOptions })
  crudExpose.doRefresh()
})
// RoleCategoryEnum
</script>

<template>
  <div>
    <KpuLayoutContainer left-side-width="550px">
      <template #leftSide>
        <FsCrud ref="crudRef" class="p-0" v-bind="crudBinding" />
        <RoleEmployeeModal />
      </template>
      <ASpin :spinning="loading">
        <ApplicationTrees ref="treeRef" />
      </ASpin>
      <!--      <ApplicationDataScopeTabs -->
      <!--        ref="applicationDataScopeRef" -->
      <!--        class="md:w-2/3" -->
      <!--      /> -->
      <!--      <ApplicationResourceTabs -->
      <!--        v-show=" -->
      <!--          roleCategory === RoleCategoryEnum.FUNCTION || roleCategory === RoleCategoryEnum.DESKTOP -->
      <!--        " -->
      <!--        ref="applicationResourceRef" -->
      <!--        class="md:w-2/3" -->
      <!--      /> -->
    </KpuLayoutContainer>
  </div>
</template>
