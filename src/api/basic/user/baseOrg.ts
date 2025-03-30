import type { DefDictItemResultVO } from '@/api/devOperation/system/model/defDictItemModel.ts'
import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  BaseOrgPageQuery,
  BaseOrgResultVO,
  BaseOrgRoleRelSaveVO,
  BaseOrgSaveVO,
  BaseOrgUpdateVO,
} from './model/baseOrgModel.ts'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const ServicePrefix = ''
const MODULAR = 'baseOrg'

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

export function tree(params: BaseOrgPageQuery) {
  return requestClient.post<BaseOrgResultVO[]>(`${ServicePrefix}/${MODULAR}/tree`, params)
}
export function page(params: PageParams<BaseOrgPageQuery>) {
  return requestClient.post<PageResult<BaseOrgResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function query(params?: BaseOrgPageQuery) {
  return requestClient.post<BaseOrgResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export function save(params: BaseOrgSaveVO) {
  return requestClient.post<BaseOrgResultVO>(Api.Save.url, params)
}

// 查询机构拥有的角色
export function findOrgRoleByOrgId(orgId: string) {
  return requestClient.get<string[]>(`${ServicePrefix}/${MODULAR}/findOrgRoleByOrgId`, { params: { orgId } })
}

export function update(params: BaseOrgUpdateVO) {
  return requestClient.put<BaseOrgResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}
export function get(id: string) {
  return requestClient.get<DefDictItemResultVO>(`${ServicePrefix}/${MODULAR}/${id}`)
}

export async function pageRequest(pageQuery: PageParams<BaseOrgPageQuery>): Promise<UserPageRes> {
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

// 给机构绑定角色
export function saveOrgRole(params: BaseOrgRoleRelSaveVO) {
  return requestClient.post<string[]>(`${ServicePrefix}/${MODULAR}/saveOrgRole`, params)
}
