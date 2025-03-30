import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  DefInterfacePropertyBatchSaveVO,
  DefInterfacePropertyPageQuery,
  DefInterfacePropertyResultVO,
  DefInterfacePropertySaveVO,
  DefInterfacePropertyUpdateVO,
} from './model/defInterfacePropertyModel.ts'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const MODULAR = 'defInterfaceProperty'
const ServicePrefix = ''
export const Api = {
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: { url: `${ServicePrefix}/${MODULAR}`, method: RequestEnum.PUT },
}

export function page(params: PageParams<DefInterfacePropertyPageQuery>) {
  return requestClient.post<PageResult<DefInterfacePropertyResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function save(params: DefInterfacePropertySaveVO) {
  return requestClient.post<DefInterfacePropertyResultVO>(Api.Save.url, params)
}
export function batchSave(params: DefInterfacePropertyBatchSaveVO) {
  return requestClient.post<DefInterfacePropertyResultVO>(`${ServicePrefix}/${MODULAR}/batchSave`, params)
}

export function update(params: DefInterfacePropertyUpdateVO) {
  return requestClient.put<DefInterfacePropertyResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function query(params?: DefInterfacePropertyPageQuery) {
  return requestClient.post<DefInterfacePropertyResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export async function pageRequest(pageQuery: PageParams<DefInterfacePropertyPageQuery>): Promise<UserPageRes> {
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
