<script setup lang="ts">
import { asyncFindUrlById } from '@/api/modules/file/upload.ts'
import { useVModel } from '@vueuse/core'

defineOptions({
  inheritAttrs: false,
})
const props
  = defineProps<{
    value?: string
  }>()

const emits = defineEmits<{
  'update:value': [payload: string]
}>()
const url = useVModel(props, 'value', emits, {
  defaultValue: props.value,
  passive: true,
})
// const url = ref('')
watch(() => props.value, () => {
  url.value = ''
  props.value && findUrlById()
}, {
  immediate: !0,
})
function findUrlById() {
  if (!props.value || props.value.startsWith('http')) {
    return
  }
  asyncFindUrlById(props.value).then((res) => {
    res.code === 0 && (url.value = res.data as string)
  },
  )
}
</script>

<template>
  <AImage v-if="url" v-bind="$attrs" :src="url" />
</template>
