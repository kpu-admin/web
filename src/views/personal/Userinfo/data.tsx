import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import { asyncFindUrlById } from '@/api/modules/file/upload.ts'
import { updateBaseInfoRequest } from '@/api/modules/profile/userInfo.ts'
import { DictEnum, FileBizTypeEnum } from '@/enums/commonEnum.ts'
import { backendDict } from '@/plugins/fast-crud/common.ts'

export function createCrudOptions(_props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        addRequest: updateBaseInfoRequest,
      },
      form: {
        display: 'grid',
        mode: 'add',
        col: {
          style: {
            gridColumn: 'span 2',
          },
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
        username: {
          title: '账号',
          type: 'text',
          form: {
            col: {
              style: {
                gridColumn: 'span 1',
              },
            },
            render: ({ form }) => (<fs-copyable modelValue={form.username} onUpdate:modelValue={(val: any) => form.username = val} />),

          },
        },
        email: {
          title: '邮箱',
          type: 'text',
          form: {
            col: {
              style: {
                gridColumn: 'span 1',
              },
            },
            render: ({ form }) => (<fs-copyable modelValue={form.email} onUpdate:modelValue={(val: any) => form.email = val} />),

          },
        },
        logo: {
          title: '头像',
          type: 'cropper-uploader',
          form: {
            col: {
              style: {
                gridRow: '1/3',
                gridColumn: '1/2',
              },
            },
            component: {
              valueType: 'key',
              buildUrl: async (id: any) => {
                return (await asyncFindUrlById(id)).data
              },
              uploader: {
                param: {
                  bizType: FileBizTypeEnum.BASE_USER_AVATAR,
                },
              },
            },
          },
        },
        mobile: {
          title: '手机',
          type: 'text',
          form: {
            render: ({ form }) => (<fs-copyable modelValue={form.mobile} onUpdate:modelValue={(val: any) => form.mobile = val} />),
          },
        },
        idCard: {
          title: '身份证号',
          type: 'text',
        },
        nickName: {
          title: '昵称',
          type: 'text',
        },
        sex: {
          title: '性别',
          type: ['dict-radio'],
          dict: backendDict(DictEnum.GLOBAL_SEX),
          form: {
            component: {
              optionName: 'a-radio-button',
            },
          },
        },
        nation: {
          title: '民族',
          type: ['dict-select'],
          dict: backendDict(DictEnum.NATION),
        },
        education: {
          title: '学历',
          type: ['dict-select'],
          dict: backendDict(DictEnum.EDUCATION),
        },
        workDescribe: {
          title: '个人简介',
          type: 'textarea',
        },
      },
    },
  }
}

export function frontRules(): any {
  return {}
}
