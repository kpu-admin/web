import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { ExtendedModalApi } from '@/ui/components/KpuModal/modal.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import { query,
} from '@/api/devOperation/ops/defInterface.ts'
import {
  addRequest,
  check,
  delRequest,
  editRequest,
  infoRequest,
  pageRequest,

  remove,
} from '@/api/devOperation/ops/extendMsgTemplate.ts'
import { RuleType } from '@/api/modules/common/formValidateService.ts'
import { MsgTemplateTypeEnum } from '@/enums/common/base.ts'
import { DictEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  backendDict,
  createdTimeColumn,
  deleteButton,
  indexColumn,
  STATE_CONSTANT_DICT,
  YES_NO_CONSTANT_DICT,
} from '@/plugins/fast-crud/common'
import { html } from '@codemirror/lang-html'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { compute, dict } from '@fast-crud/fast-crud'
import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()
const scriptExtensions = [java(), oneDark]
const contentExtensions = [html(), oneDark]

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
            // show: hasPermission(s.TENANT_OPS_TEMPLATE_ADD),
          },
          ...deleteButton({
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
          edit: {
            // show: hasPermission(T.TENANT_OPS_TEMPLATE_EDIT),
          },
          view: {
            dropdown: !0,
            // show: hasPermission(T.TENANT_OPS_TEMPLATE_VIEW),
          },
          remove: {
            dropdown: !0,
            // show: hasPermission(T.TENANT_OPS_TEMPLATE_DELETE),
          },
          copy: {
            // show: hasPermission(T.TENANT_OPS_TEMPLATE_ADD),
          },
          send: {
            order: -1,
            size: 'small',
            text: '测试发送',
            type: 'link',
            click(row) {
              const modelApi: ExtendedModalApi = props.context.modelApi()
              modelApi.setData(row.row)
              modelApi.open()
            },
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        type: {
          title: $t('devOperation.ops.defMsgTemplate.type'),
          type: 'dict-select',
          dict: backendDict(DictEnum.EchoDictType_Base_MSG_TEMPLATE_TYPE),
          search: {
            show: !0,
          },
          column: {
            width: 120,
          },
        },
        interfaceId: {
          title: '关联接口',
          type: 'dict-select',
          dict: dict({
            getData: query,
            label: 'name',
            value: 'id',
          }),
          search: {
            show: !0,
          },
          column: {
            show: !1,
          },
        },
        state: {
          title: $t('devOperation.ops.defMsgTemplate.state'),
          type: ['dict-radio'],
          dict: STATE_CONSTANT_DICT,
          search: {
            show: !0,
          },
          addForm: {
            value: !0,
          },
          column: {
            width: 120,
          },
          form: {
            component: {
              optionName: 'a-radio-button',
            },
          },
        },
        code: {
          title: $t('devOperation.ops.defMsgTemplate.code'),
          type: 'text',
          search: {
            show: !0,
          },
        },
        name: {
          title: $t('devOperation.ops.defMsgTemplate.name'),
          type: 'text',
          search: {
            show: !0,
          },
        },
        title: {
          title: $t('devOperation.ops.defMsgTemplate.title'),
          type: 'text',
          column: {
            show: !1,
          },
        },
        content: {
          title: $t('devOperation.ops.defMsgTemplate.content'),
          type: 'text',
          form: {
            col: {
              span: 24,
            },
            render: e => h(Codemirror, {
              'autofocus': !0,
              'extensions': contentExtensions,
              'indentWithTab': !0,
              'style': {
                height: '200px',
              },
              'tabSize': 2,
              'placeholder': 'groovy 脚本',
              'modelValue': e.form.content,
              'onUpdate:modelValue': (a) => {
                e.form.content = a
              },
            }),
          },
          column: {
            show: !1,
          },
        },
        script: {
          title: $t('devOperation.ops.defMsgTemplate.script'),
          type: 'text',
          form: {
            col: {
              span: 24,
            },
            render: e => h(Codemirror, {
              'autofocus': !0,
              'placeholder': 'Freemarker 脚本',
              'extensions': scriptExtensions,
              'indentWithTab': !0,
              'style': {
                height: '200px',
              },
              'tabSize': 2,
              'modelValue': e.form.script,
              'onUpdate:modelValue': (a) => {
                e.form.script = a
              },
            }),
          },
          column: {
            show: !1,
          },
        },
        remarks: {
          title: $t('devOperation.ops.defMsgTemplate.remarks'),
          type: ['textarea'],
          form: {
            col: {
              span: 24,
            },
          },
          column: {
            show: !1,
          },
        },
        sign: {
          title: $t('devOperation.ops.defMsgTemplate.sign'),
          type: 'text',
          form: {
            show: compute(e => e.form.type === MsgTemplateTypeEnum.SMS),
          },
          column: {
            show: !1,
          },
        },
        templateCode: {
          title: $t('devOperation.ops.defMsgTemplate.templateCode'),
          type: 'text',
          form: {
            show: compute(e => e.form.type === MsgTemplateTypeEnum.SMS),
          },
          column: {
            show: !1,
          },
        },
        target: {
          title: $t('devOperation.ops.defMsgTemplate.target'),
          type: ['dict-radio'],
          dict: backendDict(DictEnum.EchoDictType_Base_NOTICE_TARGET),
          column: {
            show: !1,
          },
          form: {
            show: compute(e => e.form.type === MsgTemplateTypeEnum.NOTICE),
            component: {
              optionName: 'a-radio-button',
            },
          },
        },
        autoRead: {
          title: $t('devOperation.ops.defMsgTemplate.autoRead'),
          type: ['dict-radio'],
          dict: YES_NO_CONSTANT_DICT,
          addForm: {
            value: !0,
          },
          form: {
            show: compute(e => e.form.type === MsgTemplateTypeEnum.NOTICE),
            component: {
              optionName: 'a-radio-button',
            },
          },
          column: {
            show: !1,
          },
        },
        remindMode: {
          title: $t('devOperation.ops.defMsgTemplate.remindMode'),
          type: ['dict-radio'],
          dict: backendDict(DictEnum.EchoDictType_Base_NOTICE_REMIND_MODE),
          form: {
            show: compute(e => e.form.type === MsgTemplateTypeEnum.NOTICE),
            component: {
              optionName: 'a-radio-button',
            },
          },
          column: {
            show: !1,
          },
        },
        url: {
          title: $t('devOperation.ops.defMsgTemplate.url'),
          type: 'text',
          form: {
            show: compute(e => e.form.type === MsgTemplateTypeEnum.NOTICE),
          },
          column: {
            show: !1,
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export function frontRules(_crudExpose: CrudExpose, _mode: ActionEnum): any {
  return {
    code: {
      type: RuleType.and,
      rules: [{
        trigger: 'blur',
        required: !0,
        asyncValidator: async (_e: any, a: any) => {
          if (a) {
            const { getFormData } = _crudExpose
            if (await check(a, getFormData()?.id)) {
              throw new Error('该值已经存在')
            }
          }
        },
      }],
    },
    remindMode: {
      type: RuleType.and,
      rules: [{
        trigger: 'blur',
        required: !0,
        message: '这是必填项',
      }],
    },
    autoRead: {
      type: RuleType.and,
      rules: [{
        trigger: 'blur',
        required: !0,
        type: 'boolean',
        message: '这是必填项',
      }],
    },
    target: {
      type: RuleType.and,
      rules: [{
        trigger: 'blur',
        required: !0,
        message: '这是必填项',
      }],
    },
    templateCode: {
      type: RuleType.and,
      rules: [{
        trigger: 'blur',
        required: !0,
        message: '这是必填项',
      }],
    },
    sign: {
      type: RuleType.and,
      rules: [{
        trigger: 'blur',
        required: !0,
        message: '这是必填项',
      }],
    },
  }
}
