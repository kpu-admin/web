<script lang="ts" setup>
import { useFs } from '@fast-crud/fast-crud'
import { onMounted } from 'vue'
import { createCrudOptions } from './data/crud'
import TokenList from './TokenList.vue'

defineOptions({
  name: '在线用户',
  inheritAttrs: false,
})

const tokenRef = useTemplateRef<any>('tokenRef')
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: {
    tokenRef,
  },
})

// 页面打开后获取列表数据
onMounted(async () => {
  crudExpose.doRefresh()
})
function onSuccess() {
  crudExpose.doRefresh()
}
</script>

<template>
  <FsPage>
    <FsCrud ref="crudRef" v-bind="crudBinding" />
    <TokenList ref="tokenRef" @success="onSuccess" />
  </FsPage>
</template>
