<script setup lang="ts">
import { ResourceTypeEnum } from '@/enums/common/tenant'
import { ActionEnum } from '@/enums/commonEnum'
import { useMessage } from '@/hooks/useMessage'
import DefResourceEdit from './Edit.vue'
import DefResourceTree from './Tree.vue'

const { createMessage } = useMessage()

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
function handleEditSuccess(applicationId: string) {
  getTreeRef().fetch(applicationId)
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
function handlerApplicationChange(applicationId: string, applicationName: string) {
  getEditRef().resetForm({ applicationId, applicationName })
}
</script>

<template>
  <div>
    <KpuLayoutContainer left-side-width="500px">
      <template #leftSide>
        <DefResourceTree
          ref="treeRef"
          @select="handleTreeSelect"
          @add="handleTreeAdd"
          @edit="handleTreeEdit"
          @change="handlerApplicationChange"
        />
      </template>
      <DefResourceEdit ref="editRef" @success="handleEditSuccess" />
    </KpuLayoutContainer>
  </div>
</template>
