<script setup lang="ts">
import { inject } from 'vue'

useScrollLock()
const id = inject('DISMISSABLE_DRAWER_ID')
</script>

<template>
  <div :data-dismissable-drawer="id" class="z-popup bg-overlay inset-0" />
</template>
