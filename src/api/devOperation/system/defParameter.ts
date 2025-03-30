import type { PageParams, PageResult } from '@/api/model/baseModel.ts'

import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  DefParameterPageQuery,
  DefParameterResultVO,
  DefParameterSaveVO,
  DefParameterUpdateVO,
} from './model/defParameterModel'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const MODULAR = 'defParameter'
const ServicePrefix = ''
export const Api = {
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: { url: `${ServicePrefix}/${MODULAR}`, method: RequestEnum.PUT },
}

export function page(params: PageParams<DefParameterPageQuery>) {
  return requestClient.post<PageResult<DefParameterResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function save(params: DefParameterSaveVO) {
  return requestClient.post<DefParameterResultVO>(Api.Save.url, params)
}

export function update(params: DefParameterUpdateVO) {
  return requestClient.put<DefParameterResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function check(key: string, id?: string) {
  return requestClient.get<boolean>(`${ServicePrefix}/${MODULAR}/check`, { params: { key, id } })
}

export function query(params?: DefParameterPageQuery) {
  return requestClient.post<DefParameterResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export async function pageRequest(pageQuery: PageParams<DefParameterPageQuery>): Promise<UserPageRes> {
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
