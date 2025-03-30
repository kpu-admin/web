<script setup lang="ts">
import { Api } from '@/api/basic/user/baseEmployee.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
// import RoleEmployee from './roleEmployee.vue'
import BaseOrgTree from '@/views/basic/user/baseOrg/modules/Tree.vue'
import { useFs } from '@fast-crud/fast-crud'
import { onMounted } from 'vue'
import { createCrudOptions, frontRules } from './data/crud.tsx'
import EmployeeRole from './modules/employee-role.vue'
import InvitationUser from './modules/invitation-user.vue'
import ResetPassword from './modules/reset-password.vue'

const treeRef = useTemplateRef<any>('treeRef')
const orgIdList = ref([])
// function getTreeRef() {
//   return unref(treeRef)
// }
const [EmployeeRoleModal, bindRoleModelApi] = useKpuModal({
  connectedComponent: EmployeeRole,
})
const [InvitationUserModal, invitationUserModelApi] = useKpuModal({
  connectedComponent: InvitationUser,
})
const [ResetPasswordModal, resetPasswordModelApi] = useKpuModal({
  connectedComponent: ResetPassword,
})

function getBindRoleModelApi() {
  return bindRoleModelApi
}
function getInvitationUserModelApi() {
  return invitationUserModelApi
}
function getResetPasswordModelApi() {
  return resetPasswordModelApi
}
const { crudRef, crudBinding, crudExpose, appendCrudOptions } = useFs({
  createCrudOptions,
  context: {
    orgIdList,
    bindRoleModelApi: getBindRoleModelApi,
    invitationUserModelApi: getInvitationUserModelApi,
    resetPasswordModelApi: getResetPasswordModelApi,
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
      <EmployeeRoleModal />
      <InvitationUserModal />
      <ResetPasswordModal />
      <!--      <ASpin :spinning="loading"> -->
      <!--        <ApplicationTrees -->
      <!--          ref="treeRef" -->
      <!--          query -->
      <!--          @select="handleTreeSelect" -->
      <!--          @reset="handleTreeAdd" -->
      <!--        /> -->
      <!--      </ASpin> -->
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
