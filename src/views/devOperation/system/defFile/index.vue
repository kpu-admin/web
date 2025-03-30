<script lang="ts" setup>
import { useFs } from '@fast-crud/fast-crud'
import { onMounted } from 'vue'
import { createCrudOptions } from './data/crud'

defineOptions({
  name: '全局附件管理',
  inheritAttrs: false,
})

const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions })

// 页面打开后获取列表数据
onMounted(async () => {
  crudExpose.doRefresh()
})
</script>

<template>
  <FsPage>
    <FsCrud ref="crudRef" v-bind="crudBinding" />
  </FsPage>
</template>
