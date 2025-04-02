<script setup lang="ts">
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { Api } from '@/api/modules/profile/userInfo.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useMessage } from '@/hooks/useMessage.tsx'
import { $t } from '@/locales'
import useUserStore from '@/store/modules/user.ts'
import { FsForm, useFs } from '@fast-crud/fast-crud'
import { Button } from 'ant-design-vue'
import { onMounted } from 'vue'
import { createCrudOptions, frontRules } from './Userinfo/data.tsx'

const formRef = ref<typeof FsForm>()
const { createMessage } = useMessage()
const userStore = useUserStore()

const { crudBinding, appendCrudOptions } = useFs({
  createCrudOptions,
})

onMounted(async () => {
  const data = userStore.userInfo
  formRef.value.setFormData({ ...data, logo: data?.avatarId }, {
    mergeForm: !1,
  })

  const rules = await getValidateRulesByKpu({
    Api: Api.UpdateBaseInfo,
    mode: ActionEnum.ADD,
    customRules: frontRules(),
    trigger: 'change',
  })
  appendCrudOptions({ ...rules })
})

async function handleSubmit() {
  await formRef.value.submit()
  createMessage.success($t(`common.tips.updateSuccess`))
  await userStore.getUserInfo()
}
</script>

<template>
  <div title="基本设置">
    <FsForm ref="formRef" v-bind="crudBinding.addForm" />
    <Button v-if="formRef" type="primary" style="margin-top: 10px;" @click="handleSubmit">
      修改
    </Button>
  </div>
</template>

<style scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
