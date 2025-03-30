<script setup lang="ts">
import type { CheckKeys, KeyType, TreeActionType } from '@/components/Tree'
import type { Nullable } from '@/types'
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import CollapseContainer from '@/components/CollapseContainer/src/CollapseContainer.vue'
import { BasicTree } from '@/components/Tree'
import { ResourceTypeEnum } from '@/enums/common/tenant'
import { isArray } from '@/utils'
import { getResourceTagColor } from '@/utils/color'
import { eachTree, findChildrenByParentId, getById } from '@/utils/helper/treeHelper.ts'
import { difference, intersection, uniq } from 'lodash-es'

const props = withDefaults(defineProps<{
  application?: Record<string, any>
  resourceList?: TreeDataItem[]
  checkedKeys?: CheckKeys
}>(), {
  application: () => ({}),
  resourceList: () => ([]),
  checkedKeys: () => ([]),
})
const treeRef = useTemplateRef<Nullable<TreeActionType>>('treeRef')

// 临时数据
const state = reactive({
  indeterminate: false,
  checkAll: false,
  allKeys: [] as string[],
})

function getTree() {
  const tree = unref(treeRef)
  if (!tree) {
    throw new Error('tree is null!')
  }
  return tree
}
watch(() => props.resourceList, () => {
  const keys = [] as string[]

  eachTree(
    props.resourceList,
    (item, parent) => {
      keys.push(item.id)
      item.key = item.id
      item.title = item.name
      item.keyLinks = [...(parent.keyLinks || []), item.id]
      item.slots = { title: 'title' }
      return item
    },
    {},
  )

  state.allKeys = keys
})
onMounted(async () => {
  // await nextTick()
  const keys = [] as string[]

  eachTree(
    props.resourceList,
    (item, parent) => {
      keys.push(item.id)
      item.key = item.id
      item.title = item.name
      item.keyLinks = [...(parent.keyLinks || []), item.id]
      item.slots = { title: 'title' }
      return item
    },
    {},
  )

  state.allKeys = keys
})

function changeHandler(_: any) {
  computedIndeterminate()
  computedCheckAll()
}

// 获取 树当前选中的节点key
function getCheckedKeys(): string[] {
  const checkedKeys = getTree().getCheckedKeys()
  return (isArray(checkedKeys) ? checkedKeys : checkedKeys.checked) as string[]
}

// 计算 半选状态
function computedIndeterminate() {
  const checkedKeys = getCheckedKeys()
  state.indeterminate = checkedKeys.length > 0 && checkedKeys.length < state.allKeys.length
}

// 计算 选中状态
function computedCheckAll() {
  state.checkAll
    = state.allKeys.length > 0 && state.allKeys.length === getCheckedKeys().length
}

/**
 * 全选应用
 * @param e
 */
function onCheckAllChange(e: any) {
  e?.stopPropagation()
  e?.preventDefault()
  getTree()?.checkAll(e.target.checked)

  computedIndeterminate()
}

/**
 * 选中tree的复选框
 * 1. 选中某个节点: 将其所有的父节点都选中
 * 2. 取消某个节点: 将其所有子节点全部取消
 *
 */
function checkNode(_: any, { checked, node }: any) {
  // 当前已经勾选的所有id
  // const checkeds = isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
  if (checked) {
    // 选中

    // 查找当前节点
    const current = getById(node?.eventKey, props.resourceList)
    // 查找当前节点的所有父Id

    // 同时勾选上所有的父节点
    const newKeys = getCheckedKeys().concat(current?.keyLinks)
    getTree().setCheckedKeys(uniq(newKeys))
  }
  else {
    // 取消选中

    // 查找当前节点的所有子节点
    const childrenIds = findChildrenByParentId(node?.eventKey, props.resourceList)
    // 设置新的选中节点为： 当前已经选中节点 - 当前节点的子节点
    const newKeys = difference(getCheckedKeys(), childrenIds)
    getTree().setCheckedKeys(uniq(newKeys))
  }
}

/**
 * 全选或取消全选
 *
 * 全选逻辑：将所有子节点和父节点选中
 *
 * 取消全选逻辑：将所有子节点取消
 *
 * @param id 节点id
 * @param e 事件
 */
function selectAll(id: string, e: any) {
  e?.stopPropagation()
  e?.preventDefault()

  // 查找当前节点的所有子节点id
  const childrenIds = findChildrenByParentId(id, props.resourceList)
  if (containsAll(childrenIds)) {
    // 取消全选

    // 将已经选中的节点 - 当前节点的所有子节点
    const newKeys = difference(getCheckedKeys(), childrenIds)
    getTree().setCheckedKeys(newKeys)
  }
  else {
    // 全选

    const newKeys = getCheckedKeys().concat(childrenIds)

    // 查找当前节点
    const current = getById(id, props.resourceList)
    // 查找当前节点的所有父Id
    const parentAndChildrenIds = newKeys.concat(current?.keyLinks)

    getTree().setCheckedKeys(uniq(parentAndChildrenIds))
  }

  computedCheckAll()
  computedIndeterminate()
}

/**
 * 某个节点是 全选 还是 全部取消
 * @param id
 */
function isAllCheckedByKey(id: string) {
  const childrenIds = findChildrenByParentId(id, props.resourceList)
  return containsAll(childrenIds)
}

/**
 * 指定的 节点id 是否全部被选中
 * @param ids
 */
function containsAll(ids: string[]) {
  if (!ids || !ids.length) {
    return false
  }
  return intersection(getCheckedKeys(), ids).length === ids.length
}
defineExpose({
  ...toRefs(state),
  treeRef,
  application: props.application,
})
</script>

<template>
  <CollapseContainer class="appResource mb-4">
    <template #title>
      <ACheckbox
        v-model:checked="state.checkAll"
        :value="application.id"
        :indeterminate="state.indeterminate"
        @change="onCheckAllChange"
      >
        <ATag color="error">
          应用
        </ATag>
        {{ application.name }}
      </ACheckbox>
    </template>
    <KpuScrollArea :scrollbar="true" :style="{ height: '100%' }">
      <BasicTree
        ref="treeRef"
        :click-row-to-expand="false"
        :tree-data="resourceList"
        :checked-keys="checkedKeys"
        :expanded-keys="checkedKeys as KeyType[]"
        :toolbar-strictly="false"

        checkable toolbar search check-strictly highlight @check="checkNode" @change="changeHandler"
      >
        <template #title="item">
          <KpuIcon v-if="item.icon" :name="item.icon" />
          <template v-if="item.echoMap?.resourceType">
            <ATag :color="getResourceTagColor(item?.resourceType, item.isHidden)">
              {{ item.echoMap?.resourceType }}
            </ATag>
          </template>
          {{ item.name }}
          <span>
            <a
              v-if="item.children && item.children.length"
              style="margin-left: 30px;"
              @click="selectAll(item.id, $event)"
            >
              {{ isAllCheckedByKey(item.id) ? '取消全选' : '全选' }}
            </a>
          </span>
          <template v-if="item.resourceType === ResourceTypeEnum.DATA && item.isDef">
            <ATag style="margin-left: 10px;" color="error">
              默认
            </ATag>
          </template>
          <template v-if="item.resourceType === ResourceTypeEnum.DATA">
            <ATag style="margin-left: 10px;">
              {{ item.sortValue }}
            </ATag>
          </template>
        </template>
      </BasicTree>
    </KpuScrollArea>
  </CollapseContainer>
</template>

<style scoped>
.appResource {
  border: 1px solid #d9d9d9;
}
</style>
