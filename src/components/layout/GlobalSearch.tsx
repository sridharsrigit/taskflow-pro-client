'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, TextField, Paper, List, ListItem,
  ListItemButton, Typography, Chip,
  Avatar, Divider, CircularProgress,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TaskIcon from '@mui/icons-material/Assignment'
import { useSearch } from '@/lib/queries/search'
import TaskDetailModal from '@/components/tasks/TaskDetailModal'

const statusColors: Record<string, string> = {
  Todo: '#64748b',
  InProgress: '#2563eb',
  InReview: '#7c3aed',
  Done: '#16a34a',
  Cancelled: '#dc2626',
}

export default function GlobalSearch() {
  const router                        = useRouter()
  const [query,       setQuery]       = useState('')
  const [debouncedQ,  setDebouncedQ]  = useState('')
  const [open,        setOpen]        = useState(false)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const containerRef                  = useRef<HTMLDivElement>(null)

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  // Open dropdown when query has 2+ chars
  useEffect(() => {
    setOpen(debouncedQ.length >= 2)
  }, [debouncedQ])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current &&
          !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const { data: results, isLoading } = useSearch(debouncedQ)

  const hasResults = results &&
    (results.tasks.length > 0 || results.users.length > 0)

  return (
    <>
      <Box
        ref={containerRef}
        sx={{ position: 'relative', width: { xs: 200, md: 320 } }}
      >
        <TextField
          size="small"
          placeholder="Search tasks, people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  {isLoading && debouncedQ.length >= 2
                    ? <CircularProgress size={16} />
                    : <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                  }
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#f8fafc',
              borderRadius: 2,
              '& fieldset': { borderColor: '#e2e8f0' },
            },
          }}
        />

        {/* Dropdown Results */}
        {open && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              maxHeight: 400,
              overflow: 'auto',
              zIndex: 9999,
              borderRadius: 2,
              border: '1px solid #e2e8f0',
            }}
          >
            {!hasResults && !isLoading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary' }}
                >
                  No results for "{debouncedQ}"
                </Typography>
              </Box>
            ) : (
              <List disablePadding>

                {/* Task Results */}
                {results && results.tasks.length > 0 && (
                  <>
                    <ListItem sx={{ py: 1, px: 2, bgcolor: '#f8fafc' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}
                      >
                        Tasks ({results.tasks.length})
                      </Typography>
                    </ListItem>

                    {results.tasks.map((task) => (
                      <ListItemButton
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task.id)
                          setOpen(false)
                          setQuery('')
                        }}
                        sx={{ px: 2, py: 1 }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.5,
                          }}>
                            <TaskIcon sx={{
                              fontSize: 16,
                              color: '#94a3b8',
                            }} />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, flexGrow: 1 }}
                              noWrap
                            >
                              {task.title}
                            </Typography>
                            <Chip
                              label={task.status}
                              size="small"
                              sx={{
                                bgcolor: statusColors[task.status],
                                color: 'white',
                                height: 18,
                                fontSize: 10,
                              }}
                            />
                          </Box>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}>
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary' }}
                            >
                              {task.assignedToName}
                            </Typography>
                            {task.isOverdue && (
                              <Typography
                                variant="caption"
                                sx={{ color: 'error.main', fontWeight: 600 }}
                              >
                                • Overdue
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </ListItemButton>
                    ))}
                  </>
                )}

                {/* Divider between sections */}
                {results &&
                  results.tasks.length > 0 &&
                  results.users.length > 0 && (
                  <Divider />
                )}

                {/* User Results */}
                {results && results.users.length > 0 && (
                  <>
                    <ListItem sx={{ py: 1, px: 2, bgcolor: '#f8fafc' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                        }}
                      >
                        People ({results.users.length})
                      </Typography>
                    </ListItem>

                    {results.users.map((user) => (
                      <ListItemButton
                        key={user.id}
                        onClick={() => {
                          router.push(`/employees/${user.id}`)
                          setOpen(false)
                          setQuery('')
                        }}
                        sx={{ px: 2, py: 1 }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                        }}>
                          <Avatar sx={{
                            width: 28,
                            height: 28,
                            fontSize: 12,
                            bgcolor: '#2563eb',
                          }}>
                            {user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {user.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: 'text.secondary' }}
                            >
                              {user.role} • {user.department}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItemButton>
                    ))}
                  </>
                )}
              </List>
            )}
          </Paper>
        )}
      </Box>

      {/* Task Detail Modal triggered from search */}
      <TaskDetailModal
        taskId={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  )
}
