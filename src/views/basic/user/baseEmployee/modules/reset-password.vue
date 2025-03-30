<script setup lang="ts">
import { Api } from '@/api/devOperation/tenant/defUser.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { FsForm, useFs } from '@fast-crud/fast-crud'
import { createCrudOptions, frontRules } from './resetPassword.tsx'

const emits = defineEmits<{
  success: []
}>()
const { createMessage } = useMessage()
const formRef = useTemplateRef<typeof FsForm>('formRef')
const { crudBinding, appendCrudOptions } = useFs({
  createCrudOptions,
})

const [Modal, modelApi] = useKpuModal({
  async onOpened() {
    modelApi.setState({
      loading: !1,
      confirmLoading: !1,
    })
    const data = {
      id: modelApi.getData()?.record?.userId,
    }
    formRef.value.setFormData(data)
    const validateApi = Api.ResetPassword
    const addFormOptions = await getValidateRulesByKpu({
      Api: validateApi,
      mode: ActionEnum.ADD,
      customRules: frontRules(formRef),
      trigger: ['blur', 'change'],
    })
    appendCrudOptions({ ...addFormOptions })
  },
  async onConfirm() {
    try {
      modelApi.setState({
        loading: !0,
        confirmLoading: !0,
      })
      await formRef.value.submit()
      createMessage.success('重置成功')
      modelApi.close()
      emits('success')
    }
    finally {
      modelApi.setState({
        loading: !1,
        confirmLoading: !1,
      })
    }
  },
})
</script>

<template>
  <Modal title="重置密码" class="h-full w-[70%]" content-class="h-full">
    <FsForm ref="formRef" class="p-0" v-bind="crudBinding.addForm" />
  </Modal>
</template>
