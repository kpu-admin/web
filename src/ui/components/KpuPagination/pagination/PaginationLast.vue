<script setup lang="ts">
import type { PaginationLastProps } from 'reka-ui'
import { cn } from '@/utils'

import { PaginationLast } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<PaginationLastProps & { class?: any }>(),
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
  <PaginationLast v-bind="delegatedProps">
    <KpuButton :class="cn('size-8 p-0', props.class)" variant="outline">
      <slot>
        <KpuIcon name="i-lucide:chevron-right" :size="16" />
      </slot>
    </KpuButton>
  </PaginationLast>
</template>
