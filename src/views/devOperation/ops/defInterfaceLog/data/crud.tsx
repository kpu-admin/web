import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import {
  addRequest,
  delRequest,
  editRequest,
  infoRequest,
  pageRequest,
  remove,
} from '@/api/devOperation/ops/extendInterfaceLog.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
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
  const { push } = useRouter()

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
            click({ row }) {
              const data = props.crudExpose.getSearchFormData()
              push({
                name: '运维平台_接口日志_日志执行记录',
                params: {
                  id: row.id,
                },
                query: {
                  tenantId: data?.tenantId,
                },
              })
            },
          },

          remove: {
            // show: hasPermission(s.TENANT_OPS_INTERFACES_LOG_DELETE),
          },
          copy: {
            show: !1,
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        name: {
          title: $t('basic.msg.extendInterfaceLog.name'),
          type: ['text'],
          search: {
            show: !0,
          },
        },
        successCount: {
          title: $t('basic.msg.extendInterfaceLog.successCount'),
          type: ['text'],
        },
        failCount: {
          title: $t('basic.msg.extendInterfaceLog.failCount'),
          type: ['text'],
        },
        lastExecTime: {
          title: $t('basic.msg.extendInterfaceLog.lastExecTime'),
          type: ['datetime'],
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export function frontRules(_crudExpose: CrudExpose, _mode: ActionEnum): any {
  return {}
}
