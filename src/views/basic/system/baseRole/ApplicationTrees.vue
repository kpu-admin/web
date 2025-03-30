<script setup lang="ts">
import { findResourceDataScopeIdByRoleId, findResourceIdByRoleId, saveRoleResource } from '@/api/basic/system/baseRole.ts'
import {
  findAvailableApplicationDataScopeList,
  findAvailableApplicationResourceList,
} from '@/api/devOperation/application/defApplication.ts'
import { DataTypeEnum, RoleCategoryEnum } from '@/enums/common/base.ts'
import { useMessage } from '@/hooks/useMessage'
import { $t } from '@/locales'
import { isArray } from '@/utils'
import ApplicationTree from './ApplicationTree.vue'

const formData = reactive<{
  roleId: string
  applicationResourceMap: Record<string, any>
}>({
  roleId: '',
  applicationResourceMap: [],
})
const state = reactive<
  {
    applicationResourceList: any[]
    category: RoleCategoryEnum
    title: string
    confirmLoading: boolean
    appResMap: Record<string, any>
    showSaveBtn: boolean
    defaultExpandedNames: string[]
  }
>({
  applicationResourceList: [],
  category: RoleCategoryEnum.FUNCTION,
  title: '请选择角色',
  confirmLoading: !1,
  appResMap: {},
  showSaveBtn: !1,
  defaultExpandedNames: [],
})
const { createMessage } = useMessage()
const itemRefs: Record<string, any> = {}
function getData() {
  const appResourceMap: Record<string, any> = {}
  for (const row of state.applicationResourceList) {
    const itemRef = itemRefs[row.defApplication.id]
    if (!itemRef) {
      continue
    }
    const checkedKeys = itemRef.treeRef.getCheckedKeys()
    const checkeds = isArray(checkedKeys) ? checkedKeys : checkedKeys.checked
    if (itemRef.checkAll || itemRef.indeterminate) {
      appResourceMap[itemRef.application.id] = checkeds
    }
    else {
      appResourceMap[itemRef.application.id] = []
    }
    // s.state.checkAll || s.state.indeterminate ? a[t.defApplication.id] = r : a[t.defApplication.id] = []
  }
  formData.applicationResourceMap = appResourceMap
  return formData
}
async function load(row: any) {
  if (row && row.id) {
    state.category = row.category
    if (state.category === RoleCategoryEnum.DATA_SCOPE) {
      state.applicationResourceList = await findAvailableApplicationDataScopeList()
    }
    else {
      state.applicationResourceList = await findAvailableApplicationResourceList()
    }
    state.defaultExpandedNames = state.applicationResourceList.map((row: any) => row.defApplication.id)
    state.showSaveBtn = DataTypeEnum.SYSTEM !== row.type
    if (formData.roleId !== row?.id) {
      formData.roleId = row.id
      if (state.category === RoleCategoryEnum.DATA_SCOPE) {
        state.title = `【${row.name}】拥有的数据权限`
        state.appResMap = await findResourceDataScopeIdByRoleId(row.id)
      }
      else {
        state.title = `【${row.name}】拥有的应用资源`
        state.appResMap = await findResourceIdByRoleId(row.id)
      }
    }
  }
  else {
    state.title = '请选择角色'
    formData.roleId = ''
    state.showSaveBtn = !1
    const appResMap: Record<string, any> = {}
    for (const row of state.applicationResourceList) {
      appResMap[row.defApplication.id] = []
    }
    state.appResMap = appResMap
  }
}

async function handleSubmit() {
  try {
    state.confirmLoading = true
    const params = getData()
    if (state.showSaveBtn) {
      await saveRoleResource(params)

      createMessage.success('配置成功')
    }
    else {
      createMessage.warn('请选择角色')
    }
  }
  finally {
    state.confirmLoading = false
  }
}
defineExpose({
  load,
})
</script>

<template>
  <ACard :title="state.title">
    <template #extra>
      <a-button
        v-if="state.showSaveBtn"
        class="!ml-4"
        type="primary"
        :loading="state.confirmLoading"
        @click="handleSubmit"
      >
        {{ $t('common.saveText') }}
      </a-button>
      <span v-else-if="!formData.roleId">请选择角色</span>
      <span v-else>系统角色拥有全部权限</span>
    </template>

    <ApplicationTree
      v-for="item in state.applicationResourceList"
      :key="item.defApplication.id"
      :ref="(el) => (itemRefs[item.defApplication.id] = el)"
      :application="item.defApplication"
      :resource-list="item.resourceList"
      :checked-keys="state.appResMap[item.defApplication.id]"
    />
    <AEmpty v-if="state.applicationResourceList.length === 0" />
  </ACard>
</template>
