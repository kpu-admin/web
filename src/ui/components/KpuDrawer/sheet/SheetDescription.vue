<script setup lang="ts">
import type { DialogDescriptionProps } from 'reka-ui'

import { cn } from '@/utils'

import { DialogDescription } from 'reka-ui'

import { computed } from 'vue'

const props = defineProps<DialogDescriptionProps & { class?: any }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogDescription
    :class="cn('text-muted-foreground text-sm', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogDescription>
</template>
