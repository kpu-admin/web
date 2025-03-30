<script lang="ts" setup>
import { triggerWindowResize } from '@/utils'
import { useNamespace } from '@/utils/classNames.ts'
import { useTimeoutFn } from '@vueuse/core'
import { Skeleton } from 'ant-design-vue'
import { isNil } from 'lodash-es'
import { defineProps, ref, withDefaults } from 'vue'
import CollapseHeader from './CollapseHeader.vue'

// Define Props with Types and Defaults using withDefaults
const props = withDefaults(
  defineProps<{
    title?: string
    loading?: boolean
    canExpan?: boolean
    helpMessage?: string | string[]
    triggerWindowResize?: boolean
    lazyTime?: number
  }>(),
  {
    title: '',
    canExpan: true,
    helpMessage: '',
    lazyTime: 0,
  },
)

// Reactive state
const show = ref(true)

// Handle expansion
function handleExpand(val?: boolean) {
  show.value = isNil(val) ? !show.value : val
  if (props.triggerWindowResize) {
    useTimeoutFn(triggerWindowResize, 200)
  }
}

// Expose method to parent component
defineExpose({ handleExpand })
// Setup the namespace
const { e, b } = useNamespace('collapse-container')
</script>

<template>
  <div :class="b()">
    <!-- CollapseHeader Component -->
    <CollapseHeader
      v-bind="props"
      :prefix-cls="b()"
      :show="show"
      @expand="handleExpand"
    >
      <template #title>
        <slot name="title" />
      </template>
      <template #action>
        <slot name="action" />
      </template>
    </CollapseHeader>

    <!-- Body Section -->
    <div class="p-2">
      <Skeleton v-if="props.loading" active :loading="props.loading" />
      <div v-else v-show="show" :class="e('body')">
        <slot />
      </div>
    </div>

    <!-- Footer Section -->
    <div v-if="$slots.footer" :class="e('footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
.kpu-collapse-container {
  background-color: #fff;
  border-radius: 2px;
  transition: all 0.3s ease-in-out;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    border-bottom: 1px solid #d9d9d9;
  }

  &__footer {
    border-top: 1px solid #d9d9d9;
  }

  &__action {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
  }
}
</style>
