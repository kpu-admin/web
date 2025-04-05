<script setup lang="ts">
import { cn } from '@/utils'

import Tooltip from './index.vue'

defineOptions({
  inheritAttrs: false,
})

defineProps<{ triggerClass?: string }>()
</script>

<template>
  <Tooltip :delay-duration="300" side="right">
    <template #default>
      <slot name="trigger">
        <KpuIcon
          name="i-lucide:circle-help" :class="
            cn(
              'text-foreground/80 hover:text-foreground inline-flex size-5 cursor-pointer',
              triggerClass,
            )
          " :size="20"
        />
      </slot>
    </template>
    <template #content>
      <slot name="default" />
    </template>
  </Tooltip>
</template>
