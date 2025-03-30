import type { PageParams, PageResult } from '@/api/model/baseModel.ts'
import type { AddReq, DelReq, EditReq, InfoReq, UserPageRes } from '@fast-crud/fast-crud'
import type {
  BaseRolePageQuery,
  BaseRoleResourceRelSaveVO,
  BaseRoleResultVO,
  BaseRoleSaveVO,
  BaseRoleUpdateVO,
  RoleEmployeeSaveVO,
} from './model/baseRoleModel'
import { requestClient } from '@/api'
import { RequestEnum } from '@/enums/httpEnum'

const ServicePrefix = ''
const MODULAR = 'baseRole'

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
// 查询全部角色
export function page(params: PageParams<BaseRolePageQuery>) {
  return requestClient.post<PageResult<BaseRoleResultVO>>(`${ServicePrefix}/${MODULAR}/page`, params)
}

// 查询全部角色 或 我的角色 或 未绑定的角色
export function pageMyRole(params: PageParams<BaseRolePageQuery>) {
  return requestClient.post<PageResult<BaseRoleResultVO>>(`${ServicePrefix}/${MODULAR}/pageMyRole`, params)
}

export function query(params?: BaseRolePageQuery) {
  return requestClient.post<BaseRoleResultVO[]>(`${ServicePrefix}/${MODULAR}/query`, params)
}

export function save(params: BaseRoleSaveVO) {
  return requestClient.post<BaseRoleResultVO>(Api.Save.url, params)
}

export function update(params: BaseRoleUpdateVO) {
  return requestClient.put<BaseRoleResultVO>(Api.Update.url, params)
}

export function remove(ids: string[]) {
  return requestClient.delete<boolean>(`${ServicePrefix}/${MODULAR}`, {
    data: ids,
  })
}

export function saveRoleEmployee(params: RoleEmployeeSaveVO) {
  return requestClient.post<string[]>(`${ServicePrefix}/${MODULAR}/roleEmployee`, params)
}

export function saveRoleResource(params: BaseRoleResourceRelSaveVO) {
  return requestClient.post<boolean>(`${ServicePrefix}/${MODULAR}/roleResource`, params)
}

export function findEmployeeIdByRoleId(roleId: string) {
  return requestClient.get<string[]>(`${ServicePrefix}/${MODULAR}/employeeList`, { params: { roleId } })
}

export function findResourceIdByRoleId(roleId: string) {
  return requestClient.get<Recordable>(`${ServicePrefix}/${MODULAR}/resourceList`, { params: { roleId } })
}

export function findResourceDataScopeIdByRoleId(roleId: string) {
  return requestClient.get<Recordable>(`${ServicePrefix}/${MODULAR}/findResourceDataScopeIdByRoleId`, { params: { roleId } })
}

export async function pageRequest(pageQuery: PageParams<BaseRolePageQuery>): Promise<UserPageRes> {
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
