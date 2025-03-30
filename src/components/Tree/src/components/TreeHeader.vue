<script lang="ts" setup>
import { $t } from '@/locales'
import { useNamespace } from '@/utils/classNames'
import { useDebounceFn } from '@vueuse/core'
import { Dropdown, InputSearch, Menu, MenuDivider, MenuItem } from 'ant-design-vue'
import { computed, ref, useSlots, watch } from 'vue'
import { ToolbarEnum } from '../types/tree'
// import { BasicTitle } from '@/components/Basic'

const props = defineProps({
  helpMessage: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  toolbar: {
    type: Boolean,
    default: false,
  },
  checkable: {
    type: Boolean,
    default: false,
  },
  search: {
    type: Boolean,
    default: false,
  },
  searchText: {
    type: String,
    default: '',
  },
  checkAll: {
    type: Function,
    default: undefined,
  },
  expandAll: {
    type: Function,
    default: undefined,
  },
  // 工具栏是否显示 层级关联
  toolbarStrictly: {
    type: Boolean,
    default: true,
  },
} as const)
const emits = defineEmits<{
  strictlyChange: [
  payload: boolean,
  ]
  search: [
    payload?: string,
  ]
}>()
const { b: bem } = useNamespace('tree-header')
const searchValue = ref('')

const slots = useSlots()

const getInputSearchCls = computed(() => {
  const titleExists = slots.headerTitle || props.title
  return [
    'mr-1',
    'w-full',
    {
      'ml-5': titleExists,
    },
  ]
})

const toolbarList = computed(() => {
  const { checkable, toolbarStrictly } = props
  const defaultToolbarList = [
    { label: $t('component.tree.expandAll'), value: ToolbarEnum.EXPAND_ALL },
    {
      label: $t('component.tree.unExpandAll'),
      value: ToolbarEnum.UN_EXPAND_ALL,
      divider: checkable,
    },
  ]

  const strictlyList = toolbarStrictly
    ? [
        { label: $t('component.tree.checkStrictly'), value: ToolbarEnum.CHECK_STRICTLY },
        { label: $t('component.tree.checkUnStrictly'), value: ToolbarEnum.CHECK_UN_STRICTLY },
      ]
    : []

  return checkable
    ? [
        { label: $t('component.tree.selectAll'), value: ToolbarEnum.SELECT_ALL },
        {
          label: $t('component.tree.unSelectAll'),
          value: ToolbarEnum.UN_SELECT_ALL,
          divider: checkable,
        },
        ...defaultToolbarList,
        ...strictlyList,
      ]
    : defaultToolbarList
})
// : { key: ToolbarEnum }
function handleMenuClick(e: any) {
  const { key } = e
  switch (key) {
    case ToolbarEnum.SELECT_ALL:
      props.checkAll?.(true)
      break
    case ToolbarEnum.UN_SELECT_ALL:
      props.checkAll?.(false)
      break
    case ToolbarEnum.EXPAND_ALL:
      props.expandAll?.(true)
      break
    case ToolbarEnum.UN_EXPAND_ALL:
      props.expandAll?.(false)
      break
    case ToolbarEnum.CHECK_STRICTLY:
      emits('strictlyChange', false)
      break
    case ToolbarEnum.CHECK_UN_STRICTLY:
      emits('strictlyChange', true)
      break
  }
}

function emitChange(value?: string): void {
  emits('search', value)
}

const debounceEmitChange = useDebounceFn(emitChange, 200)

watch(
  () => searchValue.value,
  (v) => {
    debounceEmitChange(v)
  },
)

watch(
  () => props.searchText,
  (v) => {
    if (v !== searchValue.value) {
      searchValue.value = v
    }
  },
)
</script>

<template>
  <div :class="bem()" class="flex items-center px-2 py-1.5">
    <slot v-if="slots.headerTitle" name="headerTitle" />
    <div v-if="!slots.headerTitle && title" :help-message="helpMessage">
      {{ title }}
    </div>
    <div
      v-if="search || toolbar"
      class="flex flex-1 cursor-pointer items-center justify-self-stretch"
    >
      <div v-if="search" :class="getInputSearchCls">
        <InputSearch
          v-model:value="searchValue"
          :placeholder="$t('common.searchText')"
          size="small"
          allow-clear
        />
      </div>
      <Dropdown v-if="toolbar" @click.prevent>
        <KpuIcon name="ion:ellipsis-vertical" />
        <template #overlay>
          <Menu @click="handleMenuClick">
            <template v-for="item in toolbarList" :key="item.value">
              <MenuItem v-bind="{ key: item.value }">
                {{ item.label }}
              </MenuItem>
              <MenuDivider v-if="item.divider" />
            </template>
          </Menu>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
