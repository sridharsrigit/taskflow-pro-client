import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { TaskSummary, TeamMember } from '@/types'

export const useSummary = () =>
  useQuery<TaskSummary>({
    queryKey: ['summary'],
    queryFn: () => api.get('/reports/summary').then((r) => r.data),
  })

export const useTeamBreakdown = () =>
  useQuery<TeamMember[]>({
    queryKey: ['team-breakdown'],
    queryFn: () => api.get('/reports/team').then((r) => r.data),
  })

export const useProductivity = () =>
  useQuery({
    queryKey: ['productivity'],
    queryFn: () => api.get('/reports/productivity').then((r) => r.data),
  })

export const useWorkload = () =>
  useQuery({
    queryKey: ['workload'],
    queryFn: () => api.get('/reports/workload').then((r) => r.data),
  })