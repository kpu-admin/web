<script lang="ts" setup>
import type { KpuFormProps } from '@/adapter/form'
import type { VxeTableGridOptions } from '@/adapter/vxe-table'
import type { DefApplicationResultVO } from '@/api/devOperation/application/model/defApplicationModel.ts'
import type { VxeGridListeners } from 'vxe-table'
import { useKpuVxeGrid } from '@/adapter/vxe-table'
import { Api, batchSave, page as pageRequest } from '@/api/devOperation/ops/defInterfaceProperty.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { useMessage } from '@/hooks/useMessage'
import { onMounted } from 'vue'
import { columns, formItems } from './data/crud.tsx'

defineOptions({
  name: '接口设置管理',
  inheritAttrs: false,
})
const { createMessage } = useMessage()
const { currentRoute } = useRouter()
const interfaceId = ref<string>('')
const name = ref<string>('')

// const { crudRef, crudBinding, crudExpose, appendCrudOptions } = useFs({ createCrudOptions })
const formOptions: KpuFormProps = {
  ...formItems(),
  ...{
    // 默认展开
    collapsed: true,
  },
}
const gridOptions: VxeTableGridOptions<DefApplicationResultVO> = {
  id: 'DefMsgProperty',
  keepSource: true,
  height: 'auto',
  mouseConfig: {
    selected: !0,
  },

  rowConfig: {
    // 自定义行数据唯一主键的字段名（默认自动生成）
    keyField: 'id',
    // 当鼠标移到行时，是否要高亮当前行
    isHover: true,
  },
  // 自定义列配置项
  customConfig: {
    // 是否启用 localStorage 本地保存，会将列操作状态保留在本地（需要有 id）
    storage: true,
  },
  editConfig: {
    trigger: 'click',
    mode: 'row',
    showStatus: true,
  },
  toolbarConfig: {
    perfect: true,
    buttons: [
      { code: 'myInsert', name: '新增' },
      {
        code: 'mark_cancel',
        name: '删除',
        status: 'danger',
      },
      { code: 'save', name: '提交', status: 'success' },
    ],
  },
  // 数据代理配置项（基于 Promise API）
  proxyConfig: {
    // 只接收Promise，具体实现自由发挥
    ajax: {
      // 当点击工具栏查询按钮或者手动提交指令 query或reload 时会被触发
      query: ({ page, sorts, filters }, formValues) => {
        const queryParams: any = {
          model: { ...formValues },
          // extra: { ...formValues.extra },
        }
        // Reflect.deleteProperty(queryParams.model, 'extra')

        // if (!interfaceId.value) {
        //   createMessage.warn('请先保存数据')
        //   return Promise.reject('请先保存数据')
        // }
        // 处理排序条件
        const firstSort = sorts[0]
        if (firstSort) {
          queryParams.sort = firstSort.property
          queryParams.order = firstSort.order
        }
        queryParams.size = page.pageSize
        queryParams.current = page.currentPage
        queryParams.model.interfaceId = interfaceId.value
        // 处理筛选条件
        filters.forEach(({ field, values }) => {
          queryParams[field] = values.join(',')
        })
        if (!interfaceId.value) {
          throw createMessage.warning('参数错误，无法查询')
          // eslint-disable-next-line no-new
          new Error('参数错误，无法查询')
        }
        return pageRequest(queryParams).then((r) => {
          r.total = Number(r.total)
          return r
        })
      },
      // 当点击工具栏保存按钮或者手动提交指令 save 时会被触发
      save: ({ body }) => batchSave(body),
    },
  },
  keyboardConfig: {
    isArrow: !0,
    isDel: !0,
    isEnter: !0,
    isTab: !0,
    isEdit: !0,
    isChecked: !0,
  },
  columns: columns(),
  editRules: {},

}
const gridEvents: VxeGridListeners = {
  toolbarButtonClick({ code }) {
    // eslint-disable-next-line ts/no-use-before-define
    const $grid = gridApi.grid
    switch (code) {
      case 'myInsert': {
        $grid.insert({
          interfaceId: interfaceId.value,
        })
        break
      }
    }
  },
}
const [Grid, gridApi] = useKpuVxeGrid({
  gridEvents,
  formOptions,
  gridOptions,
})
// async function removeRowEvent(row: any) {
//   const $grid = gridApi.grid
//   if ($grid) {
//     $grid.remove(row)
//     createMessage.success($t('common.tips.deleteSuccess'))
//   }
// }
// 页面打开后获取列表数据
onMounted(async () => {
  // const addFormOptions = await getValidateRulesByKpu({
  //   Api: Api.Save,
  //   mode: ActionEnum.ADD,
  //   customRules: frontRules.addForm.rules(),
  //   trigger: 'change',
  // })
  // const editFormOptions = await getValidateRulesByKpu({
  //   Api: Api.Update,
  //   mode: ActionEnum.EDIT,
  //   customRules: frontRules.editForm.rules(crudExpose),
  //   trigger: 'change',
  // })
  // console.warn(addFormOptions, editFormOptions)
  // appendCrudOptions({ ...addFormOptions, ...editFormOptions })
  // crudExpose.doRefresh()
  const routeParams = currentRoute.value?.params
  const routeQuery = currentRoute.value?.query
  name.value = routeQuery.name as string
  await load(routeParams.id as string)
  // await reload()
})

// function reload() {
//   const $grid = gridApi.grid
//   $grid.commitProxy('query')
// }

async function load(tId: string) {
  interfaceId.value = tId || ''
  const rules = await getValidateRulesByKpu({
    Api: Api.Save,
    // mode: ActionEnum.ADD,
    // customRules: frontRules.addForm.rules,
    trigger: 'change',
  })
  // const rules = await getValidateRuleObj(Api.Save, customFormSchemaRules())
  const $grid = gridApi.grid
  if ($grid && rules) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    gridOptions.editRules = rules
    gridApi.setGridOptions(gridOptions)

    // editRules.value = rules
  }
}
function handleDelete(row?: Recordable) {
  console.warn('handleDelete', row)
  const grid = gridApi.grid
  grid && grid.setPendingRow(row, !0)
}
</script>

<template>
  <div class="absolute-container">
    <KpuPageHeader :title="name" />
    <Grid class="h-[calc(100%-81px)]">
      <template #operate="{ row }">
        <TableAction
          :actions="[{
            label: '删除',
            popConfirm: {
              title: '确定删除吗？',
              confirm: handleDelete.bind(null, row),
            },
          }]"
        />
      </template>
    </Grid>
  </div>
</template>

<style scoped>
.absolute-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  overflow-y: auto;
}
</style>
