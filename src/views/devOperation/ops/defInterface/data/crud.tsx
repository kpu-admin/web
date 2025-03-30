import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import {
  addRequest,
  delRequest,
  editRequest,
  infoRequest,
  pageRequest,
  removeFn,
} from '@/api/devOperation/ops/defInterface.ts'
import { RuleType } from '@/api/modules/common/formValidateService.ts'
import { InterfaceExecModeEnum } from '@/enums/common/base.ts'
import { RouteEnum } from '@/enums/common/tenant.ts'
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
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { compute } from '@fast-crud/fast-crud'
import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()
const scriptExtensions = [java(), oneDark]

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const loading = ref(false)
  const selectedIds = ref([] as string[])
  const router = useRouter()

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
        infoRequest,
      },
      form: {
        col: {
          span: 24,
        },
      },
      actionbar: {
        buttons: {
          add: {
            // show: hasPermission(RoleEnum.TENANT_OPS_INTERFACES_ADD)
          },
          ...deleteButton({
            crudExpose: props.crudExpose,
            selectedIds,
            removeFn,
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
        width: '250px',
        buttons: {

          edit: {
            // show: hasPermission(s.TENANT_OPS_INTERFACES_EDIT),
          },
          view: {
            dropdown: true,
          },
          remove: {
            // show: hasPermission(s.TENANT_OPS_INTERFACES_DELETE),
          },
          settings: {
            // icon: 'ant-design:setting-outlined',
            // show: hasPermission(RoleEnum.TENANT_OPS_INTERFACES_PROPERTY),
            type: 'link',
            text: '接口设置',
            click({ row }) {
              router.push({
                name: RouteEnum.BASIC_MSG_PROPERTY,
                params: {
                  id: row.id,
                },
                query: {
                  name: row.name,
                },
              })
            },
          },
          copy: {
            // show: hasPermission(s.TENANT_OPS_INTERFACES_ADD),
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        code: {
          title: $t('devOperation.ops.defInterface.code'),
          type: ['text'],
          search: {
            show: true,
          },
        },
        name: {
          title: $t('devOperation.ops.defInterface.name'),
          type: ['text'],
          search: {
            show: true,
          },
        },
        execMode: {
          title: $t('devOperation.ops.defInterface.execMode'),
          type: ['dict-radio'],
          dict: backendDict(DictEnum.EchoDictType_Base_INTERFACE_EXEC_MODE),
          search: {
            show: true,
          },
          addForm: {
            value: InterfaceExecModeEnum.IMPL_CLASS,
          },
          form: {
            helper: {
              text: '代码中由Spring管理的实现类',
            },
            component: {
              optionName: 'a-radio-button',
            },
          },
        },
        script: {
          title: $t('devOperation.ops.defInterface.script'),
          type: ['text'],
          form: {
            helper: {
              text: 'java/groovy 脚本',
            },
            show: compute(({ form }) => form.execMode === InterfaceExecModeEnum.SCRIPT),
            render: ({ form, mode }) => h(Codemirror, {
              'disabled': mode === 'view',
              'autofocus': true,
              'extensions': scriptExtensions,
              'indentWithTab': true,
              'style': {
                height: '200px',
              },
              'tabSize': 2,
              'modelValue': form.script,
              'onUpdate:modelValue': (val: any) => {
                form.script = val
              },
            }),
          },
          column: {
            show: false,
          },
        },
        implClass: {
          title: $t('devOperation.ops.defInterface.implClass'),
          type: ['text'],
          form: {
            show: compute(({ form }) => form.execMode === InterfaceExecModeEnum.IMPL_CLASS),
          },
          column: {
            show: false,
          },
        },
        state: {
          title: $t('devOperation.ops.defInterface.state'),
          type: ['dict-radio'],
          dict: STATE_CONSTANT_DICT,
          search: {
            show: true,
          },
          addForm: {
            value: true,
          },
          form: {
            component: {
              optionName: 'a-radio-button',
            },
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export const frontRules = {
  addForm: {
    rules: () => ({
      implClass: {
        type: RuleType.and,
        rules: [{
          trigger: 'blur',
          type: 'string',
          required: !0,
          message: '不能为空',
        }],
      },
      script: {
        type: RuleType.and,
        rules: [{
          trigger: 'blur',
          required: !0,
          type: 'string',
          message: '不能为空',
        }],
      },
    }),
  },
  editForm: {
    rules: () => ({
    }),
  },
}
