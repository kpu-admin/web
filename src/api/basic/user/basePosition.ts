import type { DefDictItemResultVO } from '@/api/devOperation/system/model/defDictItemModel.ts'
import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  BasePositionPageQuery,
  BasePositionResultVO,
  BasePositionSaveVO,
  BasePositionUpdateVO,
} from './model/basePositionModel.ts'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const ServicePrefix = ''
const MODULAR = 'basePosition'

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

export function tree(params?: BasePositionPageQuery) {
  return requestClient.post<BasePositionResultVO>(`${ServicePrefix}/${MODULAR}/tree`, params)
}
export function page(params: PageParams<BasePositionPageQuery>) {
  return requestClient.post<PageResult<BasePositionResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function query(params?: BasePositionPageQuery) {
  return requestClient.post<BasePositionResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export function save(params: BasePositionSaveVO) {
  return requestClient.post<BasePositionResultVO>(Api.Save.url, params)
}

export function update(params: BasePositionUpdateVO) {
  return requestClient.put<BasePositionResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}
export function get(id: string) {
  return requestClient.get<DefDictItemResultVO>(`${ServicePrefix}/${MODULAR}/${id}`)
}

export async function pageRequest(pageQuery: PageParams<BasePositionPageQuery>): Promise<UserPageRes> {
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
