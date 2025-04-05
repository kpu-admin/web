<script setup lang="ts">
import type { PaginationEllipsisProps } from 'reka-ui'

import { cn } from '@/utils'

import { PaginationEllipsis } from 'reka-ui'
import { computed } from 'vue'

const props = defineProps<PaginationEllipsisProps & { class?: any }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationEllipsis
    v-bind="delegatedProps"
    :class="cn('flex size-8 items-center justify-center', props.class)"
  >
    <slot>
      <KpuIcon name="i-lucide:more-horizontal" :size="16" />
    </slot>
  </PaginationEllipsis>
</template>
