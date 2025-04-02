<script setup lang="ts">
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { Api } from '@/api/modules/profile/userInfo.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { $t } from '@/locales'
import useUserStore from '@/store/modules/user.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { FsForm, useFs } from '@fast-crud/fast-crud'
import { createCrudOptions, frontRules } from './securePwd.tsx'

const { createMessage } = useMessage()
const userStore = useUserStore()
const formRef = useTemplateRef<typeof FsForm>('formRef')
const { crudBinding, appendCrudOptions } = useFs({
  createCrudOptions,
})
const [Modal, modelApi] = useKpuModal({
  async onOpened() {
    const userInfo = userStore.userInfo
    formRef.value.setFormData({
      id: userInfo?.id,
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
    Api: Api.UpdateMobile,
    mode: ActionEnum.ADD,
    customRules: frontRules(formRef),
    trigger: ['blur', 'change'],
  })
  appendCrudOptions({ ...addFormOptions })
})
</script>

<template>
  <Modal title="修改密码">
    <div class="p-4">
      <FsForm ref="formRef" class="p-0" v-bind="crudBinding.addForm" />
    </div>
  </Modal>
</template>
