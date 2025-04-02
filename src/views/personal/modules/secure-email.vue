<script setup lang="ts">
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { Api } from '@/api/modules/profile/userInfo.ts'
import { ActionEnum, MsgTemplateCodeEnum } from '@/enums/commonEnum.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { $t } from '@/locales'
import useUserStore from '@/store/modules/user.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { FsForm, useFs } from '@fast-crud/fast-crud'
import { Button, Input, InputGroup } from 'ant-design-vue'
import { createCrudOptions, frontRules, getVerificationCode } from './secureEmail.tsx'

const { createMessage } = useMessage()
const userStore = useUserStore()
const formRef = useTemplateRef<typeof FsForm>('formRef')
const { crudBinding, appendCrudOptions } = useFs({
  createCrudOptions,
})
const { label, isStart, loading, getCaptcha } = getVerificationCode(formRef)
const [Modal, modelApi] = useKpuModal({
  async onOpened() {
    const userInfo = userStore.userInfo
    formRef.value.setFormData({
      id: userInfo?.id,
      templateCode: MsgTemplateCodeEnum.EMAIL_EDIT,
    }, {
      mergeForm: !1,
    })
  },
  async onConfirm() {
    await formRef.value.submit()
    createMessage.success($t('common.tips.editSuccess'))
    modelApi.close()
  },
})
onMounted(async () => {
  const addFormOptions = await getValidateRulesByKpu({
    Api: Api.UpdateEmail,
    mode: ActionEnum.ADD,
    customRules: frontRules(),
    trigger: ['blur', 'change'],
  })
  appendCrudOptions({ ...addFormOptions })
})
</script>

<template>
  <Modal title="修改邮箱">
    <div class="p-4">
      <FsForm ref="formRef" class="p-0" v-bind="crudBinding.addForm">
        <template #form_code="{ form }">
          <!--        -->
          <InputGroup compact>
            <Input v-model:value="form.code" style="width: 60%;" />
            <Button type="primary" :disabled="isStart" :loading="loading" class="w-[40%]" @click="() => getCaptcha(form.email)">
              {{ label }}
            </Button>
          </InputGroup>
        </template>
      </FsForm>
    </div>
  </Modal>
</template>
