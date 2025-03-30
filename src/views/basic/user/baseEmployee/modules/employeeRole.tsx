import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import { pageRequest } from '@/api/basic/system/baseRole.ts'
import { saveEmployeeRole } from '@/api/basic/user/baseEmployee.ts'
import { saveOrgRole } from '@/api/basic/user/baseOrg.ts'
import { ScopeTypeEnum } from '@/enums/common/base.ts'
import { DictEnum } from '@/enums/commonEnum.ts'
import { useMessage } from '@/hooks/useMessage'
import { $t } from '@/locales'
import { transformQuery } from '@/plugins/fast-crud'
import { backendDict, createdTimeColumn, indexColumn, STATE_CONSTANT_DICT } from '@/plugins/fast-crud/common.ts'
import { compute } from '@fast-crud/fast-crud'
import { ref } from 'vue'

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const selectedIds = ref([] as string[])
  const { createMessage } = useMessage()
  async function bindRole(flag: boolean, roleIdList: string[]) {
    const context = props.context

    if (context.scopeType === ScopeTypeEnum.EMPLOYEE) {
      context.bindRoleIds = await saveEmployeeRole({
        flag,
        roleIdList,
        employeeId: context.employeeId,
      })
    }
    else {
      context.bindRoleIds = await saveOrgRole({
        flag,
        roleIdList,
        orgId: context.orgId,
      })
    }

    createMessage.success('操作成功')
  }
  return {
    selectedRowKeys: selectedIds,
    crudOptions: {
      container: {
        is: 'fs-layout-card',
      },
      request: {
        pageRequest,
        transformQuery: (query) => {
          const pageParams = transformQuery(query)
          pageParams.model.orgId = props.context.roleId
          pageParams.model.scopeType = props.context.scopeType
          return pageParams
        },
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
              bindRole(true, unref(selectedIds))
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
              bindRole(false, unref(selectedIds))
            },
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
        width: 110,
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
            type: 'primary',
            danger: compute(({ row }) => !!props.context.bindRoleIds.includes(row.id)),
            text: compute(({ row }) => props.context.bindRoleIds.includes(row.id) ? '解除绑定' : '绑定'),
            click({ row }) {
              const flag = !props.context.bindRoleIds.includes(row.id)
              bindRole(flag, [row.id])
            },
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        code: {
          title: $t('basic.system.baseRole.code'),
          type: ['text'],
          column: {
            show: !0,
          },
        },
        name: {
          title: $t('basic.system.baseRole.name'),
          type: ['text'],
          search: {
            show: !0,
          },
          column: {
            show: !0,
          },
        },
        category: {
          title: $t('basic.system.baseRole.category'),
          type: ['dict-radio'],
          dict: backendDict(DictEnum.ROLE_CATEGORY),
          search: {
            show: !0,
          },
        },
        state: {
          title: $t('basic.system.baseRole.state'),
          type: ['dict-radio'],
          dict: STATE_CONSTANT_DICT,
          search: {
            show: !0,
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}
