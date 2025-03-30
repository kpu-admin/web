<script lang="ts" setup>
import KpuIcon from '@/ui/components/KpuIcon/index.vue'
import KpuHelpTooltip from '@/ui/components/KpuTooltip/help-tooltip.vue'
import { useNamespace } from '@/utils/classNames.ts'
import { computed, defineEmits, defineProps } from 'vue'

// Define Props
const props = withDefaults(
  defineProps<{
    prefixCls?: string
    title: string
    show: boolean
    canExpan: boolean
    helpMessage?: string | string[]
  }>(),
  {
    prefixCls: '',
    helpMessage: '',
  },
)
// Define Emits
const emit = defineEmits<{
  expand: []
}>()

// Computed properties
const { e } = useNamespace('collapse-container')
const rotateIcon = computed(() => (props.show ? 90 : -90))

// Methods
function handleExpand() {
  emit('expand')
}
</script>

<template>
  <div :class="[`${e('header')} px-2 py-5`, $attrs.class]">
    <slot name="title">
      {{ props.title }}
    </slot>

    <KpuHelpTooltip v-if="props.helpMessage" trigger-class="pb-1">
      {{ props.helpMessage }}
    </KpuHelpTooltip>

    <div :class="e('action')">
      <slot name="action" :expand="props.show" @click="handleExpand">
        <KpuIcon
          v-if="props.canExpan"
          name="i-ion:chevron-forward"
          class="origin-center rotate-0 transition-all duration-300 delay-100 ease-in-out"
          :rotate="rotateIcon"
          @click="handleExpand"
        />
      </slot>
    </div>
  </div>
</template>
