import type { PageParams, PageResult } from '@/api/model/baseModel.ts'

import type { StandardModuleExampleResultVO } from '@/api/modules/model/standardModuleExampleModel.ts'
import type { DelReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  BaseOperationLogPageQuery,
  BaseOperationLogResultVO,
} from './model/baseOperationLogModel.ts'
import { requestClient } from '@/api'
import { ContentTypeEnum } from '@/enums/httpEnum.ts'

const MODULAR = 'baseOperationLog'
const ServicePrefix = ''

export function page(params: PageParams<BaseOperationLogPageQuery>) {
  return requestClient.post<PageResult<BaseOperationLogResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}
export function detail(id: string) {
  return requestClient.get<StandardModuleExampleResultVO>(`${ServicePrefix}/${MODULAR}/detail`, { params: { id } })
}
export function query(params?: BaseOperationLogPageQuery) {
  return requestClient.post<BaseOperationLogResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export async function pageRequest(pageQuery: PageParams<BaseOperationLogPageQuery>): Promise<UserPageRes> {
  return await page(pageQuery)
}

export async function infoRequest(ctx: InfoReq): Promise<UserPageRes> {
  const { row } = ctx

  // 请求后台查询数据
  return await detail(row.id)
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
