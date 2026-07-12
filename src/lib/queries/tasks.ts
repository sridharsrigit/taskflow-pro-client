import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Task, CreateTaskData, UpdateTaskData } from '@/types'
import { useToastStore } from '@/store/toastStore'

export const useTasks = () =>
  useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks').then((r) => r.data),
  })

export const useTask = (id: string) =>
  useQuery<Task>({
    queryKey: ['tasks', id],
    queryFn: () => api.get(`/tasks/${id}`).then((r) => r.data),
    enabled: !!id,
  })

export const useMyTasks = () =>
  useQuery<Task[]>({
    queryKey: ['my-tasks'],
    queryFn: () => api.get('/tasks/my-tasks').then((r) => r.data),
  })

export const useOverdueTasks = () =>
  useQuery<Task[]>({
    queryKey: ['overdue-tasks'],
    queryFn: () => api.get('/tasks/overdue').then((r) => r.data),
  })

export const useCreateTask = () => {
  const qc = useQueryClient()
  const { showToast } = useToastStore()
  return useMutation({
    mutationFn: (data: CreateTaskData) =>
      api.post('/tasks', data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['summary'] })
      showToast('Task created successfully', 'success')
    },
    onError: () => showToast('Failed to create task', 'error')
  })
}

export const useUpdateTask = () => {
  const qc = useQueryClient()
  const { showToast } = useToastStore()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) =>
      api.put(`/tasks/${id}`, data).then((r) => r.data),
    onSuccess: (updatedTask) => {
      // Refetch everything so kanban board reflects real DB state
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['my-tasks'] })
      qc.invalidateQueries({ queryKey: ['summary'] })
      qc.invalidateQueries({ queryKey: ['overdue-tasks'] })
      showToast('Task updated successfully', 'success')
    },
    onError: () => showToast('Failed to update task', 'error')
  })
}

export const useDeleteTask = () => {
  const qc = useQueryClient()
  const { showToast } = useToastStore()
  return useMutation({
    mutationFn: (id: string) =>
      api.delete(`/tasks/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      qc.invalidateQueries({ queryKey: ['summary'] })
      showToast('Task deleted successfully', 'success')
    },
    onError: () => showToast('Failed to delete task', 'error')
  })
}

export const useAddComment = () => {
  const qc = useQueryClient()
  const { showToast } = useToastStore()
  return useMutation({
    mutationFn: ({ taskId, message }: { taskId: string; message: string }) =>
      api.post(`/tasks/${taskId}/comments`, { message }).then((r) => r.data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['tasks', variables.taskId] })
      qc.invalidateQueries({ queryKey: ['tasks'] })
      showToast('Comment added successfully', 'success')
    },
    onError: () => showToast('Failed to add comment', 'error')
  })
}