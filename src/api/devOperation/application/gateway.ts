import { requestClient } from '@/api'

const ServicePrefix = '/gateway'

export const findOnlineServicePrefix = () => requestClient.get<Recordable>(`${ServicePrefix}/findOnlineServicePrefix`)

export const findOnlineService = () => requestClient.get<Recordable[]>(`${ServicePrefix}/findOnlineService`)
