<script lang="tsx" setup>
// import type { CreateContextOptions } from '/@/components/ContextMenu'
import type { SetupContext } from 'vue'

import type {
  CheckKeys,
  FieldNames,
  KeyType,
  TreeActionType,
  TreeItem,
  treeProps,
  TreeState,
} from './types/tree'
import { cn, isArray, isBoolean, isEmpty, isFunction } from '@/utils'
import { useNamespace } from '@/utils/classNames'
import { eachTree, filter, treeToList } from '@/utils/helper/treeHelper'
import { extendSlots, getSlot } from '@/utils/helper/tsxHelper'
import { Empty, Spin, Tree } from 'ant-design-vue'
import { cloneDeep, difference, get, omit } from 'lodash-es'
import {
  computed,
  onMounted,
  reactive,
  ref,
  toRaw,
  unref,
  watch,
  watchEffect,
} from 'vue'
import TreeHeader from './components/TreeHeader.vue'
import { useTree } from './hooks/useTree'
import { TreeIcon } from './TreeIcon'
// import { ScrollContainer } from '/@/components/Container'
// import { useContextMenu } from '/@/hooks/web/useContextMenu'
// import { usePermission } from '/@/hooks/web/usePermission'
// defineOptions{
//   name: 'BasicTree'
// }
defineOptions({
  name: 'BasicTree',
  inheritAttrs: false,
})
const props = withDefaults(
  defineProps<treeProps>(),
  {
    helpMessage: '',
    title: '',
    searchValue: '',
    clickRowToExpand: false,
    defaultExpandLevel: '',
    toolbarStrictly: true,
    actionList: () => [],
    expandedKeys: () => [],
    selectedKeys: () => [],
    checkedKeys: () => [],
    beforeRightClick: undefined,
    filterFn: undefined,
    highlight: false,
    loading: false,
  },
)
const emit = defineEmits([
  'update:expandedKeys',
  'update:selectedKeys',
  'update:value',
  'change',
  'check',
  'update:searchValue',
])
const attrs = useAttrs()
const slots: SetupContext['slots'] = useSlots()
const { e, b } = useNamespace('tree')

const state = reactive<TreeState>({
  checkStrictly: props.checkStrictly,
  expandedKeys: props.expandedKeys || [],
  selectedKeys: props.selectedKeys || [],
  checkedKeys: props.checkedKeys || [],
})

const searchState = reactive({
  startSearch: false,
  searchText: '',
  searchData: [] as TreeItem[],
})

const treeDataRef = ref<TreeItem[]>([])

// const [createContextMenu] = useContextMenu()

const getFieldNames = computed((): Required<FieldNames> => {
  const { fieldNames } = props
  return {
    children: 'children',
    title: 'title',
    key: 'key',
    ...fieldNames,
  }
})

const {
  deleteNodeByKey,
  insertNodeByKey,
  insertNodesByKey,
  filterByLevel,
  updateNodeByKey,
  getAllKeys,
  getChildrenKeys,
  getEnabledKeys,
  getSelectedNode,
} = useTree(treeDataRef, getFieldNames)

const getBindValues = computed(() => {
  const propsData: any = {
    'blockNode': true,
    ...attrs,
    ...props,
    'expandedKeys': state.expandedKeys,
    'selectedKeys': state.selectedKeys,
    'checkedKeys': state.checkedKeys,
    'checkStrictly': state.checkStrictly,
    'fieldNames': unref(getFieldNames),
    'onUpdate:expandedKeys': (v: KeyType[]) => {
      state.expandedKeys = v
      emit('update:expandedKeys', v)
    },
    'onUpdate:selectedKeys': (v: KeyType[]) => {
      state.selectedKeys = v
      emit('update:selectedKeys', v)
    },
    'onCheck': (v: CheckKeys, e: any) => {
      let currentValue = toRaw(state.checkedKeys) as KeyType[]
      if (isArray(currentValue) && searchState.startSearch) {
        const value = e.node.eventKey
        currentValue = difference(currentValue, getChildrenKeys(value))
        if (e.checked) {
          currentValue.push(value)
        }
        state.checkedKeys = currentValue
      }
      else {
        state.checkedKeys = v
      }

      const rawVal = toRaw(state.checkedKeys)
      emit('update:value', rawVal)
      emit('check', rawVal, e)
    },
    // 'onRightClick': handleRightClick,
  }
  return omit(propsData, 'treeData', 'class')
})

const getTreeData = computed((): TreeItem[] =>
  searchState.startSearch ? searchState.searchData : unref(treeDataRef),
)

const getNotFound = computed((): boolean => {
  return !getTreeData.value || getTreeData.value.length === 0
})

function getIcon(params: Recordable, icon?: string) {
  if (!icon) {
    if (props.renderIcon && isFunction(props.renderIcon)) {
      return props.renderIcon(params)
    }
  }
  return icon
}

// async function handleRightClick({ event, node }: Recordable) {
//   const { rightMenuList: menuList = [], beforeRightClick } = props
//   let contextMenuOptions: CreateContextOptions = { event, items: [] }

//   if (beforeRightClick && isFunction(beforeRightClick)) {
//     let result = await beforeRightClick(node, event)
//     if (Array.isArray(result)) {
//       contextMenuOptions.items = result
//     }
//     else {
//       Object.assign(contextMenuOptions, result)
//     }
//   }
//   else {
//     contextMenuOptions.items = menuList
//   }
//   if (!contextMenuOptions.items?.length) {
//     return
//   }
//   contextMenuOptions.items = contextMenuOptions.items.filter(item => !item.hidden)
//   // createContextMenu(contextMenuOptions)
// }

function setExpandedKeys(keys: KeyType[]) {
  state.expandedKeys = keys
}

function getExpandedKeys() {
  return state.expandedKeys
}
function setSelectedKeys(keys: KeyType[]) {
  state.selectedKeys = keys
}

function getSelectedKeys() {
  return state.selectedKeys
}

function setCheckedKeys(keys: CheckKeys) {
  state.checkedKeys = keys
}

function getCheckedKeys() {
  return state.checkedKeys
}

function checkAll(checkAll: boolean) {
  state.checkedKeys = checkAll ? getEnabledKeys() : ([] as KeyType[])
}

function expandAll(expandAll: boolean) {
  state.expandedKeys = expandAll ? getAllKeys() : ([] as KeyType[])
}

function onStrictlyChange(strictly: boolean) {
  state.checkStrictly = strictly
}

watch(
  () => props.searchValue,
  (val) => {
    if (val !== searchState.searchText) {
      searchState.searchText = val
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => props.treeData,
  (val) => {
    if (val) {
      handleSearch(searchState.searchText)
    }
  },
)

function handleSearch(searchValue?: string) {
  if (searchValue !== searchState.searchText) {
    searchState.searchText = searchValue as string
  }
  emit('update:searchValue', searchValue)
  if (!searchValue) {
    searchState.startSearch = false
    return
  }
  const { filterFn, checkable, expandOnSearch, checkOnSearch, selectedOnSearch }
    = unref(props)
  searchState.startSearch = true
  const { title: titleField, key: keyField } = unref(getFieldNames)

  const matchedKeys: string[] = []
  searchState.searchData = filter(
    unref(treeDataRef),
    (node) => {
      const result = filterFn
        ? filterFn(searchValue, node, unref(getFieldNames))
        : node[titleField]?.includes(searchValue) ?? false
      if (result) {
        matchedKeys.push(node[keyField])
      }
      return result
    },
    unref(getFieldNames),
  )

  if (expandOnSearch) {
    const expandKeys = treeToList(searchState.searchData).map((val: any) => {
      return val[keyField]
    })
    if (expandKeys && expandKeys.length) {
      setExpandedKeys(expandKeys)
    }
  }

  if (checkOnSearch && checkable && matchedKeys.length) {
    setCheckedKeys(matchedKeys)
  }

  if (selectedOnSearch && matchedKeys.length) {
    setSelectedKeys(matchedKeys)
  }
}

function handleClickNode(key: string, children: TreeItem[]) {
  if (!props.clickRowToExpand || !children || children.length === 0) {
    return
  }
  if (!state.expandedKeys.includes(key)) {
    setExpandedKeys([...state.expandedKeys, key])
  }
  else {
    const keys = [...state.expandedKeys]
    const index = keys.findIndex(item => item === key)
    if (index !== -1) {
      keys.splice(index, 1)
    }
    setExpandedKeys(keys)
  }
}

watchEffect(() => {
  treeDataRef.value = props.treeData as TreeItem[]
})

onMounted(() => {
  const level = Number.parseInt(props.defaultExpandLevel as string)
  if (level > 0) {
    state.expandedKeys = filterByLevel(level)
  }
  else if (props.defaultExpandAll) {
    expandAll(true)
  }
})

watchEffect(() => {
  state.expandedKeys = props.expandedKeys
})

watchEffect(() => {
  state.selectedKeys = props.selectedKeys
})

watchEffect(() => {
  state.checkedKeys = props.checkedKeys
})

watch(
  () => props.value,
  () => {
    state.checkedKeys = toRaw(props.value || [])
  },
  { immediate: true },
)

watch(
  () => state.checkedKeys,
  () => {
    const v = toRaw(state.checkedKeys)
    emit('update:value', v)
    emit('change', v)
  },
)

watchEffect(() => {
  state.checkStrictly = props.checkStrictly
})

const instance: TreeActionType = {
  setExpandedKeys,
  getExpandedKeys,
  setSelectedKeys,
  getSelectedKeys,
  setCheckedKeys,
  getCheckedKeys,
  insertNodeByKey,
  insertNodesByKey,
  deleteNodeByKey,
  updateNodeByKey,
  getSelectedNode,
  checkAll,
  expandAll,
  filterByLevel: (level: number) => {
    state.expandedKeys = filterByLevel(level)
  },
  setSearchValue: (value: string) => {
    handleSearch(value)
  },
  getSearchValue: () => {
    return searchState.searchText
  },
}

// const { isPermission } = usePermission()

function renderAction(node: TreeItem) {
  const { actionList } = props
  if (!actionList || actionList.length === 0) {
    return
  }
  return actionList.map((item, index) => {
    let nodeShow = true
    if (isFunction(item.show)) {
      nodeShow = item.show?.(node)
    }
    else if (isBoolean(item.show)) {
      nodeShow = item.show
    }

    if (!nodeShow) {
      return null
    }

    // if (!isPermission(item.auth, true, item.authMode)) {
    //   return null
    // }

    return (
      <span key={index} class={e('action')}>
        {item.render(node)}
      </span>
    )
  })
}

const treeData = computed(() => {
  const data = cloneDeep(getTreeData.value)
  eachTree(data, (item, _parent) => {
    const searchText = searchState.searchText
    const { highlight } = unref(props)
    const {
      title: titleField,
      key: keyField,
      children: childrenField,
    } = unref(getFieldNames)

    const icon = getIcon(item, item.icon)
    const title = get(item, titleField)

    const searchIdx = searchText ? title.indexOf(searchText) : -1
    const isHighlight
      = searchState.startSearch && !isEmpty(searchText) && highlight && searchIdx !== -1
    const highlightStyle = `color: ${isBoolean(highlight) ? '#f50' : highlight}`

    const titleDom = isHighlight
      ? (
          <span class={unref(getBindValues)?.blockNode ? `${e('content')}` : ''}>
            <span>{title.substr(0, searchIdx)}</span>
            <span style={highlightStyle}>{searchText}</span>
            <span>{title.substr(searchIdx + (searchText as string).length)}</span>
          </span>
        )
      : (
          title
        )

    // item?.slots?.title 不能改为 slots?.title 会导致ApplicationTab.vue bug
    item[titleField] = (
      <span
        class={`${e('title')} pl-2`}
        onClick={handleClickNode.bind(null, item[keyField], item[childrenField])}
      >
        {item?.slots?.title
          ? (
              getSlot(slots, 'title', item)
            )
          : (
              <>
                {icon && <TreeIcon icon={icon} />}
                {item?.slots?.titleBefore && getSlot(slots, item?.slots?.titleBefore, item)}
                {titleDom}
                {item?.slots?.titleAfter && getSlot(slots, item?.slots?.titleAfter, item)}
                <span class={e('actions')}>{renderAction(item)}</span>
              </>
            )}
      </span>
    )
    delete item?.slots
    return item
  })
  return data
})

const showTitle = computed(() => props.title || props.toolbar || props.search || slots.headerTitle)
defineExpose(instance)
</script>

<template>
  <div :class="[b(''), cn('h-full', $attrs.class as any)]">
    <TreeHeader
      v-if="showTitle" :checkable="checkable" :check-all="checkAll" :expand-all="expandAll" :title="title"
      :search="search" :toolbar="toolbar" :toolbar-strictly="toolbarStrictly" :help-message="helpMessage"
      :search-text="searchState.searchText" @strictly-change="onStrictlyChange" @search="handleSearch"
    >
      {{ extendSlots(slots) }}
    </TreeHeader>
    <Spin :wrapper-class-name="treeWrapperClassName" :spinning="loading" tip="加载中...">
      <KpuScrollArea v-show="!getNotFound" :scrollbar="true" :style="{ height: '100%' }">
        <Tree v-bind="getBindValues" :show-icon="false" :tree-data="treeData" />
      </KpuScrollArea>
      <Empty v-show="getNotFound" :image="Empty.PRESENTED_IMAGE_SIMPLE" class="!mt-4" />
    </Spin>
  </div>
</template>

<style scoped>
.ant-spin-container {
  height: 100%;
}
</style>
