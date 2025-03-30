import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import { findOnlineService } from '@/api/devOperation/application/gateway'
import { EnumEnum } from '@/enums/commonEnum'
import { backendDict } from '@/plugins/fast-crud/common'
import { cloneDeep } from '@/utils'
import { compute, dict } from '@fast-crud/fast-crud'

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  function updateTableData() {
    const { emit } = props.context
    const tableData = props.crudExpose.getTableData()
    emit('update:value', tableData)
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
        rowKey: (row: any) => row.tempId,
        // striped: true,
        // remove: {
        //   afterRemove: updateTableData
        // }
      },
      actionbar: {
        buttons: {
          add: {
            show: props.context.mode !== 'view',
          },
          select: {
            show: props.context.mode !== 'view',
            text: '选择',
            type: 'primary',
            click() {
              const tableData = props.crudExpose.getTableData()
              props.context.openModal(cloneDeep(tableData))
            },
          },
        },
      },
      rowHandle: {
        width: 120,
        buttons: {
          edit: {
            show: compute(({ row }) => props.context.mode !== 'view' && row.isInput),
          },
          view: {
            show: false,
          },
          copy: {
            show: false,
          },
          remove: {
            show: compute(() => props.context.mode !== 'view'),
          },
        },
      },
      columns: {
        isInput: {
          title: '是否手动录入',
          column: {
            show: false,
          },
          form: {
            show: false,
          },
        },
        springApplicationName: {
          title: '服务名',
          type: 'dict-select',
          dict: dict({
            async getData() {
              return await findOnlineService()
            },
          }),
          form: {
            helper: {
              position: 'label',
              text: `kpu-cloud: 自动查询后台已经正常启动并注册到nacos中的服务
kpu-boot: 后台拆分的模块`,
            },
            rules: {
              required: true,
              message: '这是必填项',
            },
          },
          column: {
            show: false,
          },
        },
        controller: {
          title: '控制器类名',
          type: 'text',
          form: {
            rules: {
              required: true,
              message: '这是必填项',
            },
          },
          column: {
            show: false,
          },
        },
        name: {
          title: '接口名称',
          type: 'text',
          form: {
            rules: {
              required: true,
              message: '这是必填项',
            },
          },
        },
        uri: {
          title: '接口地址',
          type: 'text',
          form: {
            rules: {
              required: true,
              message: '这是必填项',
            },
          },
          column: {
            width: 250,
            ellipsis: true,
          },
        },
        requestMethod: {
          title: '请求类型',
          type: 'dict-select',
          dict: backendDict({
            type: EnumEnum.HttpMethod,
            isEnum: true,
          }),
          form: {
            rules: {
              required: true,
              message: '这是必填项',
            },
          },
          column: {
            show: false,
          },
        },
      },
    },
  }
}
