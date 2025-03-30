import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import { findOnlineService } from '@/api/devOperation/application/gateway'
import { findSystemApi } from '@/api/modules/common/general'
import { dict } from '@fast-crud/fast-crud'
import { split, uniqueId } from 'lodash-es'

export function createCrudOptions(props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const apiMap = ref<Record<string, any>>({})
  // 获取已经选中的uri
  function getSelectedOptions(controller: string) {
    const selectedData = props.context.selectedData
    const selectedOptions: string[] = []
    // 已选列表
    for (const selected of selectedData) {
      // 后台返回的所有的uri
      // for (const uri of unref(serviceControllerListMap)?.[currentService.value]?.[controller]) {
      for (const uri of unref(apiMap)?.[controller]) {
        if (
          selected.springApplicationName === uri.springApplicationName
          && selected.uri === uri.uri
          && selected.requestMethod === uri.requestMethod
        ) {
          selectedOptions.push(
            `${uri.springApplicationName}#${uri.controller}#${uri.uri}#${uri.requestMethod}#${uri.name}`,
          )
        }
      }
    }
    return selectedOptions
  }
  function delSelectedData(obj: any) {
    const selectedData = props.context.selectedData
    const index = selectedData.findIndex(
      (selected: any) =>
        selected.springApplicationName === obj.springApplicationName
        && selected.uri === obj.uri
        && selected.requestMethod === obj.requestMethod,
    )

    if (index > -1) {
      selectedData.splice(index, 1)
    }
  }
  // 添加
  function addSelectedData(obj: any) {
    const selectedData = props.context.selectedData
    let flag = false
    for (const selected of selectedData) {
      if (
        selected.springApplicationName === obj.springApplicationName
        && selected.uri === obj.uri
        && selected.requestMethod === obj.requestMethod
      ) {
        flag = true
        break
      }
    }
    if (!flag) {
      selectedData.push(obj)
    }
  }
  return {
    crudOptions: {

      form: {
        mode: 'add',
        col: {
          span: 24,
        },
      },
      columns: {
        service: {
          title: '服务名',
          type: 'dict-select',
          dict: dict({
            async getData() {
              return await findOnlineService()
            },
          }),
          form: {
            component: {
              filterable: !0,
              showSearch: !0,
            },
            helper: {
              position: 'label',
              text: `kpu-cloud: 自动查询后台已经正常启动并注册到nacos中的服务
lamp-boot: 后台拆分的模块`,
            },
            async valueChange({ value, getComponentRef, form }) {
              apiMap.value = await findSystemApi(value)
              const data = []
              for (const item in unref(apiMap)) {
                data.push({
                  value: item,
                  key: item,
                  label: item,
                })
              }
              const res = getComponentRef('controller').getDict()
              res.data = data
              form.controller = undefined
              form.uri = undefined
            },
          },
        },
        controller: {
          title: '控制器类名',
          dict: dict({
            data: [],
          }),
          type: 'dict-select',
          form: {
            component: {
              filterable: !0,
              showSearch: !0,
            },
            async valueChange({ value, getComponentRef, form }) {
              const data = []
              for (const n in unref(apiMap)) {
                if (n === value) {
                  const $ = unref(apiMap)[n]
                  for (const c of $) {
                    data.push({
                      value: `${c.springApplicationName}#${c.controller}#${c.uri}#${c.requestMethod}#${c.name}`,
                      key: c.springApplicationName + c.uri + c.requestMethod,
                      label: `${c.uri}【${c.requestMethod}】(${c.name})`,
                    })
                  }
                }
              }
              const res = getComponentRef('uri').getDict()
              res.data = data
              form.uri = getSelectedOptions(value)
            },
          },
        },
        uri: {
          title: '接口地址',
          dict: dict({
            data: [],
          }),
          type: 'dict-select',
          form: {
            component: {
              'mode': 'multiple',
              'option-label-prop': 'label',
              'showSearch': !0,
              'getPopupContainer': () => document.body,
            },
            async valueChange({ value, getComponentRef, form }) {
              const data = getComponentRef('uri').getDict().data
              for (const v of data) {
                const valueList = split(v.value, '#')
                delSelectedData({
                  springApplicationName: valueList[0],
                  uri: valueList[2],
                  requestMethod: valueList[3],
                })
              }
              if (value && value.length > 0) {
                for (const v of value) {
                  const valueList = split(v, '#')
                  addSelectedData({
                    springApplicationName: valueList[0],
                    controller: valueList[1],
                    uri: valueList[2],
                    requestMethod: valueList[3],
                    name: valueList[4],
                    isInput: !1,
                    tempId: uniqueId(),
                  })
                }
              }
              else {
                const apiList = apiMap.value[form.controller]
                for (const api of apiList) {
                  delSelectedData(api)
                }
              }
            },
          },
        },
      },
    },
  }
}
