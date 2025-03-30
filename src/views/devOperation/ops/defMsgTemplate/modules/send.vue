<script setup lang="ts">
import { Api } from '@/api/basic/msg/extendMsg.ts'
import { getValidateRulesByKpu } from '@/api/modules/common/formValidateServiceKpu.ts'
import { ActionEnum } from '@/enums/commonEnum.ts'
import { useKpuModal } from '@/ui/components/KpuModal/use-modal.ts'
import { useFs } from '@fast-crud/fast-crud'
import { createCrudOptions, frontRules } from './send.tsx'

const formRef = ref()
const { crudBinding, appendCrudOptions, crudExpose } = useFs({
  createCrudOptions,
})

const [Modal, modelApi] = useKpuModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      modelApi.setState({
        loading: !1,
        confirmLoading: !1,
      })
      const data = modelApi.getData()
      await nextTick()
      formRef.value.setFormData(data, {
        mergeForm: false,
      })

      const addFormOptions = await getValidateRulesByKpu({
        Api: Api.SendByTemplate,
        mode: ActionEnum.ADD,
        customRules: frontRules(ActionEnum.ADD),
      })
      appendCrudOptions({ ...addFormOptions })
      crudExpose.doRefresh()
    }
  },
  async onConfirm() {
    try {
      modelApi.setState({
        loading: !0,
        confirmLoading: !0,
      })
      await formRef.value.submit()
      // p.success('发送成功')
      await modelApi.close()
      // o("success")
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
  <Modal title="测试发送" class="h-full w-[60%]" content-class="h-full">
    <div class="p-4">
      <FsForm ref="formRef" class="p-0" v-bind="crudBinding.addForm" />
    </div>
  </Modal>
</template>
