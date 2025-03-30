import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import {
  addRequest,
  check,
  delRequest,
  editRequest,
  infoRequest,
  pageRequest,
  removeFn,
} from '@/api/devOperation/system/defParameter.ts'
import { RuleType } from '@/api/modules/common/formValidateService.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  createdTimeColumn,
  deleteButton,
  indexColumn,
  STATE_CONSTANT_DICT,
} from '@/plugins/fast-crud/common'
import { ref } from 'vue'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const loading = ref(false)
  const selectedIds = ref([] as string[])

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
        infoRequest,
      },
      actionbar: {
        buttons: {
          add: {
            // show: hasPermission(RoleEnum.SYSTEM_PARAM_ADD)
          },
          ...deleteButton({
            crudExpose: props.crudExpose,
            selectedIds,
            removeFn,
          }),
        },
      },
      table: {
        striped: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          selectedRowKeys: selectedIds,
          onChange: (ids: any) => {
            selectedIds.value = ids
          },
        },
      },
      rowHandle: {
        width: '200px',
        buttons: {
          edit: {
            // show: hasPermission(s.SYSTEM_PARAM_EDIT),
          },
          view: {
            show: true,
          },
          remove: {
            // show: hasPermission(s.SYSTEM_PARAM_DELETE),
          },
          copy: {
            // show: hasPermission(s.SYSTEM_PARAM_ADD),
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        name: {
          title: $t('devOperation.system.defParameter.name'),
          type: 'text',
          search: {
            show: true,
          },
        },
        key: {
          title: $t('devOperation.system.defParameter.key'),
          type: 'text',
          search: {
            show: true,
          },
        },
        value: {
          title: $t('devOperation.system.defParameter.value'),
          type: 'text',
          search: {
            show: true,
          },
        },
        state: {
          title: $t('devOperation.system.defParameter.state'),
          type: 'dict-radio',
          dict: STATE_CONSTANT_DICT,
          search: {
            show: true,
            component: {
              mode: 'multiple',
            },
          },
          addForm: {
            value: true,
          },
        },
        remarks: {
          title: $t('devOperation.system.defParameter.remarks'),
          type: 'textarea',
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export const frontRules = {
  addForm: {
    rules: () => ({
      key: {
        type: RuleType.and,
        rules: [
          {
            trigger: 'blur',
            type: 'string',
            message: '参数重复',
            validator: async (_rule: any, value: any) => {
              if (value && (await check(value))) {
                throw new Error('参数重复')
              }
            },
          },
        ],
      },
    }),
  },
  editForm: {
    rules: (crudExpose: any) => ({
      key: {
        type: RuleType.and,
        rules: [
          {
            trigger: 'blur',
            type: 'string',
            message: '参数重复',
            validator: async (_rule: any, value: any) => {
              if (value) {
                const { getFormData } = crudExpose
                if (await check(value, getFormData().id)) {
                  throw new Error('参数重复')
                }
              }
            },
          },
        ],
      },
    }),
  },
}
