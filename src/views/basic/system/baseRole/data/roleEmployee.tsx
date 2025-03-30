import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import { saveRoleEmployee } from '@/api/basic/system/baseRole.ts'
import { pageRequest } from '@/api/basic/user/baseEmployee.ts'
import { useMessage } from '@/hooks/useMessage'
import { $t } from '@/locales'

import { createdTimeColumn, indexColumn } from '@/plugins/fast-crud/common.ts'
import { compute, dict } from '@fast-crud/fast-crud'
import { ref } from 'vue'

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const selectedIds = ref([] as string[])
  const { createMessage } = useMessage()
  async function bindUser(flag: boolean, employeeIdList: string[]) {
    const formData = props.context
    formData.bindEmployeeIds = await saveRoleEmployee({
      flag,
      employeeIdList,
      roleId: formData.roleId,
    })

    createMessage.success('操作成功')
  }
  return {
    crudOptions: {
      container: {
        is: 'fs-layout-card',
      },
      request: {
        pageRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: false,
          },
          bind: {
            type: 'primary',
            text: '批量绑定',
            click() {
              if (!unref(selectedIds) || unref(selectedIds).length <= 0) {
                createMessage.success($t('common.tips.pleaseSelectTheData'))
                return
              }
              bindUser(true, unref(selectedIds))
            },
          },
          cancel: {
            type: 'error',
            text: '批量取消',
            click() {
              if (!unref(selectedIds) || unref(selectedIds).length <= 0) {
                createMessage.success($t('common.tips.pleaseSelectTheData'))
                return
              }
              bindUser(false, unref(selectedIds))
            },
          },
        },
      },
      table: {
        striped: true,
        rowKey: (row: any) => row.id,
        rowSelection: {
          type: 'checkbox',
          selectedRowKeys: selectedIds,
          onChange: (ids: any) => {
            selectedIds.value = ids
          },
        },
      },
      rowHandle: {
        width: 100,
        align: 'center',
        buttons: {
          edit: {
            show: false,
          },
          copy: {
            show: false,
          },
          view: {
            show: false,
          },
          remove: {
            show: false,
          },
          bind: {
            type: compute(({ row }) => props.context.bindEmployeeIds.includes(row.id) ? 'error' : 'primary'),
            text: compute(({ row }) => props.context.bindEmployeeIds.includes(row.id) ? '解除绑定' : '绑定'),
            click({ row }) {
              const flag = !props.context.bindEmployeeIds.includes(row.id)
              bindUser(flag, [row.id])
            },
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        username: {
          title: $t('devOperation.tenant.defUser.username'),
          type: ['text'],
          column: {
            show: true,
            formatter: e => e.form.defUser.username,
          },
        },
        mobile: {
          title: $t('devOperation.tenant.defUser.mobile'),
          type: ['text'],
          search: {
            show: true,
          },
          column: {
            show: true,
            formatter: e => e.form.defUser.mobile,
          },
        },
        realName: {
          title: $t('basic.user.baseEmployee.realName'),
          type: ['text'],
          search: {
            show: true,
          },
        },
        orgIdList: {
          title: '所在部门',
          type: ['dict-tree'],
          column: {
            show: false,
          },
          search: {
            show: true,
            component: {
              multiple: true,
            },
          },
          dict: dict({
            isTree: true,
            value: 'id',
            label: 'name',
            // async getData() {
            //   return await b({})
            // },
          }),
        },
        scope: {
          title: '范围',
          type: ['dict-radio'],
          dict: dict({
            data: [{
              value: '-1',
              label: '全部',
              color: 'success',
            }, {
              value: '1',
              label: '已绑定',
              color: 'error',
            }, {
              value: '2',
              label: '未绑定',
              color: 'info',
            }],
          }),
          column: {
            show: false,
          },
          search: {
            show: true,
            component: {
              defaultValue: '-1',
            },
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}
