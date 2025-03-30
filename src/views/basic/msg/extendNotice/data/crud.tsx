import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import { delRequest, infoRequest, mark, pageRequest, remove } from '@/api/basic/msg/extendNotice.ts'

import { ActionEnum, DictEnum } from '@/enums/commonEnum.ts'
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
  const { push } = useRouter()
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
          copy: {
            show: !1,
          },
          view: {
            // show
            async click({ row }) {
              if (row.autoRead) {
                await mark([row.id])
              }
              push({
                name: '消息中_我的消息_查看我的消息',
                params: {
                  type: ActionEnum.VIEW,
                  id: row.id,
                },
              })
            },
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        remindMode: {
          title: $t('basic.msg.extendNotice.remindMode'),
          type: 'dict-radio',
          dict: backendDict(DictEnum.EchoDictType_Base_NOTICE_REMIND_MODE),
          search: {
            show: !0,
          },
          column: {
            width: 120,
          },
        },
        isRead: {
          title: $t('basic.msg.extendNotice.isRead'),
          type: ['dict-radio'],
          dict: YES_NO_CONSTANT_DICT,
          search: {
            show: !0,
          },
          form: {
            show: !1,
          },
          column: {
            width: 100,
          },
        },
        title: {
          title: $t('basic.msg.extendNotice.title'),
          type: ['text'],
          search: {
            show: !0,
          },
        },
        author: {
          title: $t('basic.msg.extendNotice.author'),
          type: ['text'],
          search: {
            show: !0,
          },
        },
        content: {
          title: $t('basic.msg.extendNotice.content'),
          type: ['editor-wang5'],
          form: {
            col: {
              span: 24,
            },
            component: {
              id: '1',
            },
          },
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
  return {

  }
}
