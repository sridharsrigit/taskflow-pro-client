'use client'

import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TopBar from '@/components/layout/TopBar'
import KanbanBoard from '@/components/tasks/KanbanBoard'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import { useTasks, useMyTasks } from '@/lib/queries/tasks'
import { useAuthStore } from '@/store/authStore'

export default function TasksPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { user } = useAuthStore()

  const isEmployee = user?.role === 'Employee'

  const {
    data: allTasks,
    isLoading: loadingAll,
    error: errorAll,
  } = useTasks()

  const {
    data: myTasks,
    isLoading: loadingMy,
  } = useMyTasks()

  const tasks     = isEmployee ? myTasks : allTasks
  const isLoading = isEmployee ? loadingMy : loadingAll

  if (isLoading) return <LoadingSpinner message="Loading tasks..." />
  if (errorAll)  return <ErrorMessage message="Failed to load tasks" />

  return (
    <Box>
      <TopBar title={isEmployee ? 'My Tasks' : 'Task Board'} />
      <Box sx={{ p: 3 }}>

        {/* Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}> 
              {isEmployee ? 'My Tasks' : 'Kanban Board'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tasks?.length ?? 0} tasks total
            </Typography>
          </Box>

          {/* Only Managers and Admins can create tasks */}
          {!isEmployee && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateOpen(true)}
            >
              Create Task
            </Button>
          )}
        </Box>

        {/* Kanban Board */}
        <KanbanBoard tasks={tasks ?? []} />

        {/* Create Task Modal */}
        <CreateTaskForm
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </Box>
    </Box>
  )
}