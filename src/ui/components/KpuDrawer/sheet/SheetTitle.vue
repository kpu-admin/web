<script setup lang="ts">
import type { DialogTitleProps } from 'reka-ui'

import { cn } from '@/utils'

import { DialogTitle } from 'reka-ui'

import { computed } from 'vue'

const props = defineProps<DialogTitleProps & { class?: any }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogTitle
    :class="cn('text-foreground font-medium', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogTitle>
</template>
