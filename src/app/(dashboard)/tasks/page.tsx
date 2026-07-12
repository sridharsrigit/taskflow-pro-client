'use client'

import { useState, useMemo } from 'react'
import { Box, Button, Typography, TextField, InputAdornment, ToggleButton, ToggleButtonGroup } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import TopBar from '@/components/layout/TopBar'
import KanbanBoard from '@/components/tasks/KanbanBoard'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import { useTasks, useMyTasks } from '@/lib/queries/tasks'
import { useAuthStore } from '@/store/authStore'

export default function TasksPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const { user } = useAuthStore()

  const isEmployee = user?.role === 'Employee'

  const { data: allTasks, isLoading: loadingAll, error: errorAll } = useTasks()
  const { data: myTasks, isLoading: loadingMy } = useMyTasks()

  const baseTasks = isEmployee ? myTasks : allTasks
  const isLoading = isEmployee ? loadingMy : loadingAll

  const filteredTasks = useMemo(() => {
    if (!baseTasks) return []
    let result = baseTasks

    // Apply text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description?.toLowerCase().includes(q) ||
        t.assignedToName?.toLowerCase().includes(q)
      )
    }

    // Apply quick filters
    if (filter === 'High Priority') {
      result = result.filter(t => t.priority === 'High' || t.priority === 'Critical')
    } else if (filter === 'Overdue') {
      result = result.filter(t => new Date(t.dueDate).getTime() < Date.now() && t.status !== 'Done')
    }

    return result
  }, [baseTasks, searchQuery, filter])

  if (isLoading) return <LoadingSpinner message="Loading tasks..." />
  if (errorAll)  return <ErrorMessage message="Failed to load tasks" />

  return (
    <Box>
      <TopBar title={isEmployee ? 'My Tasks' : 'Task Board'} />
      <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto' }}>

        {/* Header Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}> 
              {isEmployee ? 'My Tasks' : 'Kanban Board'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredTasks.length} tasks match your criteria
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', md: 'auto' } }}>
            {/* Search Bar */}
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: '100%', md: 250 }, bgcolor: 'white', borderRadius: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />

            {/* Create Task Button (Manager/Admin) */}
            {!isEmployee && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateOpen(true)}
                sx={{ 
                  bgcolor: '#2563eb', 
                  textTransform: 'none', 
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(37,99,235,0.2)' 
                }}
              >
                Create Task
              </Button>
            )}
          </Box>
        </Box>

        {/* Filters Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <FilterAltIcon sx={{ color: '#94a3b8' }} />
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, newFilter) => { if (newFilter) setFilter(newFilter) }}
            size="small"
            sx={{
              bgcolor: 'white',
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                color: '#64748b',
                border: '1px solid #e2e8f0',
                '&.Mui-selected': {
                  bgcolor: '#2563eb',
                  color: 'white',
                  '&:hover': { bgcolor: '#1d4ed8' }
                }
              }
            }}
          >
            <ToggleButton value="All">All Tasks</ToggleButton>
            <ToggleButton value="High Priority">High Priority</ToggleButton>
            <ToggleButton value="Overdue">Overdue</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Kanban Board */}
        <KanbanBoard tasks={filteredTasks} />

        {/* Create Task Modal */}
        <CreateTaskForm
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </Box>
    </Box>
  )
}