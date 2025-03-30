import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import { tree } from '@/api/basic/user/baseOrg.ts'

import { addRequest, delRequest, editRequest, infoRequest, pageRequest, remove } from '@/api/basic/user/basePosition.ts'
import { $t } from '@/locales'
import { transformQuery } from '@/plugins/fast-crud'
import { deleteButton, YES_NO_CONSTANT_DICT } from '@/plugins/fast-crud/common.ts'
import { dict } from '@fast-crud/fast-crud'
import { ref } from 'vue'

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const selectedIds = ref([] as string[])

  return {
    crudOptions: {
      container: {
        is: 'fs-layout-card',
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
        infoRequest,
        transformQuery: (query) => {
          const params = transformQuery(query)
          params.model.orgIdList = props.context.orgIdList.value
          return params
        },
      },
      actionbar: {
        buttons: {
          add: {
            // show: o(t.ROLE_ADD),
          },
          ...deleteButton({
            // role: t.ROLE_DELETE,
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
          view: {
            show: !0,
          },
          edit: {
            // show: o(t.ROLE_EDIT),
          },
          remove: {
            // show: o(t.ROLE_DELETE),
          },

        },
      },
      columns: {
        name: {
          title: $t('basic.user.basePosition.name'),
          type: ['text'],
          search: {
            show: !0,
          },
        },
        orgId: {
          title: $t('basic.user.basePosition.orgId'),
          type: ['dict-tree'],
          column: {
            component: {
              type: 'text',
            },
          },
          dict: dict({
            isTree: !0,
            value: 'id',
            label: 'name',
            async getData() {
              return await tree({})
            },
          }),
        },
        state: {
          title: $t('basic.user.basePosition.state'),
          type: ['dict-radio'],
          dict: YES_NO_CONSTANT_DICT,
          search: {
            show: !0,
          },
          form: {
            component: {
              optionName: 'a-radio-button',
            },
            value: !0,
          },
        },
        remarks: {
          title: $t('basic.user.basePosition.remarks'),
          type: ['textarea'],
          search: {
            show: !0,
          },
        },
      },
    },
  }
}

export function frontRules(_crudExpose: CrudExpose, _mode: ActionEnum): any {
  return {}
}
