import type { DefUserInfoResultVO, VisibleResourceVO } from './model/oauthModel.ts'
import { requestClient } from '@/api'

const ServicePrefix = ''
export function login(data: {
  account: string
  password: string
}) {
  return requestClient.post('/login', data)
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi(params: { refreshToken: string }) {
  return requestClient.post<{
    token: string
    tenantId: string
    refreshToken: string
    expiration: string
  }>('/anyTenant/refresh', {}, {
    params,
    withCredentials: true,
  })
}

export function findResourceList(applicationId?: string) {
  return requestClient.get<VisibleResourceVO>('/anyone/visible/resource', {
    params: { type: 'KPU_WEB_PRO_KPU', applicationId },
  })
}
/**
 * @description: getUserInfoById
 */
export function getUserInfoById(userId?: string) {
  return requestClient.get<DefUserInfoResultVO>(`${ServicePrefix}/anyone/getUserInfoById`, {
    timeout: 2 * 60 * 1000,
    params: { userId },
  })
}

// 获取收藏夹
export function favorites() {
  return requestClient.get('/user/favorites', {
    baseURL: '/mock/',
  })
}
// 修改收藏夹
export function favoritesEdit(favorites: string) {
  return requestClient.post('/user/favorites/edit', favorites, { baseURL: '/mock/' })
}
export function sendSmsCode(mobile: string, templateCode: string) {
  return requestClient.get<string>(`${ServicePrefix}/anyTenant/sendSmsCode`, {
    params: {
      mobile,
      templateCode,
    },
  })
}
