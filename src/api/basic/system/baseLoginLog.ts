import type { PageParams, PageResult } from '@/api/model/baseModel.ts'

import type { DelReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  BaseLoginLogPageQuery,
  BaseLoginLogResultVO,
} from './model/baseLoginLogModel.ts'
import { requestClient } from '@/api'
import { ContentTypeEnum } from '@/enums/httpEnum.ts'

const MODULAR = 'baseLoginLog'
const ServicePrefix = ''

export function page(params: PageParams<BaseLoginLogPageQuery>) {
  return requestClient.post<PageResult<BaseLoginLogResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function query(params?: BaseLoginLogPageQuery) {
  return requestClient.post<BaseLoginLogResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export async function pageRequest(pageQuery: PageParams<BaseLoginLogPageQuery>): Promise<UserPageRes> {
  return await page(pageQuery)
}
export function anyonePage(params: PageParams<BaseLoginLogPageQuery>) {
  return requestClient.post<PageResult<BaseLoginLogResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}
export async function infoRequest(ctx: InfoReq): Promise<UserPageRes> {
  const { row } = ctx

  // 请求后台查询数据
  return row
}

export async function delRequest(ctx: DelReq) {
  const { row } = ctx
  return await remove([row.id])
}

export async function removeFn(ids: string[]) {
  return await remove(ids)
}

// export const clear = (type: string | number) =>
//   defHttp.request<boolean>({
//     ...Api.Clear,
//     params: { type },
//     headers: {
//       'Content-Type': ContentTypeEnum.FORM_URLENCODED,
//     },
//   });

export function clear(type: string | number) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}/clear`, {
    params: { type },
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },

  })
}
