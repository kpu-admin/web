import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import {
  addRequest,
  delRequest,
  editRequest,
  infoRequest,
  pageRequest,
  removeFn,
} from '@/api/devOperation/system/defClient.ts'
import { DictEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  backendDict,
  createdTimeColumn,
  deleteButton,
  indexColumn,
  YES_NO_CONSTANT_DICT,
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
            // show: hasPermission(s.SYSTEM_CLIENT_EDIT),
          },
          remove: {
            // show: hasPermission(s.SYSTEM_CLIENT_DELETE),
          },
          copy: {
            // show: hasPermission(s.SYSTEM_CLIENT_ADD),
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        clientId: {
          title: $t('devOperation.system.defClient.clientId'),
          type: 'text',
          search: {
            show: true,
          },
          viewForm: {
            show: true,
          },
          form: {
            show: false,
          },
        },
        clientSecret: {
          title: $t('devOperation.system.defClient.clientSecret'),
          type: 'text',
          viewForm: {
            show: true,
          },
          form: {
            show: false,
          },
          column: {
            show: false,
          },
        },
        name: {
          title: $t('devOperation.system.defClient.name'),
          type: 'text',
          search: {
            show: true,
          },
        },
        type: {
          title: $t('devOperation.system.defClient.type'),
          type: 'dict-radio',
          dict: backendDict(DictEnum.CLIENT_TYPE),
        },
        remarks: {
          title: $t('devOperation.system.defClient.remarks'),
          type: 'textarea',
          column: {
            show: false,
          },
        },
        state: {
          title: $t('devOperation.system.defClient.state'),
          type: 'dict-radio',
          dict: YES_NO_CONSTANT_DICT,
          search: {
            show: true,
          },
          form: {
            value: true,
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export function frontRules(_crudExpose: CrudExpose, _mode: ActionEnum): any {
  return {}
}
