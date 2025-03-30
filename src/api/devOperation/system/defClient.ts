import type { PageParams, PageResult } from '@/api/model/baseModel.ts'

import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  DefClientPageQuery,
  DefClientResultVO,
  DefClientSaveVO,
  DefClientUpdateVO,
} from './model/defClientModel.ts'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const MODULAR = 'defClient'
const ServicePrefix = ''
export const Api = {
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: { url: `${ServicePrefix}/${MODULAR}`, method: RequestEnum.PUT },
}

export function page(params: PageParams<DefClientPageQuery>) {
  return requestClient.post<PageResult<DefClientResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function save(params: DefClientSaveVO) {
  return requestClient.post<DefClientResultVO>(Api.Save.url, params)
}

export function update(params: DefClientUpdateVO) {
  return requestClient.put<DefClientResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function query(params?: DefClientPageQuery) {
  return requestClient.post<DefClientResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export async function pageRequest(pageQuery: PageParams<DefClientPageQuery>): Promise<UserPageRes> {
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
