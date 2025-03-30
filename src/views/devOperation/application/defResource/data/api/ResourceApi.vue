<script setup lang="ts">
import type { DefResourceApiVO } from '@/api/devOperation/application/model/defResourceModel'
import { ActionEnum } from '@/enums/commonEnum'
import { HTTP_TAG_MAP } from '@/enums/httpEnum'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal'
import { useFs } from '@fast-crud/fast-crud'
import { cloneDeep, uniqueId } from 'lodash-es'
import { createCrudOptions } from './defResourceApi.data'
import ResourceApiSelect from './ResourceApiSelect.vue'

const props = withDefaults(
  defineProps<{
    value?: DefResourceApiVO[]
    mode?: ActionEnum
  }>(),
  {
    mode: ActionEnum.VIEW,
  },
)
const emit = defineEmits<{
  'update:value': [payload: any]
}>()
const [ApiSelectModal, apiMode] = useKpuModal({
  connectedComponent: ResourceApiSelect,
  onConfirm: () => {
    handleSuccess(apiMode.getData().selectedData)
    apiMode.close()
  },
})
function openModal(data: any) {
  apiMode.setData({ selectedData: data })
  apiMode.open()
}

const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: {
    emit,
    openModal,
    mode: props.mode,
  },
})

watch(
  () => props.value,
  (value) => {
    const innerVal: DefResourceApiVO[] = value ? cloneDeep(value) : []
    innerVal.forEach(v => (v.tempId = uniqueId()))
    crudBinding.value.data = innerVal
  },
  { immediate: true },
)
function handleSuccess(data: any) {
  emit('update:value', data)
  crudExpose.setTableData(data)
}
</script>

<template>
  <div class="resource-api">
    <FsCrud ref="crudRef" v-bind="crudBinding">
      <template #cell_uri="{ form }">
        <APopover>
          <div>
            <ATag :color="HTTP_TAG_MAP.get(form.requestMethod)">
              {{ form.requestMethod }}
            </ATag>
            {{ form.uri }}
          </div>
          <template #content>
            <div>
              <div>服务： {{ form.springApplicationName }}</div>
              <div>名称：{{ form.controller }}</div>
              <div>接口名：{{ form.name }}</div>
              <div>地址： {{ form.uri }}</div>
              <div>请求方式： {{ form.requestMethod }}</div>
            </div>
          </template>
        </APopover>
      </template>
    </FsCrud>

    <ApiSelectModal />
  </div>
</template>

<style scoped>
.resource-api {
  padding: 10px;
  border: 1px solid #d9d9d9;
}
</style>
