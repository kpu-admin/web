import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import type { Rule } from 'ant-design-vue/es/form'
import { resetRequest } from '@/api/devOperation/tenant/defUser.ts'
import { RuleType } from '@/api/modules/common/formValidateService.ts'
import { $t } from '@/locales'
import { YES_NO_CONSTANT_DICT } from '@/plugins/fast-crud/common.ts'
import { compute } from '@fast-crud/fast-crud'

export function createCrudOptions(_props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        addRequest: resetRequest,
      },
      form: {
        mode: 'add',
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: {
            show: !1,
          },
        },
        isUseSystemPassword: {
          title: '使用系统内置密码',
          type: ['dict-radio'],
          dict: YES_NO_CONSTANT_DICT,
          form: {
            col: {
              span: 24,
            },
            value: !0,
            component: {
              optionName: 'a-radio-button',
            },
          },
        },
        password: {
          title: $t('devOperation.tenant.defUser.password'),
          type: ['password'],
          form: {
            col: {
              span: 24,
            },
            show: compute(({ form }) => !form.isUseSystemPassword),
            component: {
              autocomplete: 'new-password',
            },
          },
        },
        confirmPassword: {
          title: '确认密码',
          type: ['password'],
          form: {
            col: {
              span: 24,
            },
            show: compute(({ form }) => !form.isUseSystemPassword),
            component: {
              autocomplete: 'off',
            },
          },
        },
      },
    },
  }
}
export function frontRules(crudExpose: Ref<CrudExpose>): any {
  return {
    password: {
      type: RuleType.and,
      rules: [{
        required: !0,
        message: '请输入密码',
      }],
    },
    confirmPassword: {
      type: RuleType.and,
      rules: [{
        required: !0,
        message: '请输入确认密码',
      }, {
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
