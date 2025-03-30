<script lang="ts" setup>
import { Api } from '@/api/devOperation/ops/defInterface.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useFs } from '@fast-crud/fast-crud'
import { onMounted } from 'vue'
import { createCrudOptions, frontRules } from './data/crud'

defineOptions({
  name: '接口执行日志记录维护',
  inheritAttrs: false,
})

const { crudRef, crudBinding, crudExpose, appendCrudOptions } = useFs({ createCrudOptions })

// 页面打开后获取列表数据
onMounted(async () => {
  const addFormOptions = await getValidateRulesByKpu({
    Api: Api.Save,
    mode: ActionEnum.ADD,
    customRules: frontRules(crudExpose, ActionEnum.ADD),
    trigger: ['blur', 'change'],
  })
  const editFormOptions = await getValidateRulesByKpu({
    Api: Api.Update,
    mode: ActionEnum.EDIT,
    customRules: frontRules(crudExpose, ActionEnum.EDIT),
    trigger: ['blur', 'change'],
  })
  console.warn(addFormOptions, editFormOptions)
  appendCrudOptions({ ...addFormOptions, ...editFormOptions })
  crudExpose.doRefresh()
})
</script>

<template>
  <FsPage>
    <FsCrud ref="crudRef" v-bind="crudBinding" />
  </FsPage>
</template>
