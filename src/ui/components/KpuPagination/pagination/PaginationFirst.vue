<script setup lang="ts">
import type { PaginationFirstProps } from 'reka-ui'

import { cn } from '@/utils'

import { PaginationFirst } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<PaginationFirstProps & { class?: any }>(),
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
  <PaginationFirst v-bind="delegatedProps">
    <KpuButton :class="cn('size-8 p-0', props.class)" variant="outline">
      <slot>
        <KpuIcon name="i-lucide:chevrons-left" :size="16" />
      </slot>
    </KpuButton>
  </PaginationFirst>
</template>
