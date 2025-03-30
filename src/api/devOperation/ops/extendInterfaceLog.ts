import type { PageParams, PageResult } from '@/api/model/baseModel.ts'

import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  ExtendInterfaceLogPageQuery,
  ExtendInterfaceLogResultVO,
  ExtendInterfaceLogSaveVO,
  ExtendInterfaceLogUpdateVO,
} from './model/extendInterfaceLogModel.ts'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const MODULAR = 'extendInterfaceLog'
const ServicePrefix = ''
export const Api = {
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: { url: `${ServicePrefix}/${MODULAR}`, method: RequestEnum.PUT },
}

export function page(params: PageParams<ExtendInterfaceLogPageQuery>) {
  return requestClient.post<PageResult<ExtendInterfaceLogResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function save(params: ExtendInterfaceLogSaveVO) {
  return requestClient.post<ExtendInterfaceLogResultVO>(Api.Save.url, params)
}

export function update(params: ExtendInterfaceLogUpdateVO) {
  return requestClient.put<ExtendInterfaceLogResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function query(params?: ExtendInterfaceLogPageQuery) {
  return requestClient.post<ExtendInterfaceLogResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export async function pageRequest(pageQuery: PageParams<ExtendInterfaceLogPageQuery>): Promise<UserPageRes> {
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
