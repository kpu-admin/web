<script setup lang="ts">
import type { DialogDescriptionProps } from 'reka-ui'

import { cn } from '@/utils'

import { DialogDescription, useForwardProps } from 'reka-ui'

import { computed } from 'vue'

const props = defineProps<DialogDescriptionProps & { class?: any }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DialogDescription
    v-bind="forwardedProps"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
