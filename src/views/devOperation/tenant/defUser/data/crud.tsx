import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import {
  addRequest,
  delRequest,
  editRequest,
  exportFile,
  infoRequest,
  pageRequest,
  removeFn,
} from '@/api/devOperation/tenant/defUser.ts'
import { DictEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  backendDict,
  createdTimeColumn,
  deleteButton,
  indexColumn,
  STATE_CONSTANT_DICT,
} from '@/plugins/fast-crud/common'
import { downloadFile } from '@/utils/kpu/common.ts'
import { ref } from 'vue'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const loading = ref(false)
  const selectedIds = ref([] as string[])

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
        infoRequest,
      },
      actionbar: {
        buttons: {
          add: {
            // show: hasPermission(RoleEnum.TENANT_USER_ADD)
          },
          ...deleteButton({
            crudExpose: props.crudExpose,
            selectedIds,
            removeFn,
          }),
          importFile: {
            text: '导入',
            click() {
              props.context?.openImportModal(true, {})
            },
          },
          export: {
            text: '导出',
            async click() {
              const response = await exportFile({
                current: 1,
                size: 1000,
                model: {
                  ...props.crudExpose.getSearchFormData(),
                },
              })
              downloadFile(response)
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
        buttons: {
          edit: {
            // show: hasPermission(s.TENANT_USER_EDIT),
          },
          remove: {
            // show: hasPermission(s.TENANT_USER_DELETE),
          },
          copy: {
            // show: hasPermission(s.TENANT_USER_ADD),
          },
          reset: {
            // show: hasPermission(s.TENANT_USER_RESET_PWD),
            dropdown: true,
            text: '重置密码',
            click: ({ row }) => {
              props.context?.openModal(true, {
                record: row,
              })
            },
          },
        },
      },
      form: {
        group: {
          type: 'tabs',
          accordion: false,
          displayDirective: 'show',
          triggerAreas: ['arrow'],
          groups: {
            login: {
              title: '登录信息',
              columns: ['username', 'email', 'mobile', 'idCard', 'wxOpenId', 'ddOpenId'],
            },
            base: {
              title: '基础信息',
              columns: ['nickName', 'sex', 'state', 'workDescribe'],
            },
            other: {
              title: '额外信息',
              columns: ['passwordErrorLastTime', 'passwordErrorNum', 'passwordExpireTime', 'lastLoginTime'],
            },
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        username: {
          title: $t('devOperation.tenant.defUser.username'),
          type: ['text'],
          search: {
            show: true,
          },
        },
        email: {
          title: $t('devOperation.tenant.defUser.email'),
          type: ['text'],
          search: {
            show: true,
          },
        },
        mobile: {
          title: $t('devOperation.tenant.defUser.mobile'),
          type: ['text'],
          search: {
            show: true,
          },
        },
        idCard: {
          title: $t('devOperation.tenant.defUser.idCard'),
          type: ['text'],
          search: {
            show: true,
          },
        },
        wxOpenId: {
          title: $t('devOperation.tenant.defUser.wxOpenId'),
          type: ['text'],
          form: {
            show: false,
          },
          column: {
            show: false,
          },
          viewForm: {
            show: true,
          },
        },
        ddOpenId: {
          title: $t('devOperation.tenant.defUser.ddOpenId'),
          type: ['text'],
          column: {
            show: false,
          },
          form: {
            show: false,
          },
          viewForm: {
            show: true,
          },
        },
        nickName: {
          title: $t('devOperation.tenant.defUser.nickName'),
          type: ['text'],
          search: {
            show: true,
          },
          form: {
            col: {
              span: 24,
            },
          },
        },
        sex: {
          title: $t('devOperation.tenant.defUser.sex'),
          type: ['dict-radio'],
          dict: backendDict(DictEnum.GLOBAL_SEX),
        },
        state: {
          title: $t('devOperation.tenant.defUser.state'),
          type: ['dict-radio'],
          dict: STATE_CONSTANT_DICT,
          addForm: {
            value: true,
          },
        },
        workDescribe: {
          title: $t('devOperation.tenant.defUser.workDescribe'),
          type: ['textarea'],
          column: {
            show: false,
          },
          form: {
            col: {
              span: 24,
            },
          },
        },
        passwordErrorLastTime: {
          title: $t('devOperation.tenant.defUser.passwordErrorLastTime'),
          type: ['password'],
          column: {
            show: false,
          },
          viewForm: {
            show: true,
          },
          form: {
            show: false,
            component: {
              vModel: 'formatted-value',
              defaultTime: '00:00:00',
              format: 'yyyy-MM-dd HH:mm:ss',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
            },
          },
          valueBuilder({ value: e, row: o, key: a }) {
            e !== null && (o[a] = e)
          },
        },
        passwordErrorNum: {
          title: $t('devOperation.tenant.defUser.passwordErrorNum'),
          type: ['password'],
          viewForm: {
            show: true,
          },
          form: {
            show: false,
          },
          column: {
            show: false,
          },
        },
        passwordExpireTime: {
          title: $t('devOperation.tenant.defUser.passwordExpireTime'),
          type: ['password'],
          column: {
            show: false,
          },
          viewForm: {
            show: true,
          },
          form: {
            show: false,
            component: {
              vModel: 'formatted-value',
              defaultTime: '00:00:00',
              format: 'yyyy-MM-dd HH:mm:ss',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
            },
          },
          valueBuilder({ value: e, row: o, key: a }) {
            e !== null && (o[a] = e)
          },
        },
        lastLoginTime: {
          title: $t('devOperation.tenant.defUser.lastLoginTime'),
          type: ['datetime'],
          column: {
            show: false,
          },
          viewForm: {
            show: true,
          },
          form: {
            show: false,
            component: {
              vModel: 'formatted-value',
              defaultTime: '00:00:00',
              format: 'yyyy-MM-dd HH:mm:ss',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
            },
          },
          valueBuilder({ value: e, row: o, key: a }) {
            e !== null && (o[a] = e)
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export function frontRules(_crudExpose: CrudExpose, _mode: ActionEnum): any {
  return {}
}
