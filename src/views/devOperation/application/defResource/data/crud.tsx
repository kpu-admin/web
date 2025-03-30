import type { FormSchemaExt } from '@/api/modules/common/formValidateServiceKpu'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import {
  addRequest,
  check,
  checkName,
  checkPath,
  editRequest,
} from '@/api/devOperation/application/defResource'
import { RuleType } from '@/api/modules/common/formValidateServiceKpu'
import { DataScopeEnum, ResourceOpenWithEnum, ResourceTypeEnum, TenantConnectTypeEnum } from '@/enums/common/tenant'
import { ActionEnum, DictEnum } from '@/enums/commonEnum'
// import { usePermission } from '@/hooks/web/usePermission';
import { $t } from '@/locales'
import {
  backendDict,
  STATE_CONSTANT_DICT,
  YES_NO_CONSTANT_DICT,
} from '@/plugins/fast-crud/common'
import KpuIconPicker from '@/ui/components/KpuIconPicker/index.vue'
import { isUrl } from '@/utils'
import MetaJson from '@/views/devOperation/application/defResource/data/meta/MetaJson.vue'
import { compute } from '@fast-crud/fast-crud'
import { Input } from 'ant-design-vue'
import ResourceApi from './api/ResourceApi.vue'

// const { hasPermission } = usePermission();
const inputComponent = h(Input)

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        addRequest,
        editRequest,
      },
      addForm: {
        mode: 'add',
      },
      editForm: {
        mode: 'edit',
      },
      form: {
        group: {
          type: 'tabs',
          accordion: false,
          displayDirective: 'show',
          triggerAreas: ['arrow'],
          groups: {
            base: {
              header: '基础信息',
              columns: ['resourceType', 'parentName', 'code', 'name', 'icon', 'sortValue', 'state', 'isGeneral'],
            },
            feature: {
              header: '特性信息',
              columns: ['openWith', 'isHidden', 'path', 'component', 'redirect', 'subGroup', 'dataScope', 'isDef', 'customClass', 'fieldIsSecret', 'fieldIsEdit', 'resourceApiList'],
            },
            extend: {
              header: '扩展信息',
              columns: ['metaJson', 'describe'],
            },
          },
        },
      },
      columns: {
        id: {
          title: 'id',
          form: {
            show: false,
          },
          type: 'text',
        },
        applicationId: {
          title: $t('devOperation.application.defResource.applicationId'),
          form: {
            show: false,
          },
          type: 'text',
        },
        parentId: {
          title: 'parentId',
          form: {
            show: false,
          },
          type: 'text',
        },
        resourceType: {
          title: $t('devOperation.application.defResource.resourceType'),
          dict: backendDict(DictEnum.RESOURCE_TYPE),
          form: {
            helper: {
              position: 'label',
              text: `菜单:左侧显示的菜单或隐藏的菜单
数据：数据权限`,
            },
          },
          type: 'dict-radio',
        },
        parentName: {
          title: '上级节点',
          type: 'text',
          form: {
            component: {
              disabled: true,
            },
            value: '根节点',
          },
        },
        code: {
          title: $t('devOperation.application.defResource.code'),
          type: 'text',
          form: {
            helper: {
              position: 'label',
              text: `编码规则：按层级结构编码，使用:作为分隔符
建议以view、add、edit、delete、export、import、download、upload等关键词结尾`,
            },
          },
        },
        name: {
          title: $t('devOperation.application.defResource.name'),
          type: 'text',
        },
        icon: {
          title: $t('devOperation.application.defResource.icon'),
          type: 'text',
          form: {
            render: ({ form }) => {
              return h(KpuIconPicker, {
                inputComponent,
                'iconSlot': 'addonAfter',
                'modelValueProp': 'value',
                'modelValue': form.icon,
                'disabled': props.context.type.value === ActionEnum.VIEW,
                'onUpdate:modelValue': (value: any) => form.icon = value,
              })
            },
          },
        },
        sortValue: {
          title: $t('devOperation.application.defResource.sortValue'),
          form: {
            component: {
              disabled: true,
            },
          },
          type: 'number',
        },
        state: {
          title: $t('devOperation.application.defResource.state'),
          dict: STATE_CONSTANT_DICT,
          addForm: {
            value: true,
          },
          type: 'dict-radio',
        },
        isGeneral: {
          title: $t('devOperation.application.defResource.isGeneral'),
          dict: YES_NO_CONSTANT_DICT,
          type: 'dict-radio',
        },
        openWith: {
          title: $t('devOperation.application.defResource.openWith'),
          dict: backendDict(DictEnum.RESOURCE_OPEN_WITH),
          type: 'dict-radio',
          form: {
            helper: {
              position: 'label',
              text: `组件：在框架内打开组件页面
内链：在框架内打开网页地址
外链：新开窗口打开网页地址`,
            },
            show: compute(({ form }) => [ResourceTypeEnum.MENU].includes(form.resourceType)),
            valueChange({ form, value }) {
              switch (value) {
                case ResourceOpenWithEnum.INNER_CHAIN:
                  break
                case ResourceOpenWithEnum.OUTER_CHAIN:
                  form.component = 'IFRAME'
                  break
              }
            },
          },
        },
        isHidden: {
          title: $t('devOperation.application.defResource.isHidden'),
          dict: YES_NO_CONSTANT_DICT,
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.MENU].includes(form.resourceType)),
          },
          type: 'dict-radio',
        },
        path: {
          title: $t('devOperation.application.defResource.path'),
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.MENU].includes(form.resourceType)),
            valueChange({ form, value }) {
              if (value && isUrl(value)) {
                form.component = 'IFRAME'
                form.openWith = ResourceOpenWithEnum.OUTER_CHAIN
              }
            },
          },
          type: 'text',
        },
        component: {
          title: $t('devOperation.application.defResource.component'),
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.MENU].includes(form.resourceType)),
            valueChange({ form, value }) {
              if (value && isUrl(value)) {
                form.openWith = ResourceOpenWithEnum.INNER_CHAIN
              }
            },
            component: {
              disabled: compute(({ form }) => [ResourceOpenWithEnum.OUTER_CHAIN].includes(form.openWith)),
            },
          },
          type: 'text',
        },
        redirect: {
          title: $t('devOperation.application.defResource.redirect'),
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.MENU].includes(form.resourceType)),
          },
          type: 'text',
        },
        subGroup: {
          title: $t('devOperation.application.defResource.subGroup'),
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.MENU].includes(form.resourceType)),
          },
          type: 'text',
        },
        dataScope: {
          title: $t('devOperation.application.defResource.dataScope'),
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.DATA].includes(form.resourceType)),
            col: {
              span: 24,
            },
          },
          type: 'dict-radio',
          dict: backendDict(DictEnum.RESOURCE_DATA_SCOPE),
        },
        isDef: {
          title: $t('devOperation.application.defResource.isDef'),
          dict: YES_NO_CONSTANT_DICT,
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.DATA].includes(form.resourceType)),
            col: {
              span: compute(({ form }) => form.dataScope === TenantConnectTypeEnum.CUSTOM ? 12 : 24),
            },
          },
          type: 'dict-radio',
        },
        customClass: {
          title: $t('devOperation.application.defResource.customClass'),
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.DATA].includes(form.resourceType) && form.dataScope === TenantConnectTypeEnum.CUSTOM),
            component: {
              placeholder: '以"DATA_SCOPE_"为前缀的自定义实现类',
            },
          },
          type: 'text',
        },
        fieldIsSecret: {
          title: $t('devOperation.application.defResource.fieldIsSecret'),
          dict: YES_NO_CONSTANT_DICT,
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.FIELD].includes(form.resourceType)),
          },
          type: 'dict-radio',
        },
        fieldIsEdit: {
          title: $t('devOperation.application.defResource.fieldIsEdit'),
          dict: YES_NO_CONSTANT_DICT,
          form: {
            show: compute(({ form }) => [ResourceTypeEnum.FIELD].includes(form.resourceType)),
          },
          type: 'dict-radio',
        },
        resourceApiList: {
          title: '接口',
          form: {
            col: {
              span: 24,
            },
            show: compute(({ form }) => [ResourceTypeEnum.MENU, ResourceTypeEnum.FUNCTION].includes(form.resourceType)),
            component: {
              name: ResourceApi,
              props: {
                mode: props.context.type,
              },
            },
          },
          type: 'text',
        },
        metaJson: {
          title: $t('devOperation.application.defResource.metaJson'),
          form: {
            col: {
              span: 24,
            },
            component: {
              name: MetaJson,
              props: {
                mode: props.context.type,
              },
            },
          },
          type: 'text',
        },
        describe: {
          title: $t('devOperation.application.defResource.describe'),
          addForm: {},
          form: {
            col: {
              span: 24,
            },
            component: { showWordLimit: true, maxlength: 200 },
          },

          column: {
            ellipsis: true,
          },
          type: 'textarea',
        },
      },
    },
  }
}

const CODE_REG = /^[\w:,;*]*$/

export function frontRules(crudExpose: Ref<CrudExpose>, _mode?: ActionEnum): FormSchemaExt {
  return {
    code: {
      type: RuleType.append,
      rules: [{
        trigger: ['blur', 'change'],
        type: 'string',
        validator: async (_, value) => {
          if (value) {
            const { getFormData } = crudExpose.value
            const model = await getFormData()
            if (!CODE_REG.test(value)) {
              throw new Error('编码只能包括: [英文大小写][数字][_][;][,][:][*]')
            }
            if (await check(value, model.id)) {
              throw new Error('编码已经存在')
            }
          }
        },
      }],
    },
    resourceType: {
      type: RuleType.append,
      rules: [{
        trigger: ['blur', 'change'],
        type: 'string',
        validator: async (_, value) => {
          if (value) {
            const { getFormData } = crudExpose.value
            const model = await getFormData()
            if (model?.parentId === '0' || !(model?.parentId)) {
              if (value === ResourceTypeEnum.DATA) {
                throw new Error('数据权限必须挂载在菜单下')
              }
            }
            else if (value === ResourceTypeEnum.MENU) {
              if (ResourceTypeEnum.MENU !== (model?.parentResourceType)) {
                throw new Error($t('菜单只能挂载在菜单下级'))
              }
              if (model?.parentIsHidden) {
                throw new Error('菜单不能挂载在隐藏菜单下级')
              }
            }
            if ((model?.parentResourceType) === ResourceTypeEnum.FUNCTION) {
              if (value === ResourceTypeEnum.MENU) {
                throw new Error('按钮下不能添加菜单')
              }
              if (value === ResourceTypeEnum.DATA) {
                throw new Error($t('按钮下不能添加数据'))
              }
            }
            else if ((model?.parentResourceType) === ResourceTypeEnum.FIELD) {
              throw new Error('字段下不能添加子资源')
            }
          }
        },
      }],
    },
    name: {
      type: RuleType.append,
      rules: [{
        trigger: ['blur', 'change'],
        type: 'string',
        validator: async (_, value) => {
          if (value) {
            const { getFormData } = crudExpose.value
            const model = await getFormData()
            if ([ResourceTypeEnum.MENU].includes(model.resourceType) && await checkName(value, model.applicationId, model?.id)) {
              throw new Error(`${$t('devOperation.application.defResource.name')}已经存在`)
            }
          }
        },
      }],
    },
    path: {
      type: RuleType.append,
      rules: [{
        trigger: ['blur', 'change'],
        type: 'string',
        required: true,
        validator: async (_, value) => {
          if (value) {
            const { getFormData } = crudExpose.value
            const model = await getFormData()
            if (isUrl(value)) {
              if (isUrl(model?.component)) {
                throw new Error(`${$t('devOperation.application.defResource.path')}和${$t('devOperation.application.defResource.component')}不能同时配置成url`)
              }
              if (![ResourceOpenWithEnum.OUTER_CHAIN].includes(model.openWith)) {
                throw new Error(`${$t('devOperation.application.defResource.path')}是url时，${$t('devOperation.application.defResource.openWith')}必须是外链`)
              }
            }
            else {
              if (model.openWith === ResourceOpenWithEnum.OUTER_CHAIN) {
                throw new Error(`${$t('devOperation.application.defResource.openWith')} 为外链时，只能填写url`)
              }
              if ((model?.parentId) === '0' && !value.startsWith('/')) {
                throw new Error(`1级资源的${$t('devOperation.application.defResource.path')}必须以/开头`)
              }
              if (await checkPath(value, model.applicationId, model?.id)) {
                throw new Error(`${$t('devOperation.application.defResource.path')}已经存在`)
              }
            }
          }
          else {
            throw new Error(`请输入${$t('devOperation.application.defResource.path')}`)
          }
        },
      }],
    },
    component: {
      type: RuleType.append,
      rules: [{
        trigger: ['blur', 'change'],
        type: 'string',
        required: true,
        validator: async (_, value) => {
          if (value) {
            const { getFormData } = crudExpose.value
            const model = await getFormData()
            if (isUrl(value)) {
              if (isUrl(model?.path)) {
                throw new Error(`${$t('devOperation.application.defResource.path')}和${$t('devOperation.application.defResource.component')}不能同时配置成url`)
              }
              if (model.openWith !== ResourceOpenWithEnum.INNER_CHAIN) {
                throw new Error(`配置为url时，${$t('devOperation.application.defResource.openWith')}必须设置为内链`)
              }
            }
            else if (model.openWith === ResourceOpenWithEnum.INNER_CHAIN) {
              throw new Error(`${$t('devOperation.application.defResource.openWith')} 为内链时，只能填写url`)
            }
          }
          else {
            throw new Error(`请输入${$t('devOperation.application.defResource.component')}`)
          }
        },
      }],
    },
    customClass: {
      type: RuleType.append,
      rules: [{
        trigger: ['blur', 'change'],
        type: 'string',
        required: true,
        validator: async (_, value) => {
          const { getFormData } = crudExpose.value
          const model = await getFormData()
          if (model.dataScope === DataScopeEnum.CUSTOM && !value) {
            throw new Error('不能为空')
          }
        },
      }],
    },
  }
}
