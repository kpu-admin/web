<script setup lang="ts">
import type { CustomRenderType } from '../types';
import KpuRenderContent from '@/ui/components/KpuRenderContent/index.vue'

import KpuHelpTooltip from '@/ui/components/KpuTooltip/help-tooltip.vue'
import { cn } from '@/utils'
import { FormLabel } from './form'

interface Props {
  class?: string;
  colon?: boolean;
  help?: CustomRenderType;
  label?: CustomRenderType;
  required?: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <FormLabel :class="cn('flex items-center', props.class)">
    <span v-if="required" class="text-destructive mr-[2px]">*</span>
    <slot></slot>
    <KpuHelpTooltip v-if="help" trigger-class="size-3.5 ml-1">
      <KpuRenderContent :content="help" />
    </KpuHelpTooltip>
    <span v-if="colon && label" class="ml-[2px]">:</span>
  </FormLabel>
</template>
