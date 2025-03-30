<script setup lang="ts">
defineOptions({
  name: 'KLayoutContainer',
})

const props = withDefaults(
  defineProps<{
    enableLeftSide?: boolean
    enableRightSide?: boolean
    leftSideWidth?: number | string
    rightSideWidth?: number | string
    hideLeftSideToggle?: boolean
    hideRightSideToggle?: boolean
  }>(),
  {
    enableLeftSide: true,
    enableRightSide: true,
    leftSideWidth: 300,
    rightSideWidth: 300,
    hideLeftSideToggle: false,
    hideRightSideToggle: false,
  },
)

// 侧边栏是否折叠
const leftSideVisiable = ref(true)
const rightSideVisiable = ref(true)

const enabledLeftSide = computed(() => {
  return props.enableLeftSide && !!useSlots().leftSide
})
const enabledRightSide = computed(() => {
  return props.enableRightSide && !!useSlots().rightSide
})
</script>

<template>
  <div class="flex-container">
    <div
      v-if="enabledLeftSide" v-show="leftSideVisiable"
      class="left-side border rounded-lg bg-background transition-background-color-300" :style="{
        width: typeof leftSideWidth === 'number' ? `${leftSideWidth}px` : leftSideWidth,
      }"
    >
      <slot name="leftSide" />
    </div>
    <div class="main">
      <div
        v-if="enabledLeftSide && !hideLeftSideToggle"
        o class="group toggle-bar left-side-placement"
        :class="!leftSideVisiable && 'toggle-bar__collapsed'"
        @click="leftSideVisiable = !leftSideVisiable"
      >
        <!--        <KpuIcon -->
        <!--          :name="leftSideVisiable ? 'i-ep:caret-left' : 'i-ep:caret-right'" -->
        <!--          class="rotate-45 op-30 transition-opacity group-hover-op-100" -->
        <!--          @click="leftSideVisiable = !leftSideVisiable" -->
        <!--        /> -->
        <div class="toggle-bar__top" />
        <div class="toggle-bar__bottom" />
      </div>
      <div
        v-if="enabledRightSide && !hideRightSideToggle"
        :class="!rightSideVisiable && 'toggle-bar__collapsed'"
        class="group toggle-bar right-side-placement"
        @click="rightSideVisiable = !rightSideVisiable"
      >
        <!--        <KpuIcon -->
        <!--          :name="rightSideVisiable ? 'i-ep:caret-right' : 'i-ep:caret-left'" -->
        <!--          class="rotate-45 op-30 transition-opacity group-hover-op-100" -->
        <!--          @click="rightSideVisiable = !rightSideVisiable" -->
        <!--        /> -->
        <div class="toggle-bar__top" />
        <div class="toggle-bar__bottom" />
      </div>
      <div class="main-container border rounded-lg bg-background transition-background-color-300">
        <slot name="default" />
      </div>
    </div>
    <div
      v-if="enabledRightSide" v-show="rightSideVisiable"
      class="right-side border rounded-lg bg-background transition-background-color-300" :style="{
        width: typeof rightSideWidth === 'number' ? `${rightSideWidth}px` : rightSideWidth,
      }"
    >
      <slot name="rightSide" />
    </div>
  </div>
</template>

<style scoped>
.flex-container {
  position: absolute;
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100%;
  padding: 20px;

  .left-side,
  .right-side,
  .main {
    --container-padding: 15px;

    height: 100%;
    padding: var(--container-padding);
  }

  .left-side,
  .right-side {
    flex: none;
    overflow: auto;
  }

  .main {
    position: relative;
    flex: 1;
    width: 100%;

    .toggle-bar {
      --uno-apply: absolute top-[calc(50% - 36px) ] z-1 h-18 w-8 cursor-pointer;

      .toggle-bar__top,
      .toggle-bar__bottom {
        --uno-apply: absolute left-3 0.5 h-9 0.5 w-1 rounded-0.5 bg-primary;

        transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .toggle-bar__bottom {
        --uno-apply: top-8.5;
      }

      &.left-side-placement {
        --uno-apply: -left-5.5;

        &:hover {
          .toggle-bar__top {
            --uno-apply: rotate-12 scale-115 -translate-y-0.5;
          }

          .toggle-bar__bottom {
            --uno-apply: -rotate-12 scale-115 translate-y-0.5;
          }

          &.toggle-bar__collapsed {
            .toggle-bar__top {
              --uno-apply: -rotate-12 scale-115 -translate-y-0.5;
            }

            .toggle-bar__bottom {
              --uno-apply: rotate-12 scale-115 translate-y-0.5;
            }
          }
        }
      }

      &.right-side-placement {
        --uno-apply: -right-6.5;

        &:hover {
          .toggle-bar__top {
            --uno-apply: -rotate-12 scale-115 -translate-y-0.5;
          }

          .toggle-bar__bottom {
            --uno-apply: rotate-12 scale-115 translate-y-0.5;
          }

          &.toggle-bar__collapsed {
            .toggle-bar__top {
              --uno-apply: rotate-12 scale-115 -translate-y-0.5;
            }

            .toggle-bar__bottom {
              --uno-apply: -rotate-12 scale-115 translate-y-0.5;
            }
          }
        }
      }
    }

    .main-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: var(--container-padding);
      overflow: auto;
    }
  }
}
</style>
