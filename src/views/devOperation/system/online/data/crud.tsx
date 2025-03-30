import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import {
  infoRequest,
  kickout,
  logout,
  pageRequest,
} from '@/api/devOperation/system/online.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  createdTimeColumn,
  indexColumn,
} from '@/plugins/fast-crud/common'
import { Tag } from 'ant-design-vue'
import { ref } from 'vue'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const loading = ref(false)
  const selectedIds = ref([] as string[])
  const { createConfirm } = useMessage()
  return {
    crudOptions: {
      request: {
        pageRequest,
        infoRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
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
        width: '150px',
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
                  await kickout(row.loginId)
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
                  await logout(row.loginId)
                  props?.crudExpose?.doRefresh()
                },
              })
            },
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        username: {
          title: $t('devOperation.tenant.defUser.username'),
          type: 'text',
          search: {
            show: true,
          },
        },
        nickName: {
          title: $t('devOperation.tenant.defUser.nickName'),
          type: 'text',
          search: {
            show: true,
          },
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
        count: {
          title: '数量',
          column: {
            cellRender: ({ row }) =>
              (
                <Tag
                  color="success"
                  style="cursor: pointer"
                  onClick={() => {
                    props?.context?.tokenRef.value.setData({
                      sessionId: row.id,
                    })
                    props?.context?.tokenRef.value.open()
                  }}
                >
                  { row?.tokenSignList?.length}
                  个
                </Tag>
              ),
          },
          ...createdTimeColumn({}),
        },
      },
    },
  }
}
