import type { DefParameterPageQuery, DefParameterResultVO } from '@/api/devOperation/system/model/defParameterModel.ts'

import type { PageParams, PageResult } from '@/api/model/baseModel'
import type { InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import { requestClient } from '@/api'
import { ContentTypeEnum } from '@/enums/httpEnum'

const MODULAR = 'defUser/onlineUsers'
const ServicePrefix = ''

export function page(params: PageParams<DefParameterPageQuery>) {
  return requestClient.post<PageResult<DefParameterResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}
export function getTokenSignList(params: PageParams<any>) {
  return requestClient.post<PageResult<DefParameterResultVO>>(`${ServicePrefix}/${MODULAR}/getTokenSignList`, params)
}

export function kickout(userId?: string, token?: string) {
  return requestClient.post<PageResult<DefParameterResultVO>>(`${ServicePrefix}/${MODULAR}/kickout`, { userId, token }, {
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  })
}
export function logout(userId?: string, token?: string) {
  return requestClient.post<PageResult<DefParameterResultVO>>(`${ServicePrefix}/${MODULAR}/logout`, { userId, token }, {
    headers: {
      'Content-Type': ContentTypeEnum.FORM_URLENCODED,
    },
  })
}

export async function pageRequest(pageQuery: PageParams<DefParameterPageQuery>): Promise<UserPageRes> {
  return await page(pageQuery)
}
export async function getTokenSignListRequest(pageQuery: PageParams<DefParameterPageQuery>): Promise<UserPageRes> {
  return await getTokenSignList(pageQuery)
}

export async function infoRequest(ctx: InfoReq): Promise<UserPageRes> {
  const { row } = ctx

  // 请求后台查询数据
  return row
}
