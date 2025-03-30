import type { DropMenu } from '@/components/Dropdown/typing.ts'
import type { ActionEnum } from '@/enums/commonEnum.ts'
import type { CreateCrudOptionsProps, CreateCrudOptionsRet, CrudExpose } from '@fast-crud/fast-crud'
import {
  delRequest,
  infoRequest,
  pageRequest,
  removeFn,
} from '@/api/basic/system/baseOperationLog.ts'
import { JsonViewer } from '@/components/JsonViewer/index.ts'
import { EnumEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
// import { usePermission } from '@/hooks/web/usePermission'
import {
  backendDict,
  createdTimeColumn,
  deleteButton,
  indexColumn,
} from '@/plugins/fast-crud/common'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { Badge } from 'ant-design-vue'
import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
// import type { FormRulesExt } from '@/service/fetch';

// const { hasPermission } = usePermission()
const exDetailExtensions = [html(), oneDark]
export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const loading = ref(false)
  const selectedIds = ref([] as string[])
  // 定义阈值和状态的映射数组
  const thresholdStatusMap = [
    {
      threshold: 100,
      status: 'success',
    },
    {
      threshold: 1000,
      status: 'warning',
    },
    {
      threshold: 10000,
      status: 'error',
    },
  ]

  // 根据传入的值查找对应的状态
  const getStatusByConsumingTime = (value: number) => {
    for (const { threshold, status } of thresholdStatusMap) {
      if (value < threshold) {
        return status
      }
    }
    // 如果没有匹配到合适的阈值，返回最后一个阈值对应的状态
    const lastItem = thresholdStatusMap[thresholdStatusMap.length - 1]
    return lastItem ? lastItem.status : undefined
  }
  return {
    crudOptions: {
      request: {
        pageRequest,
        delRequest,
        infoRequest,
      },
      actionbar: {
        buttons: {
          add: {
            show: false,
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
        width: '120px',
        buttons: {
          edit: {
            show: false,
          },
          view: {
            show: true,
          },
          remove: {
            // show: hasPermission(R.SYSTEM_LOGIN_LOG_DELETE)
          },
          copy: {
            show: false,
          },

        },
      },
      columns: {
        ...indexColumn(props.crudExpose),
        requestIp: {
          title: $t('basic.system.baseOperationLog.requestIp'),
          type: ['text'],
          search: {
            show: !0,
          },
          column: {
            width: 170,
          },
        },
        type: {
          title: $t('basic.system.baseOperationLog.type'),
          type: ['dict-radio'],
          dict: backendDict({
            type: 'LogType',
            isEnum: !0,
          }),
          column: {
            width: 80,
          },
          search: {
            show: !0,
          },
        },
        description: {
          title: $t('basic.system.baseOperationLog.description'),
          type: ['text', 'copyable'],
          column: {
            ellipsis: !0,
            width: 200,
          },
        },
        classPath: {
          title: $t('basic.system.baseOperationLog.classPath'),
          type: ['text'],
          column: {
            show: !1,
          },
        },
        actionMethod: {
          title: $t('basic.system.baseOperationLog.actionMethod'),
          type: ['text'],
          column: {
            ellipsis: !0,
            width: 200,
            formatter: e => `${e.form.classPath}.${e.form.actionMethod}`,
          },
        },
        requestUri: {
          title: $t('basic.system.baseOperationLog.requestUri'),
          type: ['text'],
          column: {
            ellipsis: !0,
            width: 200,
          },
        },
        httpMethod: {
          title: $t('basic.system.baseOperationLog.httpMethod'),
          type: ['dict-radio'],
          column: {
            width: 80,
          },
          dict: backendDict({
            type: EnumEnum.HttpMethod,
            isEnum: !0,
          }),
          search: {
            show: !0,
          },
        },
        params: {
          title: '参数',
          type: 'text',
          form: {
            col: {
              span: 24,
            },
            render: (e) => {
              try {
                const o = JSON.parse(e.form.params)
                return o
                  ? (<JsonViewer boxed copyable expand-depth="3" value={o} />)
                  : h('div', e.form.params)
              }
              catch {
                return h('div', e.form.params)
              }
            },
          },
          column: {
            show: !1,
          },
        },
        result: {
          title: '返回结果',
          type: ['json'],
          form: {
            col: {
              span: 24,
            },
            valueBuilder({ form: e }) {
              e.result !== null && (e.result = JSON.parse(e.result))
            },
            valueResolve({ form: e }) {
              e.result !== null && (e.result = JSON.stringify(e.result))
            },
          },
          column: {
            show: !1,
          },
        },
        exDetail: {
          title: '异常日志',
          type: ['text'],
          form: {
            col: {
              span: 24,
            },
            render: e => h(Codemirror, {
              autofocus: !0,
              extensions: exDetailExtensions,
              indentWithTab: !0,
              style: {
                height: '200px',
              },
              tabSize: 2,
              modelValue: e.form.exDetail,
            }),
          },
          column: {
            show: !1,
          },
        },
        startTime: {
          title: $t('basic.system.baseOperationLog.startTime'),
          type: ['datetime'],
          column: {
            width: 170,
          },
          form: {
            component: {
              format: 'YYYY-MM-DD HH:mm:ss',
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          valueBuilder({ value: e, row: o, key: u }) {
            e !== null && (o[u] = e)
          },
        },
        finishTime: {
          title: $t('basic.system.baseOperationLog.finishTime'),
          type: ['datetime'],
          column: {
            width: 170,
          },
          form: {
            component: {
              format: 'YYYY-MM-DD HH:mm:ss',
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          valueBuilder({ value: e, row: o, key: u }) {
            e !== null && (o[u] = e)
          },
        },
        consumingTime: {
          title: $t('basic.system.baseOperationLog.consumingTime'),
          type: ['text'],
          column: {
            width: 100,
            cellRender: (e) => {
              const consumingTime = e.form.consumingTime
              const status = getStatusByConsumingTime(consumingTime) as 'success' | 'warning' | 'error' | 'default' | 'processing' | undefined
              return (<Badge dot status={status} text={`${consumingTime}ms`} />)
            },
          },
        },
        ua: {
          title: $t('basic.system.baseOperationLog.ua'),
          type: ['textarea'],
          search: {
            show: !0,
          },
          column: {
            width: 100,
            ellipsis: !0,
          },
        },
        ...createdTimeColumn({}),
      },
    },
  }
}

export function frontRules(_crudExpose: CrudExpose, _mode: ActionEnum): any {
  return {}
}

export const clearList: DropMenu[] = [
  {
    text: '保留1个月',
    event: '1',
  },
  {
    text: '保留三个月',
    event: '2',
  },
  {
    text: '保留六个月',
    event: '3',
  },
  {
    text: '保留一年',
    event: '4',
  },
  {
    text: '保留一千条',
    event: '5',
  },
  {
    text: '保留一万条',
    event: '6',
  },
  {
    text: '保留三万条',
    event: '7',
  },
  {
    text: '保留十万条',
    event: '8',
  },
  {
    text: '清空所有',
    event: '9',
  },
]
