import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal'

import type { ConfigProps, NotificationArgsProps } from 'ant-design-vue/lib/notification'
import { $t } from '@/locales'

import { isString } from '@/utils'
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons-vue'
import { message as Message, Modal, notification } from 'ant-design-vue'

export interface NotifyApi {
  info: (config: NotificationArgsProps) => void
  success: (config: NotificationArgsProps) => void
  error: (config: NotificationArgsProps) => void
  warn: (config: NotificationArgsProps) => void
  warning: (config: NotificationArgsProps) => void
  open: (args: NotificationArgsProps) => void
  close: (key: string) => void
  config: (options: ConfigProps) => void
  destroy: () => void
}

export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
export declare type IconType = 'success' | 'info' | 'error' | 'warning'
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info'
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>

interface ConfirmOptions {
  info: ModalFunc
  success: ModalFunc
  error: ModalFunc
  warn: ModalFunc
  warning: ModalFunc
}

function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled class="modal-icon-warning" />
  }
  else if (iconType === 'success') {
    return <CheckCircleFilled class="modal-icon-success" />
  }
  else if (iconType === 'info') {
    return <InfoCircleFilled class="modal-icon-info" />
  }
  else {
    return <CloseCircleFilled class="modal-icon-error" />
  }
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div innerHTML={`<div>${content as string}</div>`}></div>
  }
  else {
    return content
  }
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
  const iconType = options.iconType || 'warning'
  Reflect.deleteProperty(options, 'iconType')
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    ...options,
    content: renderContent(options),
  }
  return Modal.confirm(opt) as unknown as ConfirmOptions
}

function getBaseOptions() {
  return {
    okText: $t('common.okText'),
    centered: true,
  }
}

function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  }
}

function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'))
}

function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'error'))
}

function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'))
}

function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'warning'))
}

notification.config({
  placement: 'topRight',
  duration: 3,
})

/**
 * @description: message
 */
export function useMessage() {
  return {
    createMessage: Message,
    notification: notification as NotifyApi,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  }
}
