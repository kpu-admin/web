<script setup lang="ts">
import { ActionEnum } from '@/enums/commonEnum'
import { useFs, useUi } from '@fast-crud/fast-crud'
import { forEach } from 'lodash-es'
import { createCrudOptions } from './defResourceMeta.data'

const props = withDefaults(
  defineProps<{
    value?: string | Recordable
    mode?: ActionEnum
  }>(),
  {
    value: '{}',
    mode: ActionEnum.VIEW,
  },
)
const emit = defineEmits<{
  'update:value': [payload: any]
}>()

const { crudRef, crudBinding } = useFs({
  createCrudOptions,
  context: {
    emit,
    mode: props.mode,
  },
})

const { ui } = useUi()
const formItemContext = ui.formItem.injectFormItemContext()

function emits(data: any) {
  emit('update:value', data)
  formItemContext.onBlur()
  formItemContext.onChange()
}

watch(
  () => props.value,
  (value) => {
    let innerVal
    try {
      innerVal = JSON.parse(value as string || '{}')
    }
    catch {
      innerVal = []
    }
    const list: Recordable[] = []
    forEach(innerVal, (v, key) => {
      list.push({ key, value: v })
    })
    crudBinding.value.data = list
    emits(JSON.stringify(innerVal))
  },
  { immediate: true },
)
</script>

<template>
  <div class="meta-input">
    <FsCrud ref="crudRef" v-bind="crudBinding" />
  </div>
</template>

<style scoped>
.meta-input {
  padding: 10px;
  border: 1px solid #d9d9d9;
}
</style>
