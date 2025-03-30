import { requestClient } from '@/api'

export function login(data: {
  account: string
  password: string
}) {
  return requestClient.post('/login', data)
}

// 获取收藏夹
export function favorites() {
  return requestClient.get('/user/favorites', {
    baseURL: '/mock/',
  })
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

// 修改收藏夹
export function favoritesEdit(favorites: string) {
  return requestClient.post('/user/favorites/edit', favorites, { baseURL: '/mock/' })
}
