<script setup lang="ts">
import type {
  ContextMenuItem,
  TreeActionItem,
  TreeActionType,
  TreeItem,
} from '@/components/Tree'
import type { Nullable } from '@/types'
import { query } from '@/api/devOperation/application/defApplication'
import { moveDown, moveUp, remove, tree } from '@/api/devOperation/application/defResource'
import { BasicTree } from '@/components/Tree'
import { ResourceTypeEnum } from '@/enums/common/tenant'
import { PermModeEnum, RoleEnum } from '@/enums/roleEnum'
import { useMessage } from '@/hooks/useMessage'
import { $t } from '@/locales'
import { getResourceTagColor } from '@/utils/color'
import { eachTree, findNodeByKey } from '@/utils/helper/treeHelper'
import {
  DeleteOutlined,
  DownOutlined,
  DragOutlined,
  EditOutlined,
  PlusSquareOutlined,
  UpOutlined,
} from '@ant-design/icons-vue'

const emits = defineEmits<
  {
    select: [ any, any]
    add: [ any, any]
    edit: [ any, any]
    change: [string, string]
  }
>()
const { createMessage, createConfirm } = useMessage()
const { currentRoute } = useRouter()

const treeRef = ref<Nullable<TreeActionType>>(null)
const treeData = ref<TreeItem[]>([])
const treeLoading = ref<boolean>(false)
const data = reactive<Recordable>({
  applicationList: [],
  appDisabled: false,
})
const applicationRef = reactive<Recordable>({ value: '', label: '' })

function getTree() {
  const tree = unref(treeRef)
  if (!tree) {
    throw new Error('树结构加载失败,请刷新页面')
  }
  return tree
}

onMounted(async () => {
  const params = currentRoute.value?.params
  applicationRef.value = params?.id as string
  const applications = await query({ id: params?.id as string })
  data.appDisabled = !!params?.id

  data.applicationList = applications.map(item => ({
    label: item.name,
    value: item.id,
    key: item.id,
  }))
  if (applications && applications.length > 0) {
    applicationRef.value = applications[0]?.id
    applicationRef.label = applications[0]?.name
    await fetch(applicationRef.value)
  }
})

// 加载数据
async function fetch(applicationId?: string) {
  try {
    treeLoading.value = true

    applicationId = applicationId || applicationRef.value
    if (applicationId) {
      treeData.value = (await tree({ applicationId })) as unknown as any[]

      eachTree(
        treeData.value,
        (item, parent) => {
          item.key = item.id
          item.title = item.name
          item.keyLinks = [...(parent.keyLinks || []), item.id]
          item.slots = { titleBefore: 'titleBefore' }
          return item
        },
        {},
      )
      setTimeout(() => {
        // getTree().filterByLevel(2);
        getTree().setCheckedKeys({ checked: [], halfChecked: [] })
      }, 0)
    }
    else {
      createMessage.warn('请先选择应用')
    }
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
    node.applicationId = applicationRef.value
    node.applicationName = applicationRef.label
    emits('select', parent, node)
  }
}

function handleMove(_current = {}) {
  // openModal(true, {
  //   applicationId: applicationRef.value,
  //   current,
  // })
}

// 悬停图标
const actionList: TreeActionItem[] = [
  {
    auth: [RoleEnum.RESOURCE_MOVE, RoleEnum.APPLICATION_RESOURCE_MOVE],
    authMode: PermModeEnum.HasAny,
    // show: (node) => {
    //   return [ResourceTypeEnum.MENU].includes(node.resourceType)
    // },
    render: (node) => {
      return h(UpOutlined, {
        class: 'ml-2',
        title: $t('common.title.move'),
        onClick: async (e: Event) => {
          e?.stopPropagation()
          e?.preventDefault()
          await moveUp(node.id)
          createMessage.success($t('common.tips.saveSuccess'))
          fetch()
        },
      })
    },
  },
  {
    auth: [RoleEnum.RESOURCE_MOVE, RoleEnum.APPLICATION_RESOURCE_MOVE],
    authMode: PermModeEnum.HasAny,
    // show: (node) => {
    //   return [ResourceTypeEnum.MENU].includes(node.resourceType)
    // },
    render: (node) => {
      return h(DownOutlined, {
        class: 'ml-2',
        title: $t('common.title.move'),
        onClick: async (e: Event) => {
          e?.stopPropagation()
          e?.preventDefault()
          await moveDown(node.id)
          createMessage.success($t('common.tips.saveSuccess'))
          fetch()
        },
      })
    },
  },
  {
    auth: [RoleEnum.RESOURCE_MOVE, RoleEnum.APPLICATION_RESOURCE_MOVE],
    authMode: PermModeEnum.HasAny,
    show: (node) => {
      return [ResourceTypeEnum.MENU].includes(node.resourceType)
    },
    render: (node) => {
      return h(DragOutlined, {
        class: 'ml-2',
        title: $t('common.title.move'),
        onClick: (e: Event) => {
          e?.stopPropagation()
          e?.preventDefault()
          handleMove(findNodeByKey(node.id, treeData.value))
        },
      })
    },
  },
  {
    auth: [RoleEnum.RESOURCE_ADD, RoleEnum.APPLICATION_RESOURCE_ADD],
    authMode: PermModeEnum.HasAny,
    show: (node) => {
      return [ResourceTypeEnum.MENU].includes(node.resourceType)
    },
    render: (node) => {
      return h(PlusSquareOutlined, {
        class: 'ml-2',
        title: $t('common.title.add'),
        onClick: (e: Event) => {
          e?.stopPropagation()
          e?.preventDefault()
          emits('add', findNodeByKey(node.id, treeData.value), {
            applicationId: applicationRef.value,
            applicationName: applicationRef.label,
          })
        },
      })
    },
  },
  {
    auth: [RoleEnum.RESOURCE_EDIT, RoleEnum.APPLICATION_RESOURCE_EDIT],
    authMode: PermModeEnum.HasAny,
    render: (node) => {
      return h(EditOutlined, {
        class: 'ml-2',
        title: $t('common.title.edit'),
        onClick: (e: Event) => {
          e?.stopPropagation()
          e?.preventDefault()
          const current = findNodeByKey(node?.id, treeData.value)
          const parent = findNodeByKey(node?.parentId, treeData.value)
          current.applicationName = applicationRef.label
          emits('edit', parent, current)
        },
      })
    },
  },
  {
    auth: [RoleEnum.RESOURCE_DELETE, RoleEnum.APPLICATION_RESOURCE_DELETE],
    authMode: PermModeEnum.HasAny,
    render: (node) => {
      return h(DeleteOutlined, {
        class: 'ml-2',
        title: $t('common.title.delete'),
        style: { color: '#ED6F6F' },
        onClick: (e: Event) => {
          e?.stopPropagation()
          e?.preventDefault()
          batchDelete([node.id])
        },
      })
    },
  },
]

// 右键菜单
function getRightMenuList(node: any): ContextMenuItem[] {
  return [
    {
      auth: [RoleEnum.RESOURCE_ADD, RoleEnum.APPLICATION_RESOURCE_ADD],
      authMode: PermModeEnum.HasAny,
      label: $t('common.title.addChildren'),
      handler: () => {
        emits('add', findNodeByKey(unref(node).id, treeData.value), {
          applicationId: applicationRef.value,
          applicationName: applicationRef.label,
        })
      },
      icon: 'ant-design:plus-square-outlined',
    },
    {
      auth: [RoleEnum.RESOURCE_MOVE, RoleEnum.APPLICATION_RESOURCE_MOVE],
      authMode: PermModeEnum.HasAny,
      label: $t('common.title.move'),
      handler: () => {
        handleMove(findNodeByKey(unref(node).id, treeData.value))
      },
      icon: 'ant-design:drag-outlined',
    },
    {
      label: $t('common.title.edit'),
      auth: [RoleEnum.RESOURCE_EDIT, RoleEnum.APPLICATION_RESOURCE_EDIT],
      handler: () => {
        const current = findNodeByKey(unref(node)?.id, treeData.value)
        const parent = findNodeByKey(unref(node)?.parentId, treeData.value)
        current.applicationName = applicationRef.label
        emits('edit', parent, current)
      },
      icon: 'ant-design:edit-outlined',
    },
    {
      label: $t('common.title.delete'),
      handler: () => {
        batchDelete([unref(node).id])
      },
      icon: 'ant-design:delete-outlined',
      auth: [RoleEnum.RESOURCE_DELETE, RoleEnum.APPLICATION_RESOURCE_DELETE],
      authMode: PermModeEnum.HasAny,
    },
  ]
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
  emits('add', findNodeByKey('0', treeData.value), {
    applicationId: applicationRef.value,
    applicationName: applicationRef.label,
  })
}

// 点击树外面的 批量删除
function handleBatchDelete() {
  const { checked } = getTree().getCheckedKeys() as {
    checked: string[]
    halfChecked: string[]
  }
  if (!checked || checked.length <= 0) {
    createMessage.warn($t('common.tips.pleaseSelectTheData'))
    return
  }
  batchDelete(checked)
}

async function handleChange({ value, label }: { value: string, label: string }) {
  applicationRef.label = label
  applicationRef.value = value
  await fetch(value)
  emits('change', value, label)
}
defineExpose({
  fetch,
  // getRightMenuList,
})
</script>

<template>
  <div class="mr-2 h-full overflow-hidden">
    <div class="">
      <ASelect
        v-model:value="applicationRef"
        :disabled="data.appDisabled"
        :options="data.applicationList"
        label-in-value
        placeholder="选择应用"
        show-search
        style="width: 100%; margin-bottom: 1rem;"
        @change="handleChange"
      />
      <AButton
        class="mr-2"
        pre-icon="i-ant-design:plus-outlined"
        @click="handleAdd()"
      >
        {{ $t('common.title.addRoot') }}
      </AButton>
      <AButton
        class="mr-2"
        pre-icon="i-ant-design:delete-outlined"
        @click="handleBatchDelete()"
      >
        {{ $t('common.title.delete') }}
      </AButton>
    </div>
    <BasicTree
      ref="treeRef"
      :action-list="actionList"
      :before-right-click="getRightMenuList"
      :click-row-to-expand="false"
      :loading="treeLoading"
      :title="$t('devOperation.application.defResource.table.title')"
      :tree-data="treeData"
      class="h-[calc(100%-80px)]"
      tree-wrapper-class-name="!h-[calc(100%-38px)]"
      checkable search toolbar check-strictly highlight
      @select="handleSelect"
    >
      <template #titleBefore="item">
        <template v-if="item.echoMap?.resourceType">
          <ATag
            :color="getResourceTagColor(item?.resourceType, item.isHidden)"
            :title="item.treePath"
          >
            {{ item.echoMap?.resourceType }} - {{ item.sortValue }}
          </ATag>
        </template>
      </template>
    </BasicTree>
  </div>
</template>
