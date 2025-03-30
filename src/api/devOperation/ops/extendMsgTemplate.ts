import type { ExtendMsgSendVO } from '@/api/basic/msg/model/extendMsgModel.ts'

import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  ExtendMsgTemplatePageQuery,
  ExtendMsgTemplateResultVO,
  ExtendMsgTemplateSaveVO,
  ExtendMsgTemplateUpdateVO,
} from './model/extendMsgTemplateModel.ts'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const MODULAR = 'defMsgTemplate'
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
}

export function page(params: PageParams<ExtendMsgTemplatePageQuery>) {
  return requestClient.post<PageResult<ExtendMsgTemplateResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}
export function check(code: string, id: string) {
  return requestClient.post<PageResult<ExtendMsgTemplateResultVO>>(`${ServicePrefix}/${MODULAR}/check`, {
    params: {
      code,
      id,
    },
  })
}

export function save(params: ExtendMsgTemplateSaveVO) {
  return requestClient.post<ExtendMsgTemplateResultVO>(Api.Save.url, params)
}

export function update(params: ExtendMsgTemplateUpdateVO) {
  return requestClient.put<ExtendMsgTemplateResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function query(params?: ExtendMsgTemplatePageQuery) {
  return requestClient.post<ExtendMsgTemplateResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}
export function publish(params?: ExtendMsgSendVO) {
  return requestClient.post<boolean>(Api.Publish.url, params)
}

export async function pageRequest(pageQuery: PageParams<ExtendMsgTemplatePageQuery>): Promise<UserPageRes> {
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
