import type { ExtendedModalApi } from '@/ui/components/KpuModal/modal.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'

import { addRequest, delRequest, editRequest, infoRequest, pageRequest, removeFn } from '@/api/basic/system/baseRole.ts'
import { DictEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
import { backendDict, deleteButton, STATE_CONSTANT_DICT } from '@/plugins/fast-crud/common.ts'
import { ref } from 'vue'

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const selectedIds = ref([] as string[])
  const selectedId = ref()

  const onRowChange = async (row: any) => {
    selectedId.value = row.id
    await props.context.select(row)
  }

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
      },
      search: {
        show: false,
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
            removeFn,
          }),
        },
      },
      table: {
        scrollX: 500,
        striped: true,
        rowKey: (row: any) => row.id,
        rowSelection: {
          type: 'checkbox',
          selectedRowKeys: selectedIds,
          onChange: (ids: any) => {
            selectedIds.value = ids
          },
        },
        customRow(record: any, _index: number) {
          const clazz = record.id === selectedId.value ? 'fs-current-row' : ''
          return {
            onClick() {
              onRowChange(record)
            },
            class: clazz,
          }
        },
      },
      rowHandle: {
        fixed: 'right',
        width: 100,
        buttons: {
          edit: {
            dropdown: true,
            // show: o(t.ROLE_EDIT),
          },
          bindRole: {
            // show: o(t.ROLE_BIND_USER),
            icon: 'ant-design:usergroup-add-outlined',
            type: 'primary',
            size: 'small',
            click({ row }) {
              const modelApi: ExtendedModalApi = props.context.modelApi()
              modelApi.setData({
                id: row.id,
              })
              modelApi.open()
            },
          },
          view: {
            dropdown: true,
            text: '查看',
          },
          remove: {
            // show: o(t.ROLE_DELETE),
            dropdown: true,
          },
          copy: {
            // show: o(t.ROLE_ADD),
            dropdown: true,
          },
        },
      },
      columns: {
        code: {
          title: $t('basic.system.baseRole.code'),
          type: ['text'],
          search: {
            show: true,
          },
          column: {
            show: false,
          },
        },
        name: {
          title: $t('basic.system.baseRole.name'),
          type: ['text'],
          search: {
            show: true,
          },
        },
        category: {
          title: $t('basic.system.baseRole.category'),
          type: ['dict-radio'],
          dict: backendDict(DictEnum.ROLE_CATEGORY),
          search: {
            show: true,
          },
          addForm: {
            value: '10',
          },
          column: {
            width: 80,
          },
        },
        state: {
          title: $t('basic.system.baseRole.state'),
          type: ['dict-radio'],
          dict: STATE_CONSTANT_DICT,
          column: {
            width: 60,
          },
          search: {
            show: true,
          },
        },
        remarks: {
          title: $t('basic.system.baseRole.remarks'),
          type: ['textarea'],
          column: {
            show: false,
          },
        },
      },
    },
  }
}

export const frontRules = {
  addForm: {
    rules: {},
  },
  editForm: {
    rules: {},
  },
}
