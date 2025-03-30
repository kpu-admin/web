import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import type { Rule } from 'ant-design-vue/es/form'
import { pageRequest } from '@/api/devOperation/tenant/defUser.ts'
import { createdTimeColumn, indexColumn } from '@/plugins/fast-crud/common.ts'
import { isNullOrUnDef } from '@/utils'
import { ref } from 'vue'

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const selectedIds = ref([] as string[])
  const { getSearchRef } = props.crudExpose
  const validator = (_rule: Rule, _value: string, callback: any) => {
    const formData = getSearchRef().formData
    if (isNullOrUnDef(formData.username) && isNullOrUnDef(formData.email) && isNullOrUnDef(formData.idCard) && isNullOrUnDef(formData.mobile)) {
      throw new Error('至少填写一个参数')
    }
    return callback()
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
        show: !1,
      },
      toolbar: {
        show: !1,
      },
      table: {
        striped: true,
        rowKey: 'id',
        rowSelection: {
          type: 'checkbox',
          selectedRowKeys: selectedIds,
          onChange: (ids: any) => {
            selectedIds.value = ids
            props.context.selectedRowKeys = ids
          },
        },
      },
      search: {
        options: {
          showFeedback: !0,
        },
        validate: !0,
      },
      rowHandle: {
        show: !1,
      },
      columns: {
        ...indexColumn(props.crudExpose),
        username: {
          title: '用户名',
          type: ['text'],
          search: {
            show: !0,
            rules: [{
              validator,
              message: '至少填写一个参数',
              trigger: 'blur',
            }],
          },
        },
        nickName: {
          title: '昵称',
          type: ['text'],
          search: {
            show: !1,
          },
          column: {
            show: !0,
          },
        },
        email: {
          title: '邮箱',
          type: ['text'],
          search: {
            show: !0,
            rules: [{
              validator,
              trigger: 'blur',
            }],
          },
        },
        idCard: {
          title: '身份证',
          type: ['text'],
          search: {
            show: !0,
            rules: [{
              validator,
              trigger: 'blur',
            }],
          },
        },
        mobile: {
          title: '手机',
          type: ['text'],
          search: {
            show: !0,
            rules: [{
              validator,
              trigger: 'blur',
            }],
          },
        },
        ...createdTimeColumn({ searchShow: false }),
      },
    },
  }
}
