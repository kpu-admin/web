/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 kpu-form、kpu-modal、kpu-drawer 等组件使用,
 */

import type { BaseFormComponentType } from '@/ui/form-ui'
import type { Component, SetupContext } from 'vue'

import { $t } from '@/locales'
import KIconPicker from '@/ui/components/KpuIconPicker/index.vue'
import { ApiComponent } from '@/ui/form-ui/api-component'
import { globalShareState } from '@/utils/global-state.ts'

import {
  AutoComplete,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  InputPassword,
  Mentions,
  notification,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  Space,
  Switch,
  Textarea,
  TimePicker,
  TreeSelect,
  Upload,
} from 'ant-design-vue'
import { h } from 'vue'

function withDefaultPlaceholder<T extends Component>(component: T, type: 'input' | 'select') {
  return (props: any, { attrs, slots }: Omit<SetupContext, 'expose'>) => {
    const placeholder = props?.placeholder || $t(`ui.placeholder.${type}`)
    return h(component, { ...props, ...attrs, placeholder }, slots)
  }
}

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType

function normalizeName(filePath: string) {
  const matchResult = filePath.match(/[^/]+(?=\.[^./]+$|$)/)
  return matchResult ? matchResult[0].replace(/\.[^/.]+$/, '') : null
}
function toPascalCase(input: string | null) {
  if (input === null) {
    return null
  }
  return input
    .replaceAll(/[-_]/g, ' ') // 替换所有 "-" 和 "_" 为空格
    .split(' ') // 将字符串分割为单词数组
    .map(word =>
      word && word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(), // 每个单词首字母大写，其余小写
    )
    .join('') // 将单词数组重新拼接成字符串
}

const componentMap = new Map()
const componentRegistrys: Record<string, any> = import.meta.glob('./components/*.vue', { eager: true })
Object.keys(componentRegistrys).forEach((filePath) => {
  if (!filePath.includes('-ignore')) {
    const componentDefinition = componentRegistrys[filePath]?.default || {}
    const normalizedName = normalizeName(filePath)
    componentMap.set(toPascalCase(normalizedName), componentDefinition)
  }
})
function componentRegistry(components: Partial<Record<ComponentType, Component>>) {
  componentMap.forEach((component, componentName) => {
    components[componentName] = component
  })
}
async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),
    ApiSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: $t('ui.placeholder.select'),
          ...props,
          ...attrs,
          component: Select,
          loadingSlot: 'suffixIcon',
          visibleEvent: 'onDropdownVisibleChange',
          modelPropName: 'value',
        },
        slots,
      )
    },
    ApiTreeSelect: (props, { attrs, slots }) => {
      return h(
        ApiComponent,
        {
          placeholder: $t('ui.placeholder.select'),
          ...props,
          ...attrs,
          component: TreeSelect,
          fieldNames: { label: 'label', value: 'value', children: 'children' },
          loadingSlot: 'suffixIcon',
          modelPropName: 'value',
          optionsPropName: 'treeData',
          visibleEvent: 'onVisibleChange',
        },
        slots,
      )
    },
    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots)
    },
    Divider,
    IconPicker: (props, { attrs, slots }) => {
      return h(
        KIconPicker,
        {
          // iconSlot: 'addonAfter',
          // inputComponent: Input,
          ...props,
          ...attrs,
        },
        slots,
      )
    },
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots)
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload,
  }
  componentRegistry(components)
  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components)

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        message: title,
        placement: 'bottomRight',
      })
    },
  })
}

export { initComponentAdapter }
