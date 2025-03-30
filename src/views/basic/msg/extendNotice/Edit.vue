<script setup lang="ts">
import { get } from '@/api/basic/msg/extendNotice.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { $t } from '@/locales'
import { useFs } from '@fast-crud/fast-crud'
import { createCrudOptions } from './data/crud.tsx'

const formRef = ref()
const route = useRoute()
const type = ref(ActionEnum.ADD)
const typeFrom = ref(ActionEnum.ADD)

const { crudBinding } = useFs({
  createCrudOptions,
})
async function load(data: Recordable) {
  type.value = data?.type
  typeFrom.value = data?.type

  if ([ActionEnum.COPY].includes(unref(type))) {
    typeFrom.value = ActionEnum.ADD
  }

  if (![ActionEnum.ADD].includes(unref(type))) {
    const response = await get(data.id)
    response.id = undefined
    formRef.value.setFormData(response, { mergeForm: false })
  }
}
onMounted(() => {
  const { params } = route
  const id = params?.id
  load({ type: params?.type, id })
})
</script>

<template>
  <FsPage>
    <template #header>
      <div class="title">
        {{ $t(`common.title.${type}`) }}
      </div>
    </template>
    <div class="p-5">
      <FsForm ref="formRef" v-bind="crudBinding[`${typeFrom}Form`]" />
    </div>
  </FsPage>
</template>
