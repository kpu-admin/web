import type { CreateCrudOptionsProps, CreateCrudOptionsRet, PageQuery } from '@fast-crud/fast-crud'
import {
  getTokenSignListRequest,
  kickout,
  logout,
} from '@/api/devOperation/system/online.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { transformQuery } from '@/plugins/fast-crud'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  indexColumn,
} from '@/plugins/fast-crud/common'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const loading = ref(false)
  // const selectedIds = ref([] as string[])
  const { createConfirm } = useMessage()
  return {
    crudOptions: {
      request: {
        pageRequest: getTokenSignListRequest,
        transformQuery: (data: PageQuery) => {
          const query = transformQuery(data)
          query.model.sessionId = props.context.sessionId.value
          return query
        },
      },

      table: {
        striped: true,
        rowKey: 'id',
      },
      pagination: {
        show: false,
      },
      search: {
        show: false,
      },
      actionbar: {
        show: false,
      },
      toolbar: {
        show: false,
      },
      rowHandle: {
        width: 200,
        buttons: {
          edit: {
            show: false,
          },
          view: {
            show: false,
          },
          copy: {
            show: false,
          },
          remove: {
            show: false,
          },

          kickout: {
            // show: hasPermission(g.TENANT_SYSTEM_ONLINE_KICKOUT),
            text: '踢下线',
            type: 'link',
            danger: true,
            click: ({ row }) => {
              createConfirm({
                content: '确定将该用户踢下线吗？',
                iconType: 'warning',
                onOk: async () => {
                  await kickout(undefined, row.value)
                  props?.crudExpose?.doRefresh()
                },
              })
            },
          },
          logout: {
            // show: hasPermission(g.TENANT_SYSTEM_ONLINE_LOGOUT),
            text: '强制注销',
            type: 'link',
            danger: true,
            click: ({ row }) => {
              createConfirm({
                content: '确定将该用户强制注销吗？',
                iconType: 'warning',
                onOk: async () => {
                  await logout(undefined, row.value)
                  props?.crudExpose?.doRefresh()
                },
              })
            },
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        value: {
          title: 'Token',
          type: 'text',
        },
        device: {
          column: {
            width: 80,
          },
          title: '设备类型',
          type: 'text',
        },
        sessionTime: {
          title: '创建时间',
          type: 'text',
          column: {
            cellRender: ({ row }) => [h('div', {}, row.sessionTime), h('b', {
              style: 'color: green;',
            }, row.sessionStr)],
          },
        },
        expireTime: {
          title: '过期时间',
          type: 'text',
          column: {
            cellRender: ({ row }) => [h('div', {}, row.expireTime), h('b', {
              style: 'color: green;',
            }, row.expireStr)],
          },
        },
      },
    },
  }
}
