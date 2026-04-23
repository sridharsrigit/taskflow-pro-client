import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { User } from '@/types'

export const useUsers = () =>
  useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then((r) => r.data),
  })

export const useEmployees = () =>
  useQuery<User[]>({
    queryKey: ['employees'],
    queryFn: () => api.get('/users/employees').then((r) => r.data),
  })

export const useUserStats = (id: string) =>
  useQuery({
    queryKey: ['user-stats', id],
    queryFn: () => api.get(`/users/${id}/stats`).then((r) => r.data),
    enabled: !!id,
  })