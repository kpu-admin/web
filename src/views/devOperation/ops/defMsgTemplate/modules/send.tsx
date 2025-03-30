import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { CreateCrudOptionsRet } from '@fast-crud/fast-crud'

import { sendByTemplateRequest } from '@/api/basic/msg/extendMsg.ts'
// import { usePermission } from '@/hooks/web/usePermission'

import { RuleType } from '@/api/modules/common/formValidateService.ts'
import RecipientList from '@/views/devOperation/ops/defMsgTemplate/modules/recipient-list.vue'
import ParamList from './param-list.vue'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()

export function createCrudOptions(): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        addRequest: sendByTemplateRequest,
      },
      form: {
        mode: 'add',
      },
      columns: {
        code: {
          title: '标识',
          type: 'text',
          form: {
            component: {
              readonly: !0,
            },
          },
        },
        title: {
          title: '标题',
          type: 'text',
          form: {
            component: {
              readonly: !0,
            },
          },
        },
        name: {
          title: '模版名称',
          type: 'text',
          form: {
            component: {
              readonly: !0,
            },
          },
        },
        bizId: {
          title: '业务id',
          type: 'text',
        },
        bizType: {
          title: '业务类型',
          type: 'text',
        },
        author: {
          title: '发布人姓名',
          type: 'text',
        },
        paramList: {
          title: '参数',
          type: 'text',
          form: {
            col: {
              span: 24,
            },
            render: data => h(ParamList, {
              'value': data.form.param,
              'onUpdate:value': (value) => {
                data.form.paramList = value
              },
            }),
          },
        },
        recipientList: {
          title: '接收人',
          type: 'text',
          form: {
            col: {
              span: 24,
            },
            render: (data) => {
              return h(RecipientList, {
                'value': data.form?.recipientList,
                'onUpdate:value': (value) => {
                  data.form.recipientList = value
                },
              })
            },
          },
        },
      },
    },
  }
}

export function frontRules(_mode: ActionEnum): any {
  return {
    paramList: {
      type: RuleType.and,
      rules: [{
        trigger: 'blur',
        type: 'array',
        asyncValidator: async (_t: any, e: any) => {
          if (e) {
            for (const o in e) {
              if (!e[o].key) {
                throw new Error(`第${Number(o) + 1}行未填写参数名称`)
              }
              if (!e[o].value) {
                throw new Error(`第${Number(o) + 1}行未填写参数值`)
              }
            }
          }
        },
      }],
    },
    recipientList: {
      type: RuleType.cover,
      rules: [{
        trigger: 'blur',
        type: 'array',
        asyncValidator: async (_t: any, e: any) => {
          if (e) {
            for (const o in e) {
              if (!e[o].recipient) {
                throw new Error(`第${Number(o) + 1}行未填写接收人`)
              }
              if (!e[o].ext) {
                throw new Error(`第${Number(o) + 1}行未填写扩展信息`)
              }
            }
          }
          else {
            throw new Error('请至少填写1个接收人')
          }
        },
      }],
    },
  }
}
