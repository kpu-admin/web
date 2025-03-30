import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { RequestResponse } from '@/utils/request-client'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  DefUserPageQuery,
  DefUserPasswordResetVO,
  DefUserResultVO,
  DefUserSaveVO,
  DefUserUpdateVO,
} from './model/defUserModel'
import { requestClient } from '@/api'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'

const ServicePrefix = ''
const MODULAR = 'defUser'

export const Api = {
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: { url: `${ServicePrefix}/${MODULAR}`, method: RequestEnum.PUT },
  ResetPassword: {
    url: `${ServicePrefix}/${MODULAR}/resetPassword`,
    method: RequestEnum.PUT,
  },
}

export function page(params: PageParams<DefUserPageQuery>) {
  return requestClient.post<PageResult<DefUserResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function save(params: DefUserSaveVO) {
  return requestClient.post<DefUserResultVO>(Api.Save.url, params)
}

export function update(params: DefUserUpdateVO) {
  return requestClient.put<DefUserResultVO>(Api.Update.url, params)
}

export function updateState(id: string, state: boolean) {
  return requestClient.put<boolean>(`${ServicePrefix}/${MODULAR}/updateState`, {
    id,
    state,
  }, {
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}

export function resetPassword(params: DefUserPasswordResetVO) {
  return requestClient.put<boolean>(`${ServicePrefix}/${MODULAR}/resetPassword`, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function checkUsername(username: string, id?: string) {
  return requestClient.get<boolean>(`${ServicePrefix}/${MODULAR}/checkUsername`, { params: { username, id } })
}

export function checkEmail(email: string, id?: string) {
  return requestClient.get<boolean>(`${ServicePrefix}/${MODULAR}/checkEmail`, { params: { email, id } })
}

export function checkIdCard(idCard: string, id?: string) {
  return requestClient.get<boolean>(`${ServicePrefix}/${MODULAR}/checkIdCard`, { params: { idCard, id } })
}

export function checkMobile(mobile: string, id?: string) {
  return requestClient.get<boolean>(`${ServicePrefix}/${MODULAR}/checkMobile`, { params: { mobile, id } })
}

export function pageUser(params: PageParams<DefUserPageQuery>) {
  return requestClient.post<PageResult<DefUserResultVO>>(`${ServicePrefix}/${MODULAR}/pageUser`, params)
}

export function queryUser(params: DefUserPageQuery) {
  return requestClient.post<PageResult<DefUserResultVO>>(`${ServicePrefix}/${MODULAR}/queryUser`, params)
}

export function query(params?: DefUserPageQuery) {
  return requestClient.post<DefUserResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}
export function exportFile(params?: PageParams<DefUserPageQuery>) {
  return requestClient.download<RequestResponse<Blob>>(`${ServicePrefix}/${MODULAR}/export`, {
    data: params,
    method: 'POST',
    responseType: 'blob',
    responseReturn: 'raw',
  })
}

export async function pageRequest(pageQuery: PageParams<DefUserPageQuery>): Promise<UserPageRes> {
  return await page(pageQuery)
}

export async function infoRequest(ctx: InfoReq): Promise<UserPageRes> {
  const { row } = ctx

  // 请求后台查询数据
  return row
}

export async function addRequest(req: AddReq) {
  const { form } = req
  return await save(form)
}

export async function editRequest(ctx: EditReq) {
  const { form } = ctx
  return await update(form)
}

export async function delRequest(ctx: DelReq) {
  const { row } = ctx
  return await remove([row.id])
}

export async function removeFn(ids: string[]) {
  return await remove(ids)
}

export async function resetRequest(req: AddReq) {
  const { form } = req
  return await resetPassword(form)
}
