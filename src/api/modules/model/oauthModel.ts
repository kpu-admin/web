import type { Route } from '#/global'
import type { BaseEmployeeResultVO } from '@/api/basic/user/model/baseEmployeeModel.ts'
import type { DefApplicationResultVO } from '@/api/devOperation/application/model/defApplicationModel.ts'

/**
 * @description: 获取用户的资源和角色
 */
export interface VisibleResourceVO {
  // 是否启用
  enabled: boolean
  // 区分大小写
  caseSensitive: boolean
  // 拥有的资源编码
  resourceList: string[]
  // 用用的角色编码
  roleList: string[]
  routerList: Route.recordMainRaw[]
}

export interface DefUserInfoResultVO {
  echoMap: Record<string, any>
  createdTime: string
  createdBy: string
  updatedTime: string
  updatedBy: string
  id: string
  username: string
  nickName: string
  email: string
  mobile: string
  idCard: string
  wxOpenId: string
  ddOpenId: string
  readonly: boolean
  sex: string
  nation: string
  education: string
  state: boolean
  avatar: string
  avatarId?: string
  workDescribe: string
  employeeId: string
  baseEmployee: BaseEmployeeResultVO
  defApplication: DefApplicationResultVO
  homePath?: string
}
