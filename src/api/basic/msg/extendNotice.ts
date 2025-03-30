import type { DefDictItemResultVO } from '@/api/devOperation/system/model/defDictItemModel.ts'
import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  ExtendNoticePageQuery,
  ExtendNoticeResultVO,
  ExtendNoticeSaveVO,
  ExtendNoticeUpdateVO,
} from './model/extendNoticeModel.ts'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const ServicePrefix = ''
const MODULAR = 'anyone/extendNotice'

export const Api = {

  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.PUT,
  },

}

export function page(params: PageParams<ExtendNoticePageQuery>) {
  return requestClient.post<PageResult<ExtendNoticeResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function query(params?: ExtendNoticePageQuery) {
  return requestClient.post<ExtendNoticeResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export function save(params: ExtendNoticeSaveVO) {
  return requestClient.post<ExtendNoticeResultVO>(Api.Save.url, params)
}

export function update(params: ExtendNoticeUpdateVO) {
  return requestClient.put<ExtendNoticeResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}
export function get(id: string) {
  return requestClient.get<DefDictItemResultVO>(`${ServicePrefix}/${MODULAR}/${id}`)
}

export async function pageRequest(pageQuery: PageParams<ExtendNoticePageQuery>): Promise<UserPageRes> {
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

export function mark(params: string[]) {
  return requestClient.post<boolean>(`${ServicePrefix}/${MODULAR}/mark`, params)
}
export function myNotice(params: PageParams<ExtendNoticePageQuery>) {
  return requestClient.post<ExtendNoticeResultVO>(`${ServicePrefix}/${MODULAR}/myNotice`, params)
}
