import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import { addRequest, delRequest, editRequest, infoRequest, pageRequest, remove } from '@/api/basic/msg/extendMsg.ts'
import { pageRequest as employeePageRequest, findByIds } from '@/api/basic/user/baseEmployee.ts'

import { tree } from '@/api/basic/user/baseOrg.ts'
import { query } from '@/api/basic/user/basePosition.ts'
import { RuleType } from '@/api/modules/common/formValidateServiceKpu.ts'
import { asyncFindUrlById } from '@/api/modules/file/upload.ts'
import { MsgTemplateTypeEnum, SourceTypeEnum } from '@/enums/common/base.ts'
import { ActionEnum, DictEnum, FileBizTypeEnum, FileBucketEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  backendDict,
  createdTimeColumn,
  deleteButton,
  indexColumn,
  STATE_CONSTANT_DICT,
} from '@/plugins/fast-crud/common'
import dayjs from '@/utils/dayjs.ts'
import { isEmpty } from '@/utils/inference.ts'
import { dict } from '@fast-crud/fast-crud'
import { ref } from 'vue'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()
function recipientListForm() {
  return {
    crudOptions: {
      container: {
        is: 'fs-layout-default',
      },
      request: {
        pageRequest: employeePageRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: !1,
          },
        },
      },
      rowHandle: {
        show: !1,
      },
      columns: {
        realName: {
          title: $t('basic.user.baseEmployee.realName'),
          type: ['text'],
          search: {
            show: !0,
          },
        },
        positionId: {
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
        orgIdList: {
          title: '所属部门',
          column: {
            component: {
              type: 'text',
            },
          },
          type: 'dict-tree',
          dict: dict({
            isTree: !0,
            value: 'id',
            label: 'name',
            async getData() {
              return await tree({})
            },
          }),
        },
        positionStatus: {
          title: $t('basic.user.baseEmployee.positionStatus'),
          type: ['dict-radio'],
          dict: backendDict(DictEnum.POSITION_STATUS),
          search: {
            show: !0,
          },
        },
        state: {
          title: $t('basic.user.baseEmployee.state'),
          type: ['dict-radio'],
          dict: STATE_CONSTANT_DICT,
          search: {
            show: !0,
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}
export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const loading = ref(false)
  const selectedIds = ref([] as string[])
  const { push } = useRouter()
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
            show: true,
            text: '发布',
            click() {
              push({
                name: '消息中_消息管理_发布消息',
                params: {
                  type: ActionEnum.ADD,
                  id: '0',
                },
              })
            },
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
            show: !1,
          },
          copy: {
            show: !1,
            click({ row }) {
              push({
                name: '消息中_消息管理_发布消息',
                params: {
                  type: ActionEnum.COPY,
                  id: row.id,
                },
              })
            },
          },
          view: {
            // show
            click({ row }) {
              push({
                name: '消息中_消息管理_发布消息',
                params: {
                  type: ActionEnum.VIEW,
                  id: row.id,
                },
              })
            },
          },
        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        channel: {
          title: $t('basic.msg.extendMsg.channel'),
          type: 'text',
          form: {
            show: !1,
            component: {
              value: SourceTypeEnum.APP,
            },
          },
          column: {
            show: !1,
          },
        },
        type: {
          title: $t('basic.msg.extendMsg.type'),
          type: 'text',
          form: {
            show: !1,
            component: {
              value: MsgTemplateTypeEnum.NOTICE,
            },
          },
          column: {
            show: !1,
          },
        },
        status: {
          title: $t('basic.msg.extendMsg.status'),
          type: ['dict-radio'],
          dict: backendDict({
            type: 'TaskStatus',
            isEnum: !0,
          }),
          search: {
            show: !0,
          },
          form: {
            show: !1,
          },
          column: {
            width: 100,
            show: !0,
          },
        },
        title: {
          title: $t('basic.msg.extendMsg.title'),
          type: ['text'],
          search: {
            show: !0,
          },
        },
        author: {
          title: $t('basic.msg.extendMsg.author'),
          type: ['text'],
          column: {
            width: 150,
          },
          search: {
            show: !0,
          },
        },
        remindMode: {
          title: $t('basic.msg.extendMsg.remindMode'),
          type: ['dict-radio'],
          dict: backendDict('NOTICE_REMIND_MODE'),
          form: {
            component: {
              optionName: 'a-radio-button',
            },
          },
          search: {
            show: !0,
          },
          column: {
            width: 100,
          },
        },
        recipientList: {
          title: '接收人',
          type: ['table-select'],
          dict: dict({
            value: 'id',
            label: 'realName',
            getNodesByValues: async (ids) => {
              return await findByIds(ids)
            },
          }),
          form: {
            component: {
              multiple: !0,
              createCrudOptions: recipientListForm,
              crudOptionsOverride: {
                table: {
                  scroll: {
                    x: 2e3,
                  },
                },
                rowHandle: {
                  fixed: 'right',
                },
              },
            },
          },
          column: {
            show: !1,
          },
        },
        content: {
          title: $t('basic.msg.extendMsg.content'),
          type: ['editor-wang5'],
          form: {
            col: {
              span: 24,
            },
            component: {
              id: '1',
              config: {},
              toolbarConfig: {},
              uploader: {
                type: 'form',
                param: {
                  bucket: FileBucketEnum.public,
                  bizType: FileBizTypeEnum.EXTEND_MSG_CONTENT,
                },
                buildUrl: async (file: any) => {
                  return file.file ? null : (await asyncFindUrlById(file.url)).data
                },
              },
            },
          },
          column: {
            show: !1,
          },
        },
        sendTime: {
          title: $t('basic.msg.extendMsg.sendTime'),
          type: ['datetime'],
          form: {
            component: {
              'format': 'YYYY-MM-DD HH:mm:ss',
              'valueFormat': 'YYYY-MM-DD HH:mm:ss',
              'disabled-date': (val: any) => val < dayjs().startOf('day'),
            },
          },
          valueBuilder({ value: s, row: c, key: d }) {
            s !== null && (c[d] = s)
          },
          column: {
            show: !0,
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export function frontRules(): any {
  return {
    recipientList: {
      type: RuleType.cover,
      rules: [{
        trigger: 'blur',
        required: true,
        type: 'array',
        message: '请选择接收人',
      }],
    },
    content: {
      type: RuleType.cover,
      rules: [{
        trigger: 'blur',
        required: !0,
        type: 'string',
        validator: (_rule: any, value: string, callback: any) => value === '<p><br></p>' ? callback('请填写发送内容') : callback(),
      }],
    },
    sendTime: {
      type: RuleType.cover,
      rules: [{
        trigger: 'blur',
        validator: (_rule: any, value: string, callback: any) => isEmpty(value) || dayjs(value) > dayjs().add(10, 'm') ? callback() : callback('定时发送时间至少在10分钟以后'),
      }],
    },
  }
}
