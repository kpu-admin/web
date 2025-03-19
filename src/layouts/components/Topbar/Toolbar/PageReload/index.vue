<script setup lang="ts">
defineOptions({
  name: 'PageReload',
})

const mainPage = useMainPage()

const isAnimating = ref(false)

function handleClick() {
  isAnimating.value = true
  mainPage.reload()
}
</script>

<template>
  <KpuButton variant="ghost" size="icon" class="size-9" @click="handleClick" @animationend="isAnimating = false">
    <KpuIcon name="i-iconoir:refresh-double" class="size-4" :class="{ animation: isAnimating }" />
  </KpuButton>
</template>

<style scoped>
.animation {
  animation: animation 1s;
}

@keyframes animation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
