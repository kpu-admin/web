import type { FormSchemaExt } from '@/api/modules/common/formValidateServiceKpu'
import type { ActionEnum } from '@/enums/commonEnum'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import {
  addRequest,
  editRequest,
} from '@/api/basic/user/baseOrg.ts'
import { DictEnum } from '@/enums/commonEnum'
// import { usePermission } from '@/hooks/web/usePermission';
import {
  backendDict,
} from '@/plugins/fast-crud/common'

// const { hasPermission } = usePermission();
export function createCrudOptions(_props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        addRequest,
        editRequest,
      },
      form: {
        col: {
          span: 24,
        },
        labelCol: {
          span: null,
          style: {
            minWidth: '80px',
          },
        },
      },
      addForm: {
        mode: 'add',
      },
      editForm: {
        mode: 'edit',
      },
      columns: {
        id: {
          title: 'id',
          form: {
            show: !1,
          },
          type: 'text',
        },
        parentId: {
          title: '父ID',
          type: 'text',
          form: {
            show: !1,
          },
        },
        parentName: {
          title: '父节点',
          type: 'text',
          form: {
            component: {
              disabled: !0,
            },
            value: '根节点',
          },
        },
        name: {
          title: '名称',
          type: 'text',
        },
        type: {
          title: '类型',
          type: 'dict-radio',
          dict: backendDict(DictEnum.ORG_TYPE),
          form: {
            component: {
              optionName: 'a-radio-button',
            },
          },
        },
        shortName: {
          title: '简称',
          type: 'text',
        },
        sortValue: {
          title: '排序',
          type: 'number',
        },
        state: {
          title: '状态',
          type: 'text',
          addForm: {
            value: !0,
          },
          form: {
            component: {
              name: 'a-switch',
              vModel: 'checked',
              checkedValue: !0,
              unCheckedValue: !1,
            },
          },
        },
        remarks: {
          title: '备注',
          type: 'textarea',
        },
      },
    },
  }
}
export function frontRules(_crudExpose: Ref<CrudExpose>, _mode?: ActionEnum): FormSchemaExt {
  return {
  }
}
