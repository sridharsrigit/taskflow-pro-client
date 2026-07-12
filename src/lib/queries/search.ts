import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface SearchResults {
  tasks: SearchTask[]
  users: SearchUser[]
  totalCount: number
}

export interface SearchTask {
  id: string
  title: string
  status: string
  priority: string
  assignedToName: string
  dueDate: string
  isOverdue: boolean
}

export interface SearchUser {
  id: string
  name: string
  email: string
  role: string
  department: string
}

export const useSearch = (query: string) =>
  useQuery<SearchResults>({
    queryKey: ['search', query],
    queryFn: () =>
      api.get(`/search?q=${encodeURIComponent(query)}`)
         .then((r) => r.data),
    enabled: query.length >= 2,
    staleTime: 10_000,
  })
