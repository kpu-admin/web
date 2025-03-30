import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type { BaseFilePageQuery, BaseFileResultVO } from './model/baseFileModel.ts'
import { requestClient } from '@/api'

const MODULAR = 'file'
const ServicePrefix = ''

export function page(params: PageParams<BaseFilePageQuery>) {
  return requestClient.post<PageResult<BaseFileResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export async function pageRequest(pageQuery: PageParams<BaseFilePageQuery>): Promise<UserPageRes> {
  return await page(pageQuery)
}

export async function delRequest(ctx: DelReq) {
  const { row } = ctx
  return await remove([row.id])
}
export async function removeFn(ids: string[]) {
  return await remove(ids)
}
export async function addRequest(_req: AddReq) {
  return {}
}

export async function infoRequest(ctx: InfoReq): Promise<UserPageRes> {
  const { row } = ctx

  // 请求后台查询数据
  return row
}
