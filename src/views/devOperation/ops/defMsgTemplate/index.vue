<script lang="ts" setup>
import { Api } from '@/api/devOperation/ops/extendMsgTemplate.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { useFs } from '@fast-crud/fast-crud'
import { onMounted } from 'vue'
import { createCrudOptions, frontRules } from './data/crud'
import Send from './modules/send.vue'

defineOptions({
  name: '接口日志',
  inheritAttrs: false,
})

const { crudRef, crudBinding, crudExpose, appendCrudOptions } = useFs({
  createCrudOptions,
  context: {
    modelApi: getModelApi,
  },
})
const [SendModal, modelApi] = useKpuModal({
  connectedComponent: Send,
})
function getModelApi() {
  return modelApi
}
// 页面打开后获取列表数据
onMounted(async () => {
  const addFormOptions = await getValidateRulesByKpu({
    Api: Api.Save,
    mode: ActionEnum.ADD,
    customRules: frontRules(crudExpose, ActionEnum.ADD),
    trigger: 'change',
  })
  const editFormOptions = await getValidateRulesByKpu({
    Api: Api.Update,
    mode: ActionEnum.EDIT,
    customRules: frontRules(crudExpose, ActionEnum.EDIT),
    trigger: 'change',
  })
  console.warn(addFormOptions, editFormOptions)
  appendCrudOptions({ ...addFormOptions, ...editFormOptions })
  crudExpose.doRefresh()
})
</script>

<template>
  <FsPage>
    <FsCrud ref="crudRef" v-bind="crudBinding" />
    <SendModal />
  </FsPage>
</template>
