import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'

// 元数据 编辑表单
export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  function updateTableData() {
    const { emit } = props.context
    const tableData = props.crudExpose.getTableData()
    const updatedData: Record<string, any> = {}

    function convertValueToCorrectType(value: string) {
      if (value === 'false') {
        return false
      }
      if (value === 'true') {
        return true
      }
      if (/^\d+$/.test(value)) {
        return Number.parseInt(value, 10)
      }
      if (/^\d+\.\d+$/.test(value)) {
        return Number.parseFloat(value)
      }
      return value
    }
    for (const row of tableData) {
      updatedData[row.key] = convertValueToCorrectType(row.value)
    }
    emit('update:value', JSON.stringify(updatedData))
  }
  return {
    crudOptions: {
      search: {
        show: false,
      },
      toolbar: {
        show: false,
      },
      pagination: {
        show: false,
      },
      mode: {
        name: 'local',
        isMergeWhenUpdate: true,
        isAppendWhenAdd: true,
      },
      form: {
        col: {
          span: 24,
        },
        afterSubmit: updateTableData,
      },
      table: {
        striped: true,
        remove: {
          afterRemove: updateTableData,
        },
      },
      actionbar: {
        buttons: {
          add: {
            show: props.context.mode !== 'view',
          },
        },
      },
      rowHandle: {
        width: 120,
        buttons: {
          edit: {
            show: props.context.mode !== 'view',
          },
          view: {
            show: false,
          },
          copy: {
            show: false,
          },
          remove: {
            show: computed(() => props.context.mode !== 'view'),
          },
        },
      },
      columns: {
        key: {
          title: 'key',
          type: 'text',
          form: {
            component: {
              name: 'a-auto-complete',
              allowClear: true,
              getPopupContainer: () => document.body,
              filterOption: (input: string, option: any) => {
                return option.value.toUpperCase().includes(input.toUpperCase())
              },
              options: [
                { value: 'title' },
                { value: 'ignoreKeepAlive' },
                { value: 'affix' },
                { value: 'transitionName' },
                { value: 'hideBreadcrumb' },
                { value: 'carryParam' },
                { value: 'hideChildrenInMenu' },
                { value: 'currentActiveMenu' },
                { value: 'hideTab' },
                { value: 'hideMenu' },
                { value: 'ignoreRoute' },
                { value: 'content' },
                { value: 'dot' },
                { value: 'type' },
              ],
            },
            rules: {
              required: true,
              message: '这是必填项',
            },
          },
        },
        value: {
          title: 'value',
          type: 'text',
          form: {
            rules: {
              required: true,
              message: '这是必填项',
            },
          },
        },
      },
    },
  }
}
