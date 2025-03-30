import type { KpuFormProps } from '@/adapter/form'
import type { VxeGridPropTypes } from 'vxe-table'
import { RuleType } from '@/api/modules/common/formValidateService.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
// 列表页字段
export function formItems(): KpuFormProps {
  return {
    fieldMappingTime: [
      ['createdTime', ['extra.createdTime_st', 'extra.createdTime_ed'], ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59']],
    ],
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('devOperation.ops.defInterfaceProperty.name'),
        componentProps: {
          placeholder: '请输入',
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'key',
        label: $t('devOperation.ops.defInterfaceProperty.key'),
        componentProps: {
          placeholder: '请输入',
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'value',
        label: $t('devOperation.ops.defInterfaceProperty.value'),
        componentProps: {
          placeholder: '请输入',
          allowClear: true,
        },
      },
    ],
  }
}
export function columns(): VxeGridPropTypes.Columns {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { type: 'seq', field: 'seq', width: 40, fixed: 'left' },
    {
      field: 'name',
      title: $t('devOperation.ops.defInterfaceProperty.name'),
      editRender: { name: 'Input', attrs: { placeholder: '请输入' } },
    },
    {
      field: 'key',
      title: $t('devOperation.ops.defInterfaceProperty.key'),
      editRender: { name: 'Input', attrs: { placeholder: '请输入' } },
    },
    {
      field: 'value',
      title: $t('devOperation.ops.defInterfaceProperty.value'),
      editRender: { name: 'Input', attrs: { placeholder: '请输入' } },
    },
    {
      field: 'remarks',
      title: $t('devOperation.ops.defInterfaceProperty.remarks'),
      editRender: { name: 'Input', attrs: { placeholder: '请输入' } },
    },
    {
      title: $t('common.column.action'),
      width: 160,
      fixed: 'right',
      slots: { default: 'operate' },
    },
  ]
}
export const frontRules = {
  addForm: {
    rules: () => ({
      implClass: {
        type: RuleType.and,
        rules: [{
          trigger: 'blur',
          type: 'string',
          required: !0,
          message: '不能为空',
        }],
      },
      script: {
        type: RuleType.and,
        rules: [{
          trigger: 'blur',
          required: !0,
          type: 'string',
          message: '不能为空',
        }],
      },
    }),
  },
  editForm: {
    rules: () => ({
    }),
  },
}
