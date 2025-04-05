<script setup lang="ts">
import type { PaginationNextProps } from 'reka-ui'
import { cn } from '@/utils'

import { PaginationNext } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<PaginationNextProps & { class?: any }>(),
  {
    asChild: true,
  },
)

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <PaginationNext v-bind="delegatedProps">
    <KpuButton :class="cn('size-8 p-0', props.class)" variant="outline">
      <slot>
        <KpuIcon name="i-lucide:chevron-right" :size="16" />
      </slot>
    </KpuButton>
  </PaginationNext>
</template>
