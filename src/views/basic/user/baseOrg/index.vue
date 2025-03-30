<script setup lang="ts">
import { ResourceTypeEnum } from '@/enums/common/tenant'
import { ActionEnum } from '@/enums/commonEnum'
import { useMessage } from '@/hooks/useMessage'
import Edit from './modules/Edit.vue'
import BaseOrgTree from './modules/Tree.vue'

const { createMessage } = useMessage()

const treeType = ref<string>('2')
const treeRef = useTemplateRef<any>('treeRef')
const editRef = useTemplateRef<any>('editRef')
// 获取编辑表单
function getEditRef() {
  return unref(editRef)
}
// 获取树
function getTreeRef() {
  return unref(treeRef)
}

// 编辑成功回调
function handleEditSuccess() {
  getTreeRef().fetch()
}

// 选中树的节点
function handleTreeSelect(parent = {}, record = {}) {
  getEditRef().setData({ type: ActionEnum.VIEW, parent, record })
}

// 编辑
function handleTreeEdit(parent = {}, record = {}) {
  getEditRef().setData({ type: ActionEnum.EDIT, parent, record })
}

// 点击树的新增按钮
function handleTreeAdd(parent = {} as { resourceType: string }, record = {}) {
  if (parent?.resourceType === ResourceTypeEnum.FIELD) {
    createMessage.warn('字段下不能添加子资源')
    getEditRef().resetForm(record)
  }
  else {
    getEditRef().setData({ type: ActionEnum.ADD, parent, record })
  }
}
function changeDisplay(type: string) {
  treeType.value = type
}
</script>

<template>
  <div>
    <KpuLayoutContainer left-side-width="500px">
      <template #leftSide>
        <BaseOrgTree
          ref="treeRef"
          @select="handleTreeSelect"
          @add="handleTreeAdd"
          @edit="handleTreeEdit"
          @change="changeDisplay"
        />
      </template>
      <Edit ref="editRef" @success="handleEditSuccess" />
    </KpuLayoutContainer>
  </div>
</template>
