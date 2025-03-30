import type { DropMenu } from '@/components/Dropdown/typing.ts'
import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import {
  delRequest,
  infoRequest,
  pageRequest,
  removeFn,
} from '@/api/devOperation/system/defLoginLog.ts'
import { EnumEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  backendDict,
  createdTimeColumn,
  deleteButton,
  indexColumn,
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
        delRequest,
        infoRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: false,
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
        width: '120px',
        buttons: {
          edit: {
            show: false,
          },
          view: {
            show: true,
          },
          remove: {
            // show: hasPermission(R.SYSTEM_LOGIN_LOG_DELETE)
          },
          copy: {
            show: false,
          },

        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        // tenantId: {
        //   title: $t('devOperation.system.defLoginLog.tenantId'),
        //   type: 'dict-select',
        //   dict: dict({
        //     value: 'id',
        //     label: 'name',
        //     getData() {
        //       return o(this, null, function*() {
        //         return yield N.query({})
        //       })
        //     },
        //   }),
        //   column: {
        //     width: 120,
        //   },
        //   search: {
        //     show: true,
        //   },
        // },
        requestIp: {
          title: $t('devOperation.system.defLoginLog.requestIp'),
          type: 'text',
          column: {
            width: 120,
          },
          search: {
            show: true,
          },
        },
        nickName: {
          title: $t('devOperation.system.defLoginLog.nickName'),
          type: 'text',
          column: {
            width: 120,
          },
          search: {
            show: true,
          },
        },
        username: {
          title: $t('devOperation.system.defLoginLog.username'),
          type: 'text',
          column: {
            width: 120,
          },
          search: {
            show: true,
          },
        },
        status: {
          title: $t('devOperation.system.defLoginLog.status'),
          type: 'dict-select',
          dict: backendDict({
            type: EnumEnum.LoginStatusEnum,
            isEnum: true,
          }),
          column: {
            width: 120,
          },
          search: {
            show: true,
          },
        },
        description: {
          title: $t('devOperation.system.defLoginLog.description'),
          type: 'text',
        },
        loginDate: {
          title: $t('devOperation.system.defLoginLog.loginDate'),
          type: 'text',
        },
        ua: {
          title: $t('devOperation.system.defLoginLog.ua'),
          type: 'textarea',
          column: {
            show: false,
          },
        },
        browser: {
          title: $t('devOperation.system.defLoginLog.browser'),
          type: 'text',
          column: {
            show: false,
          },
        },
        browserVersion: {
          title: $t('devOperation.system.defLoginLog.browserVersion'),
          type: 'text',
        },
        operatingSystem: {
          title: $t('devOperation.system.defLoginLog.operatingSystem'),
          type: 'text',
        },
        location: {
          title: $t('devOperation.system.defLoginLog.location'),
          type: 'text',
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export function frontRules(_crudExpose: CrudExpose, _mode: ActionEnum): any {
  return {}
}

export const clearList: DropMenu[] = [
  {
    text: '保留1个月',
    event: '1',
  },
  {
    text: '保留三个月',
    event: '2',
  },
  {
    text: '保留六个月',
    event: '3',
  },
  {
    text: '保留一年',
    event: '4',
  },
  {
    text: '保留一千条',
    event: '5',
  },
  {
    text: '保留一万条',
    event: '6',
  },
  {
    text: '保留三万条',
    event: '7',
  },
  {
    text: '保留十万条',
    event: '8',
  },
  {
    text: '清空所有',
    event: '9',
  },
]
