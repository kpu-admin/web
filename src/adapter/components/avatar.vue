<script setup lang="ts">
import { useVModel } from '@vueuse/core'

defineOptions({
  inheritAttrs: true,
})
const props
  = defineProps<{
    defaultValue?: string
    modelValue?: string
  }>()

const emits = defineEmits<{
  'update:modelValue': [payload: string]
}>()
const url = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: true,
})
// function handleSuccess(res: any) {
//   url.value = res.id
// }
</script>

<template>
  <div>
    avatar: {{ url }}
  </div>
<!--  <ImageUpload v-model="url" disabled notip @on-success="handleSuccess" /> -->
</template>
