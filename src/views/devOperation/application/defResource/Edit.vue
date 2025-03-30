<script setup lang="ts">
import { Api, get } from '@/api/devOperation/application/defResource'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu'
import { ActionEnum } from '@/enums/commonEnum'
import { useMessage } from '@/hooks/useMessage'
import { $t } from '@/locales'
import { useFs } from '@fast-crud/fast-crud'
import { Card } from 'ant-design-vue'
import { createCrudOptions, frontRules } from './data/crud'

const emits = defineEmits<
  {
    success: [string]
  }
>()
const { createMessage } = useMessage()
const formRef = ref<any>()
const type = ref<ActionEnum>(ActionEnum.VIEW)
const confirmLoading = ref<boolean>(false)
const title = ref<string>('未选中任何资源')

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

    const params = formRef.value.getFormData()
    createMessage.success($t(`common.tips.${type.value}Success`))
    type.value = ActionEnum.VIEW
    formRef.value.reset()
    title.value = '未选中任何资源'
    emits('success', params.applicationId)
  }
  finally {
    confirmLoading.value = false
  }
}
function resetFields() {
  formRef.value.reset()
}
async function resetForm(record: Recordable) {
  if (record?.applicationName) {
    title.value = '未选中任何资源'
  }
}

// 设置回显数据
async function setData(data: Recordable) {
  try {
    type.value = data?.type

    const { parent } = data
    let resourceVO = {}
    if (unref(type) !== ActionEnum.ADD) {
      resourceVO = await get(data.record.id)
    }
    const record = { ...data.record, ...resourceVO }
    if (record?.applicationName) {
      if (unref(type) === ActionEnum.ADD) {
        title.value = `${$t(`common.title.${type.value}`)}【${record?.applicationName}】中【${parent?.name}】的子资源`
      }
      else {
        title.value = `${$t(`common.title.${type.value}`)}【${record?.applicationName}】中的【${record?.name}】`
      }
    }
    else {
      title.value = '查看'
    }
    record.parentName = parent?.name
    record.parentId = parent?.id
    record.parentResourceType = parent?.resourceType
    record.parentIsHidden = parent?.isHidden

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
  finally { /* empty */ }
}
defineExpose({
  setData,
  resetForm,
})
</script>

<template>
  <Card :title="title" :bordered="false">
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
    <template #actions>
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
