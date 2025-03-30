import type { DefDictItemResultVO } from '@/api/devOperation/system/model/defDictItemModel.ts'
import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type { AxiosRequestConfig } from 'axios'
import type {
  BaseEmployeePageQuery,
  BaseEmployeeResultVO,
  BaseEmployeeRoleRelSaveVO,
  BaseEmployeeSaveVO,
  BaseEmployeeUpdateVO,
  DefTenantBindUserVO,
} from './model/baseEmployeeModel'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const ServicePrefix = ''
const MODULAR = 'baseEmployee'

export const Api = {

  Save: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.POST,
  },
  Update: {
    url: `${ServicePrefix}/${MODULAR}`,
    method: RequestEnum.PUT,
  },
  BindUser: {
    url: `${ServicePrefix}/${MODULAR}/bindUser`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  InvitationUser: {
    url: `${ServicePrefix}/${MODULAR}/invitationUser`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  BindTenantAdmin: {
    url: `${ServicePrefix}/${MODULAR}/bindTenantAdmin`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  EmployeeRole: {
    url: `${ServicePrefix}/${MODULAR}/employeeRole`,
    method: RequestEnum.POST,
  } as AxiosRequestConfig,
  FindEmployeeRoleByEmployeeId: {
    url: `${ServicePrefix}/${MODULAR}/findEmployeeRoleByEmployeeId`,
    method: RequestEnum.GET,
  } as AxiosRequestConfig,
}

export function page(params: PageParams<BaseEmployeePageQuery>) {
  return requestClient.post<PageResult<BaseEmployeeResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

export function query(params?: BaseEmployeePageQuery) {
  return requestClient.post<BaseEmployeeResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export function save(params: BaseEmployeeSaveVO) {
  return requestClient.post<BaseEmployeeResultVO>(Api.Save.url, params)
}

export function update(params: BaseEmployeeUpdateVO) {
  return requestClient.put<BaseEmployeeResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}
export function get(id: string) {
  return requestClient.get<DefDictItemResultVO>(`${ServicePrefix}/${MODULAR}/${id}`)
}

// 绑定/解绑用户为企业的员工，并设置为租户管理员
export function bindUser(params: DefTenantBindUserVO) {
  return requestClient.post<boolean>(`${ServicePrefix}/${MODULAR}/bindUser`, params)
}

// 租户绑定或解绑用户
export function invitationUser(params: DefTenantBindUserVO) {
  return requestClient.post<boolean>(`${ServicePrefix}/${MODULAR}/invitationUser`, params)
}

// 绑定/解绑用户为企业的租户管理员
export function bindTenantAdmin(params: DefTenantBindUserVO) {
  return requestClient.post<boolean>(`${ServicePrefix}/${MODULAR}/bindTenantAdmin`, params)
}
export function findByIds(ids: string[]) {
  return requestClient.post<BaseEmployeeResultVO[]>(`${ServicePrefix}/${MODULAR}/findByIds`, ids)
}
// 查询员工拥有的角色
export function findEmployeeRoleByEmployeeId(employeeId: string) {
  return requestClient.get<string[]>(`${ServicePrefix}/${MODULAR}/findEmployeeRoleByEmployeeId`, { params: { employeeId } })
}
// 给员工绑定角色
export function saveEmployeeRole(params: BaseEmployeeRoleRelSaveVO) {
  return requestClient.post<string[]>(`${ServicePrefix}/${MODULAR}/employeeRole`, params)
}

export async function pageRequest(pageQuery: PageParams<BaseEmployeePageQuery>): Promise<UserPageRes> {
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
