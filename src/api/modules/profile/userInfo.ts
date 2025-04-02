import type { AddReq, EditReq } from '@fast-crud/fast-crud'
import type {
  DefUserBaseInfoUpdateVO,
  DefUserEmailUpdateVO,
  DefUserMobileUpdateVO,
  DefUserPasswordUpdateVO,
} from './model/userInfoModel'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum.ts'

const ServicePrefix = ''
export const Api = {
  UpdateAvatar: {
    url: `${ServicePrefix}/anyone/avatar`,
    method: RequestEnum.PUT,
  },
  UpdatePassword: {
    url: `${ServicePrefix}/anyone/password`,
    method: RequestEnum.PUT,
  },
  UpdateEmail: {
    url: `${ServicePrefix}/anyone/email`,
    method: RequestEnum.PUT,
  },
  UpdateMobile: {
    url: `${ServicePrefix}/anyone/mobile`,
    method: RequestEnum.PUT,
  },
  UpdateBaseInfo: {
    url: `${ServicePrefix}/anyone/baseInfo`,
    method: RequestEnum.PUT,
  },
}

// updateBaseInfo
export function updateBaseInfo(params: DefUserBaseInfoUpdateVO) {
  return requestClient.put(Api.UpdateBaseInfo.url, params)
}
export function updatePassword(params: DefUserPasswordUpdateVO) {
  return requestClient.put(Api.UpdatePassword.url, params)
}
export function updateEmail(params: DefUserMobileUpdateVO) {
  return requestClient.put(Api.UpdateEmail.url, params)
}
export function updateMobile(params: DefUserEmailUpdateVO) {
  return requestClient.put(Api.UpdateMobile.url, params)
}
export async function updateBaseInfoRequest(ctx: AddReq) {
  const { form } = ctx
  return await updateBaseInfo(form)
}
export async function updatePasswordRequest(ctx: EditReq) {
  const { form } = ctx
  return await updatePassword(form)
}
export async function updateMobileRequest(ctx: EditReq) {
  const { form } = ctx
  return await updateMobile(form)
}
export async function updateEmailRequest(ctx: EditReq) {
  const { form } = ctx
  return await updateEmail(form)
}
