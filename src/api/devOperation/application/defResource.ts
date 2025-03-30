import type { PageParams, PageResult } from '@/api/model/baseModel'
import type { AddReq, EditReq } from '@fast-crud/fast-crud'
import type { AxiosRequestConfig } from 'axios'
import type { DefResourcePageQuery, DefResourceResultVO, DefResourceSaveVO, DefResourceUpdateVO } from './model/defResourceModel'
import { requestClient } from '@/api'
import { ContentTypeEnum, RequestEnum } from '@/enums/httpEnum'

const ServicePrefix = ''

const MODULAR = 'defResource'

export const Api = {
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  Update: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.PUT,
  },

}
export function tree(params?: DefResourcePageQuery) {
  return requestClient.post<DefResourceResultVO>(`${ServicePrefix}/${MODULAR}/tree`, params)
}
export function move(id: string, parentId: string) {
  return requestClient.put<boolean>(`${ServicePrefix}/${MODULAR}/moveResource`, { id, parentId }, {
    withCredentials: true,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}
export function moveUp(id: string) {
  return requestClient.put<boolean>(`${ServicePrefix}/${MODULAR}/moveUp/${id}`, { id }, {
    withCredentials: true,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}
export function moveDown(id: string) {
  return requestClient.put<boolean>(`${ServicePrefix}/${MODULAR}/moveDown/${id}`, { id }, {
    withCredentials: true,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  })
}
export function page(params: PageParams<DefResourcePageQuery>) {
  return requestClient.post<PageResult<DefResourceResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params, {
    withCredentials: true,
  })
}

export function query(params?: DefResourcePageQuery) {
  return requestClient.post<DefResourceResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params, {
    withCredentials: true,
  })
}
export function get(id: string) {
  return requestClient.get<DefResourceResultVO>(`${ServicePrefix}/${MODULAR}/${id}`)
}

export function save(params: DefResourceSaveVO) {
  return requestClient.post<DefResourceResultVO>(Api.Save.url as string, params, {
    withCredentials: true,
  })
}
export function update(params: DefResourceUpdateVO) {
  return requestClient.put<DefResourceResultVO>(Api.Update.url as string, params, {
    withCredentials: true,
  })
}

export const remove = (params: string[]) => requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, { data: params })
export function check(code: string, id?: string) {
  return requestClient.get<boolean>(`${ServicePrefix}/${MODULAR}/check`, {
    params: { code, id },
  })
}
export function checkPath(path: string, applicationId: string, id?: string) {
  return requestClient.get<boolean>(`${ServicePrefix}/${MODULAR}/checkPath`, {
    params: { id, applicationId, path },
  })
}
export function checkName(name: string, applicationId: string, id?: string) {
  return requestClient.get<boolean>(`${ServicePrefix}/${MODULAR}/checkName`, {
    params: { id, applicationId, name },
  })
}
export async function addRequest(req: AddReq) {
  const { form } = req
  return await save(form)
}

export async function editRequest(ctx: EditReq) {
  const { form } = ctx
  return await update(form)
}

export default {
  page,
  query,
  save,
  update,
  remove,
}
