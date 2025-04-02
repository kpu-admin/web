import type { CreateCrudOptionsProps, CreateCrudOptionsRet } from '@fast-crud/fast-crud'
import { updateMobileRequest } from '@/api/modules/profile/userInfo.ts'
import { sendSmsCode } from '@/api/modules/user.ts'
import { MsgTemplateCodeEnum } from '@/enums/commonEnum.ts'
import useLoading from '@/hooks/use-loading.ts'
import { useCountdown } from '@/hooks/useCountdown.ts'
import { useMessage } from '@/hooks/useMessage.tsx'

export function getVerificationCode(formRef: Ref<any>) {
  const { createMessage } = useMessage()
  const { loading, startLoading, endLoading } = useLoading()
  const { currentCount, start, isStart } = useCountdown(60)

  const label = computed(() => {
    let text = '获取验证码'
    const countdownText = `${currentCount.value}秒后重新获取`
    if (loading.value) {
      text = ''
    }
    if (isStart.value) {
      text = countdownText
    }
    return text
  })

  async function getCaptcha(mobile: string) {
    if (!loading.value) {
      const form = formRef.value
      await form?.getFormRef().validateFields('mobile')
      if (!mobile) {
        createMessage.warning('请填写手机')
        return
      }
      startLoading()
      try {
        await sendSmsCode(mobile, MsgTemplateCodeEnum.MOBILE_EDIT)
        createMessage.success?.('发送成功')
        start()
      }
      catch (error: any) {
        createMessage.warning(error?.msg || '发送失败')
      }
      finally {
        endLoading()
      }
    }
  }

  return {
    label,
    start,
    stop,
    isStart,
    loading,
    getCaptcha,
  }
}

export function createCrudOptions(_props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        addRequest: updateMobileRequest,
      },
      form: {
        mode: 'add',
        col: {
          span: 24,
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: {
            show: !1,
          },
        },
        templateCode: {
          title: '消息模板',
          form: {
            show: !1,
          },
          type: 'text',
        },
        mobile: {
          title: '新手机',
          type: 'text',
        },
        code: {
          title: '验证码',
          type: 'text',
        },
      },
    },
  }
}
export function frontRules(): any {
  return {

  }
}
