import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  ExtendMsgPageQuery,
  ExtendMsgResultVO,
  ExtendMsgSaveVO,
  ExtendMsgSendVO,
  ExtendMsgUpdateVO,
} from './model/extendMsgModel.ts'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const MODULAR = 'extendMsg'
const ServicePrefix = ''
export const Api = {
  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: { url: `${ServicePrefix}/${MODULAR}`, method: RequestEnum.PUT },
  Publish: {
    url: `${ServicePrefix}/${MODULAR}/publish`,
    method: RequestEnum.POST,
  },
  SendByTemplate: {
    url: `${ServicePrefix}/sendByTemplate`,
    method: RequestEnum.POST,
  },
}

export function page(params: PageParams<ExtendMsgPageQuery>) {
  return requestClient.post<PageResult<ExtendMsgResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}
export function sendByTemplate(params: ExtendMsgSendVO) {
  return requestClient.post<boolean>(`${ServicePrefix}/${MODULAR}/sendByTemplate`, params)
}
export function get(id: string) {
  return requestClient.get<ExtendMsgResultVO>(`${ServicePrefix}/${MODULAR}/${id}`)
}
export function save(params: ExtendMsgSaveVO) {
  return requestClient.post<ExtendMsgResultVO>(Api.Save.url, params)
}

export function update(params: ExtendMsgUpdateVO) {
  return requestClient.put<ExtendMsgResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function query(params?: ExtendMsgPageQuery) {
  return requestClient.post<ExtendMsgResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}
export function publish(params?: ExtendMsgSendVO) {
  return requestClient.post<boolean>(Api.Publish.url, params)
}

export async function pageRequest(pageQuery: PageParams<ExtendMsgPageQuery>): Promise<UserPageRes> {
  return await page(pageQuery)
}

export async function infoRequest(ctx: InfoReq): Promise<UserPageRes> {
  const { row } = ctx

  // 请求后台查询数据
  return row
}

export async function addRequest(req: AddReq) {
  const { form } = req
  return await publish(form)
}

export async function editRequest(ctx: EditReq) {
  const { form } = ctx
  return await publish(form)
}

export async function delRequest(ctx: DelReq) {
  const { row } = ctx
  return await remove([row.id])
}
export async function sendByTemplateRequest(ctx: AddReq) {
  const { form } = ctx
  return await sendByTemplate(form)
}
