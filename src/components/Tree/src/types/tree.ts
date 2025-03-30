import type { AnyNormalFunction } from '#/index'
import type { PermModeEnum, RoleEnum } from '@/enums/roleEnum'
import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree'

export enum ToolbarEnum {
  SELECT_ALL,
  UN_SELECT_ALL,
  EXPAND_ALL,
  UN_EXPAND_ALL,
  CHECK_STRICTLY,
  CHECK_UN_STRICTLY,
}

export const treeEmits = [
  'update:expandedKeys',
  'update:selectedKeys',
  'update:value',
  'change',
  'check',
  'update:searchValue',
]

export interface TreeState {
  expandedKeys: KeyType[]
  selectedKeys: KeyType[]
  checkedKeys: CheckKeys
  checkStrictly: boolean
}

export interface FieldNames {
  children?: string
  title?: string
  key?: string
}

export type KeyType = string | number

export type CheckKeys =
  | KeyType[]
  | { checked: string[] | number[], halfChecked: string[] | number[] }

export interface treeProps {
  value?: KeyType[] | CheckKeys
  renderIcon?: (params: Recordable) => string
  helpMessage?: string | string[]
  title?: string
  toolbar: boolean
  search: boolean
  searchValue?: string
  checkStrictly: boolean
  clickRowToExpand?: boolean
  checkable: boolean
  defaultExpandLevel?: string | number
  defaultExpandAll?: boolean
  // 工具栏是否显示 层级关联
  toolbarStrictly?: boolean
  fieldNames?: FieldNames
  treeData?: TreeDataItem[]
  actionList?: TreeActionItem[]
  expandedKeys?: KeyType[]
  selectedKeys?: KeyType[]
  checkedKeys?: CheckKeys
  beforeRightClick?: (...arg: any) => ContextMenuItem[] | ContextMenuOptions
  rightMenuList?: ContextMenuItem[]
  // 自定义数据过滤判断方法(注: 不是整个过滤方法，而是内置过滤的判断方法，用于增强原本仅能通过title进行过滤的方式)
  filterFn?: (searchValue: any, node: TreeItem, fieldNames: FieldNames) => boolean
  // 高亮搜索值，仅高亮具体匹配值（通过title）值为true时使用默认色值，值为#xxx时使用此值替代且高亮开启
  highlight?: boolean | string
  // 搜索完成时自动展开结果
  expandOnSearch?: boolean
  // 搜索完成自动选中所有结果,当且仅当 checkable===true 时生效
  checkOnSearch?: boolean
  // 搜索完成自动select所有结果
  selectedOnSearch?: boolean
  loading?: boolean
  treeWrapperClassName?: string
}

// export type TreeProps = ExtractPropTypes<typeof treeProps>

export interface ContextMenuItem {
  label: string
  icon?: string
  hidden?: boolean
  disabled?: boolean
  handler?: AnyNormalFunction

  divider?: boolean
  children?: ContextMenuItem[]
  auth?: string | string[] | RoleEnum | RoleEnum[]
  authMode?: PermModeEnum
}

export interface ContextMenuOptions {
  icon?: string
  styles?: any
  items?: ContextMenuItem[]
}

export interface TreeItem extends TreeDataItem {
  icon?: any
}

export interface TreeActionItem {
  render: (record: Recordable) => any
  show?: boolean | ((record: Recordable) => boolean)
  auth?: string | string[] | RoleEnum | RoleEnum[]
  authMode?: PermModeEnum
}

export interface InsertNodeParams {
  parentKey: string | null
  node: TreeDataItem
  list?: TreeDataItem[]
  push?: 'push' | 'unshift'
}

export interface TreeActionType {
  checkAll: (checkAll: boolean) => void
  expandAll: (expandAll: boolean) => void
  setExpandedKeys: (keys: KeyType[]) => void
  getExpandedKeys: () => KeyType[]
  setSelectedKeys: (keys: KeyType[]) => void
  getSelectedKeys: () => KeyType[]
  setCheckedKeys: (keys: CheckKeys) => void
  getCheckedKeys: () => CheckKeys
  filterByLevel: (level: number) => void
  insertNodeByKey: (opt: InsertNodeParams) => void
  insertNodesByKey: (opt: InsertNodeParams) => void
  deleteNodeByKey: (key: string) => void
  updateNodeByKey: (key: string, node: TreeDataItem) => void
  setSearchValue: (value: string) => void
  getSearchValue: () => string
  getSelectedNode: (
    key: KeyType,
    treeList?: TreeItem[],
    selectNode?: TreeItem | null,
  ) => TreeItem | null
}
