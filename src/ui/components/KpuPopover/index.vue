<script setup lang="ts">
import type { PopoverContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover'

defineOptions({
  name: 'KPopover',
})

const props = defineProps<{
  align?: PopoverContentProps['align']
  alignOffset?: PopoverContentProps['alignOffset']
  side?: PopoverContentProps['side']
  sideOffset?: PopoverContentProps['sideOffset']
  collisionPadding?: PopoverContentProps['collisionPadding']
  class?: HTMLAttributes['class']
}>()

function handleOpenAutoFocus(e: Event) {
  e.preventDefault()
}
</script>

<template>
  <Popover>
    <PopoverTrigger as="span">
      <slot />
    </PopoverTrigger>
    <PopoverContent :align :align-offset :side :side-offset :collision-padding :class="props.class" @open-auto-focus="handleOpenAutoFocus">
      <slot name="panel" />
    </PopoverContent>
  </Popover>
</template>
