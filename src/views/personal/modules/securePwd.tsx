import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import type { Rule } from 'ant-design-vue/es/form'
import { RuleType } from '@/api/modules/common/formValidateService.ts'
import { updatePasswordRequest } from '@/api/modules/profile/userInfo.ts'
import { $t } from '@/locales'

export function createCrudOptions(_props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        addRequest: updatePasswordRequest,
      },
      form: {
        mode: 'add',
        col: {
          span: 24,
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: {
            show: !1,
          },
        },
        oldPassword: {
          title: '当前密码',
          type: 'password',
          form: {
            component: {
              'autocomplete': 'new-password',
              'show-password-on': 'click',
            },
          },
        },
        password: {
          title: $t('devOperation.tenant.defUser.password'),
          type: 'password',
          form: {
            component: {
              'autocomplete': 'new-password',
              'show-password-on': 'click',
            },
          },
        },
        confirmPassword: {
          title: '确认密码',
          type: 'password',
          form: {
            component: {
              'autocomplete': 'off',
              'show-password-on': 'click',
            },
          },
        },
      },
    },
  }
}
export function frontRules(crudExpose: Ref<CrudExpose>): any {
  return {
    confirmPassword: {
      type: RuleType.and,
      rules: [{
        trigger: ['blur', 'change'],
        type: 'string',
        asyncValidator: async (_rule: Rule, value: string, callback: any) => {
          if (value) {
            const { getFormData } = crudExpose.value
            const data = await getFormData()
            if (value !== data.password) {
              return callback('2次密码不一致')
            }
          }
          return callback()
        },
      }],
    },
  }
}
