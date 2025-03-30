<script setup lang="ts">
import { Api } from '@/api/basic/user/baseOrg.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu'
import { ActionEnum } from '@/enums/commonEnum'
import { useMessage } from '@/hooks/useMessage'
import { $t } from '@/locales'
import { useFs } from '@fast-crud/fast-crud'
import { Card } from 'ant-design-vue'
import { createCrudOptions, frontRules } from './crud'

const emits = defineEmits<
  {
    success: []
  }
>()
const { createMessage } = useMessage()
const formRef = ref<any>()
const type = ref<ActionEnum>(ActionEnum.ADD)
const confirmLoading = ref<boolean>(false)
const loading = ref<boolean>(false)

const { crudBinding, appendCrudOptions } = useFs({
  createCrudOptions,
  context: {
    formRef,
    type,
  },
})

// 提交
async function handleSubmit() {
  try {
    confirmLoading.value = true
    await formRef.value.submit()

    // const params = formRef.value.getFormData()
    createMessage.success($t(`common.tips.${type.value}Success`))
    type.value = ActionEnum.VIEW
    formRef.value.reset()
    emits('success')
  }
  finally {
    confirmLoading.value = false
  }
}
function resetFields() {
  formRef.value.reset()
}

// 设置回显数据
async function setData(data: Recordable) {
  try {
    loading.value = true
    type.value = data?.type

    const { record = {}, parent = {} } = data
    record.parentName = parent?.name
    record.parentId = parent?.id
    await formRef.value.setFormData(record, {
      mergeForm: false,
    })

    if (unref(type) !== ActionEnum.VIEW) {
      const validateApi = unref(type) === ActionEnum.EDIT ? Api.Update : Api.Save

      const rules = await getValidateRulesByKpu({
        Api: validateApi,
        mode: unref(type),
        customRules: frontRules(formRef),
        trigger: 'change',
      },
      )

      appendCrudOptions({ ...rules })
    }
  }
  finally {
    loading.value = false
  }
}
defineExpose({
  setData,
})
</script>

<template>
  <Card v-loading="loading" :title="$t(`common.title.${type}`)" :bordered="false">
    <template #extra>
      <div v-if="type !== ActionEnum.VIEW" class="flex justify-center">
        <a-button @click="resetFields">
          {{ $t('common.resetText') }}
        </a-button>
        <a-button class="!ml-4" type="primary" :loading="confirmLoading" @click="handleSubmit">
          {{ $t('common.saveText') }}
        </a-button>
      </div>
    </template>
    <FsForm ref="formRef" v-bind="crudBinding[`${type}Form`]" />
  </Card>
</template>

<style scoped>
/* scss */
</style>
