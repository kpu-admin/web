<script setup lang="ts">
import type { PaginationPrevProps } from 'reka-ui'

import { cn } from '@/utils'

import { PaginationPrev } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<PaginationPrevProps & { class?: any }>(),
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
  <PaginationPrev v-bind="delegatedProps">
    <KpuButton :class="cn('size-8 p-0', props.class)" variant="outline">
      <slot>
        <KpuIcon name="i-lucide:chevron-left" :size="16" />
      </slot>
    </KpuButton>
  </PaginationPrev>
</template>
