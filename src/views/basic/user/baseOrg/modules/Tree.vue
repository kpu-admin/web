<script setup lang="ts">
import type {
  ContextMenuItem,
  TreeActionItem,
  TreeActionType,
  TreeItem,
} from '@/components/Tree'
import type { Nullable } from '@/types'
import { remove, tree } from '@/api/basic/user/baseOrg.ts'
import { BasicTree } from '@/components/Tree'
import { OrgTypeEnum } from '@/enums/common/base.ts'
import { useMessage } from '@/hooks/useMessage'
import { $t } from '@/locales'

import { eachTree, findChildrenByParentId, findNodeByKey } from '@/utils/helper/treeHelper'
import { onMounted } from 'vue'

const props = withDefaults(defineProps<{ query?: boolean }>(), {
  query: false,
})
const emits = defineEmits<
  {
    select: [ any, any, any]
    add: [ any]
    edit: [ any, any]
    change: [string]
    reset: []
  }
>()
const { createMessage, createConfirm } = useMessage()

const recursion = ref<boolean>(false)
const treeRef = ref<Nullable<TreeActionType>>(null)
const treeData = ref<TreeItem[]>([])
const treeLoading = ref<boolean>(false)

function getTree() {
  const tree = unref(treeRef)
  if (!tree) {
    throw new Error('树结构加载失败,请刷新页面')
  }
  return tree
}

onMounted(() => {
  fetch()
})

// 加载数据
async function fetch() {
  treeLoading.value = true
  try {
    treeData.value = (await tree({})) as unknown as TreeItem[]
    eachTree(treeData.value, (item) => {
      item.key = item.id
      item.title = item.name
      item.slots = { titleBefore: 'titleBefore' }
      return item
    })
    setTimeout(() => {
      getTree().filterByLevel(2)
    }, 0)
  }
  finally {
    treeLoading.value = false
  }
}

// 选择节点
function handleSelect(keys: string[]) {
  if (keys[0]) {
    const node = findNodeByKey(keys[0], treeData.value)
    const parent = findNodeByKey(node?.parentId, treeData.value)
    let childrenIds: string[] = []
    if (recursion.value) {
      childrenIds = findChildrenByParentId(keys[0], treeData.value)
    }
    else {
      childrenIds = [node.id]
    }
    emits('select', parent, node, childrenIds)
  }
}

// 悬停图标
let actionList: TreeActionItem[] = []

// 右键菜单
let getRightMenuList = (_: any): ContextMenuItem[] => {
  return []
}
if (!props.query) {
  // 悬停图标
  actionList = [
    {
      // auth: RoleEnum.ORG_ADD,
      render: (node) => {
        return h(
          'a',
          {
            class: 'ml-2',
            onClick: (e: Event) => {
              e?.stopPropagation()
              e?.preventDefault()
              emits('add', findNodeByKey(node.id, treeData.value))
            },
          },
          $t('common.title.add'),
        )
      },
    },
    {
      // auth: RoleEnum.ORG_EDIT,
      render: (node) => {
        return h(
          'a',
          {
            class: 'ml-2',
            onClick: (e: Event) => {
              e?.stopPropagation()
              e?.preventDefault()
              const current = findNodeByKey(node?.id, treeData.value)
              const parent = findNodeByKey(node?.parentId, treeData.value)
              emits('edit', parent, current)
            },
          },
          $t('common.title.edit'),
        )
      },
    },
    // {
    //   // auth: RoleEnum.ORG_BIND_ROLE,
    //   render: (node) => {
    //     return h(
    //       'a',
    //       {
    //         class: 'ml-2',
    //         onClick: (e: Event) => {
    //           e?.stopPropagation()
    //           e?.preventDefault()
    //           // const current = findNodeByKey(node?.id, treeData.value)
    //           // openModal(true, current)
    //         },
    //       },
    //       '绑定',
    //     )
    //   },
    // },
    {
      // auth: RoleEnum.ORG_DELETE,
      render: (node) => {
        return h(
          'a',
          {
            class: 'ml-2',
            onClick: (e: Event) => {
              e?.stopPropagation()
              e?.preventDefault()
              batchDelete([node.id])
            },
          },
          $t('common.title.delete'),
        )
      },
    },
  ]

  // 右键菜单
  getRightMenuList = (node: any): ContextMenuItem[] => {
    return [
      {
        label: $t('common.title.addChildren'),
        // auth: [RoleEnum.ORG_ADD],
        handler: () => {
          emits('add', findNodeByKey(unref(node).id, treeData.value))
        },
        icon: 'ant-design:plus-outlined',
      },
      {
        label: $t('common.title.edit'),
        // auth: [RoleEnum.ORG_EDIT],
        handler: () => {
          const current = findNodeByKey(unref(node)?.id, treeData.value)
          const parent = findNodeByKey(unref(node)?.parentId, treeData.value)
          emits('edit', parent, current)
        },
        icon: 'ant-design:edit-outlined',
      },
      {
        label: $t('common.title.delete'),
        // auth: [RoleEnum.ORG_DELETE],
        handler: () => {
          batchDelete([unref(node).id])
        },
        icon: 'ant-design:delete-outlined',
      },
    ]
  }
}
// 执行批量删除
async function batchDelete(ids: string[]) {
  createConfirm({
    iconType: 'warning',
    content: '选中节点及其子结点将被永久删除, 是否确定删除？',
    onOk: async () => {
      try {
        await remove(ids)
        createMessage.success($t('common.tips.deleteSuccess'))
        fetch()
      }
      catch {}
    },
  })
}

// 点击树外面的 新增
function handleAdd() {
  emits('add', findNodeByKey('0', treeData.value))
}

// 点击树外面的 批量删除
function handleBatchDelete() {
  const { checked } = getTree().getCheckedKeys() as {
    checked: string[]
    halfChecked: string[]
  }
  if (!checked || checked.length <= 0) {
    createMessage.warning($t('common.tips.pleaseSelectTheData'))
    return
  }
  batchDelete(checked)
}

// 切换显示方式
function changeDisplay() {
  emits('change', '2')
}

// 重置
function handleReset() {
  getTree().setSelectedKeys([])
  emits('reset')
}

// 选择 本级及子级
function handleQuery() {
  handleSelect(getTree().getSelectedKeys() as string[])
}

defineExpose({
  fetch,
})
</script>

<template>
  <div class="mr-2 h-full overflow-hidden">
    <div v-if="query" class="mb-1">
      <a-button class="mr-2" type="primary" @click="handleReset()">
        重置
      </a-button>
      <ACheckbox v-model:checked="recursion" @change="handleQuery()">
        本级及子级
      </ACheckbox>
    </div>
    <div v-else class="m-4">
      <a-button
        class="mr-2"
        type="primary"
        @click="changeDisplay()"
      >
        切换
      </a-button>
      <a-button
        class="mr-2"
        pre-icon="ant-design:plus-outlined"
        @click="handleAdd()"
      >
        {{ $t('common.title.addRoot') }}
      </a-button>
      <a-button
        class="mr-2"
        pre-icon="ant-design:delete-outlined"
        @click="handleBatchDelete()"
      >
        {{ $t('common.title.delete') }}
      </a-button>
      <a-button
        class="mr-2"
        pre-icon="ant-design:delete-outlined"
        @click="fetch()"
      >
        {{ $t('common.refresh') }}
      </a-button>
    </div>
    <BasicTree
      ref="treeRef"
      :action-list="actionList"
      :file-names="{ key: 'id', title: 'name' }"
      :before-right-click="getRightMenuList"
      :click-row-to-expand="false"
      :loading="treeLoading"
      :title="$t('basic.user.baseOrg.table.title')"
      :tree-data="treeData"
      class="h-[calc(100%-80px)]"
      tree-wrapper-class-name="!h-[calc(100%-38px)]"
      checkable search toolbar check-strictly highlight
      @select="handleSelect"
    >
      <template #titleBefore="item">
        <template v-if="item.echoMap?.type">
          <ATag
            :color="item.type === OrgTypeEnum.COMPANY ? 'error' : 'processing'"
            :title="item.treePath"
          >
            {{ item.echoMap?.type }}
          </ATag>
        </template>
      </template>
    </BasicTree>
  </div>
</template>
