import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { ExtendedModalApi } from '@/ui/components/KpuModal/modal.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'

import { addRequest, delRequest, editRequest, infoRequest, pageRequest, remove } from '@/api/basic/user/baseEmployee.ts'
import { tree } from '@/api/basic/user/baseOrg.ts'
import { query } from '@/api/basic/user/basePosition.ts'
import { ScopeTypeEnum } from '@/enums/common/base.ts'
import { DictEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
import { transformQuery } from '@/plugins/fast-crud'
import { backendDict, deleteButton, STATE_CONSTANT_DICT, YES_NO_CONSTANT_DICT } from '@/plugins/fast-crud/common.ts'
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
          invitationUser: {
            // show: u(c.INVITATION_USER),
            text: '邀请用户',
            click() {
              props.context.invitationUserModelApi().open()
            },
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
          bindRole: {
            // show: o(t.ROLE_BIND_USER),
            order: 0,
            text: '绑定角色',
            type: 'link',
            size: 'small',
            dropdown: !0,
            click({ row }) {
              const modelApi: ExtendedModalApi = props.context.bindRoleModelApi()
              modelApi.setData({
                scopeType: ScopeTypeEnum.EMPLOYEE,
                id: row.id,
              })
              modelApi.open()
            },
          },
          copy: {
            // show: u(c.EMPLOYEE_ADD),
            dropdown: !0,
            click(a) {
              props.crudExpose.openCopy(a)
            },
          },
          reset: {
            // show: u(c.EMPLOYEE_REST_PWD),
            dropdown: !0,
            text: '重置密码',
            click({ row }) {
              const modelApi: ExtendedModalApi = props.context.resetPasswordModelApi()
              modelApi.setData({
                record: row,
              })
              modelApi.open()
            },
          },

        },
      },
      columns: {
        'realName': {
          title: $t('basic.user.baseEmployee.realName'),
          type: ['text'],
          search: {
            show: !0,
          },
        },
        'positionId': {
          title: $t('basic.user.baseEmployee.positionId'),
          type: 'dict-select',
          dict: dict({
            value: 'id',
            label: 'name',
            async getData() {
              return await query({})
            },
          }),
          column: {
            component: {
              type: 'text',
            },
          },
          search: {
            show: !0,
          },
        },
        'orgIdList': {
          title: '所属部门',
          type: ['dict-tree'],
          form: {
            component: {
              multiple: !0,
            },
          },
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
        'positionStatus': {
          title: $t('basic.user.baseEmployee.positionStatus'),
          type: ['dict-radio'],
          dict: backendDict(DictEnum.POSITION_STATUS),
          search: {
            show: !0,
          },
          addForm: {
            value: '10',
          },
          column: {
            width: 80,
          },
        },
        'state': {
          title: $t('basic.user.baseEmployee.state'),
          type: ['dict-radio'],
          dict: YES_NO_CONSTANT_DICT,
          search: {
            show: !0,
          },
          addForm: {
            value: !0,
          },
          form: {
            component: {
              optionName: 'a-radio-button',
            },
          },
          column: {
            width: 80,
          },
        },
        'username': {
          title: $t('devOperation.tenant.defUser.username'),
          type: ['text'],
          column: {
            show: !1,
          },
        },
        'defUser.mobile': {
          title: $t('devOperation.tenant.defUser.mobile'),
          type: ['text'],
          editForm: {
            show: !1,
          },
          column: {
            show: !1,
          },
        },
        'email': {
          title: $t('devOperation.tenant.defUser.email'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'idCard': {
          title: $t('devOperation.tenant.defUser.idCard'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'wxOpenId': {
          title: $t('devOperation.tenant.defUser.wxOpenId'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'ddOpenId': {
          title: $t('devOperation.tenant.defUser.ddOpenId'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'nickName': {
          title: $t('devOperation.tenant.defUser.nickName'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'sex': {
          title: '性别',
          type: ['dict-select'],
          dict: backendDict(DictEnum.GLOBAL_SEX),
          addForm: {
            value: '1',
          },
          editForm: {
            show: !1,
          },
          column: {
            show: !1,
          },
        },
        'nation': {
          title: '民族',
          type: ['dict-select'],
          dict: backendDict(DictEnum.NATION),
          editForm: {
            show: !1,
          },
          column: {
            show: !1,
          },
        },
        'education': {
          title: '学历',
          type: ['dict-select'],
          dict: backendDict(DictEnum.EDUCATION),
          editForm: {
            show: !1,
          },
          column: {
            show: !1,
          },
        },
        'workDescribe': {
          title: $t('devOperation.tenant.defUser.workDescribe'),
          type: ['textarea'],
          form: {
            show: !1,
            col: {
              span: 24,
            },
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'passwordErrorLastTime': {
          title: $t('devOperation.tenant.defUser.passwordErrorLastTime'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'passwordErrorNum': {
          title: $t('devOperation.tenant.defUser.passwordErrorNum'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'passwordExpireTime': {
          title: $t('devOperation.tenant.defUser.passwordExpireTime'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'lastLoginTime': {
          title: $t('devOperation.tenant.defUser.lastLoginTime'),
          type: ['text'],
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        'locked': {
          title: $t('devOperation.tenant.defUser.locked'),
          type: ['dict-radio'],
          dict: STATE_CONSTANT_DICT,
          form: {
            show: !1,
          },
          viewForm: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
      },
      form: {
        wrapper: {
          is: 'a-drawer',
          width: '50%',
          draggable: !1,
        },
        group: {
          type: 'tabs',
          accordion: !1,
          displayDirective: 'show',
          triggerAreas: ['arrow'],
          groups: {
            employee: {
              header: '员工信息',
              columns: ['realName', 'state', 'orgIdList', 'positionId', 'positionStatus'],
            },
            userInfo: {
              header: '用户信息',
              columns: ['username', 'defUser.mobile', 'email', 'idCard', 'wxOpenId', 'ddOpenId', 'nickName', 'sex', 'nation', 'education', 'workDescribe'],
            },
            other: {
              header: '其他',
              columns: ['passwordErrorLastTime', 'passwordErrorNum', 'passwordExpireTime', 'lastLoginTime', 'locked', 'createdTime'],
            },
          },
        },
      },
    },
  }
}

export function frontRules(_crudExpose: CrudExpose, _mode: ActionEnum): any {
  return {}
}
