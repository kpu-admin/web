import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import {
  addRequest,
  delRequest,
  editRequest,
  infoRequest,
  pageRequest,
  remove,
} from '@/api/devOperation/ops/extendInterfaceLogging.ts'
import { JsonViewer } from '@/components/JsonViewer/index.ts'
import { DictEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  backendDict,
  createdTimeColumn,
  deleteButton,
  indexColumn,
} from '@/plugins/fast-crud/common'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { ref } from 'vue'
// import type { FormRulesExt } from '@/service/fetch';
// const { hasPermission } = usePermission()
import { Codemirror } from 'vue-codemirror'

const logExtensions = [java(), oneDark]
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
      form: {
        col: {
          span: 24,
        },
        wrapper: {
          is: 'a-drawer',
          draggable: !1,
          size: '50%',
        },
      },
      actionbar: {
        buttons: {
          add: {
            show: !1,
          },
          ...deleteButton({
            crudExpose: props.crudExpose,
            selectedIds,
            removeFn: remove,
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
            show: !1,
          },
          view: {
            show: !0,
          },

          remove: {
            // show: hasPermission(s.TENANT_OPS_INTERFACES_LOG_LOGGING_DELETE),
          },
          copy: {
            show: !1,
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        execTime: {
          title: $t('basic.msg.extendInterfaceLogging.execTime'),
          type: 'datetime',
          form: {
            component: {
              vModel: 'formatted-value',
              defaultTime: '00:00:00',
              format: 'yyyy-MM-dd HH:mm:ss',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
            },
          },
          valueBuilder({ value, row, key }) {
            value !== null && row && (row[key] = value)
          },
          viewForm: {
            render: ({ value }) => <span>{value}</span>,
          },
          column: {
            show: !0,
          },
        },
        status: {
          title: $t('basic.msg.extendInterfaceLogging.status'),
          type: 'dict-select',
          dict: backendDict(DictEnum.EchoDictType_Base_MSG_INTERFACE_LOGGING_STATUS),
          column: {
            width: 100,
          },
          search: {
            show: !0,
          },
        },
        params: {
          title: $t('basic.msg.extendInterfaceLogging.params'),
          type: ['text', 'copyable'],
          form: {
            render: (e) => {
              try {
                const a = JSON.parse(e.form.params)
                return a
                  ? (<JsonViewer boxed copyable expand-depth="3" value={a} />)
                  : h('div', e.form.params)
              }
              catch {
                return h('div', e.form.params)
              }
            },
          },
        },
        result: {
          title: $t('basic.msg.extendInterfaceLogging.result'),
          type: ['text', 'copyable'],
          form: {
            render: (e) => {
              try {
                const a = JSON.parse(e.form.result)
                return a
                  ? (<JsonViewer boxed copyable expand-depth="3" value={a} />)
                  : h('div', e.form.result)
              }
              catch {
                return h('div', e.form.result)
              }
            },
          },
          column: {
            show: !1,
          },
        },
        errorMsg: {
          title: $t('basic.msg.extendInterfaceLogging.errorMsg'),
          type: ['text', 'copyable'],
          viewForm: {
            render: e => h(Codemirror, {
              autofocus: !0,
              extensions: logExtensions,
              indentWithTab: !0,
              style: {
                height: '200px',
              },
              tabSize: 2,
              modelValue: e.form.errorMsg,
            }),
          },
          column: {
            show: !1,
          },
        },
        bizId: {
          title: $t('basic.msg.extendInterfaceLogging.bizId'),
          type: 'text',
          column: {
            show: !1,
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
