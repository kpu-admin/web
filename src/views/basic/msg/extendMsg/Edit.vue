<script setup lang="ts">
import { Api, get } from '@/api/basic/msg/extendMsg.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { $t } from '@/locales'
import { useFs } from '@fast-crud/fast-crud'
import { createCrudOptions, frontRules } from './data/crud.tsx'

const formRef = ref()
const route = useRoute()
const type = ref(ActionEnum.ADD)
const typeFrom = ref(ActionEnum.ADD)
const tabbar = useTabbar()
const loading = ref(false)
const { createMessage } = useMessage()
const { crudBinding, appendCrudOptions } = useFs({
  createCrudOptions,
})
// 提交
async function handleSubmit() {
  try {
    await formRef.value.submit()

    createMessage.success($t(`common.tips.${type.value}Success`))
    tabbar.closeById()
  }
  finally {
    loading.value = false
  }
}
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

  if (unref(type) !== ActionEnum.VIEW) {
    const validateApi = Api.Publish

    const rules = await getValidateRulesByKpu({
      Api: validateApi,
      mode: unref(type),
      customRules: frontRules(),
      trigger: 'change',
    })
    appendCrudOptions({ ...rules })
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
        发布消息
      </div>
    </template>
    <div class="p-5">
      <FsForm ref="formRef" v-bind="crudBinding[`${typeFrom}Form`]" />

      <div class="mt-2.5">
        <AButton :loading="loading" @click="handleSubmit">
          立即发送
        </AButton>
      </div>
    </div>
  </FsPage>
</template>
