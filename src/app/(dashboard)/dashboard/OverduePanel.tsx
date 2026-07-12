import { useState } from 'react'
import {
  Card, CardContent, Typography,
  List, ListItem, Box, Chip, Divider, IconButton, Menu, MenuItem
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import Avatar from '@mui/material/Avatar'
import { Task } from '@/types'

interface Props {
  tasks: Task[]
}

export default function OverduePanel({ tasks }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const handleReassignClick = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedTask(taskId)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedTask(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return '#dc2626'
      case 'high': return '#f59e0b'
      case 'medium': return '#2563eb'
      default: return '#64748b'
    }
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Overdue Tasks
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            color="error"
            sx={{ ml: 'auto', fontWeight: 700 }}
          />
        </Box>

        {tasks.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">
              All caught up! No overdue tasks.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {tasks.slice(0, 6).map((task, i) => {
              const daysOverdue = Math.floor(
                (Date.now() - new Date(task.dueDate).getTime()) / 86400000
              )
              return (
                <Box key={task.id}>
                  {i > 0 && <Divider />}
                  <ListItem disablePadding sx={{ py: 2 }}>
                    <Box sx={{ 
                      width: '100%', 
                      borderLeft: '4px solid #dc2626',
                      pl: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, maxWidth: '65%' }}>
                          {task.title}
                        </Typography>
                        <Chip
                          label={`${daysOverdue}d overdue`}
                          size="small"
                          sx={{ bgcolor: '#fef2f2', color: '#dc2626', fontWeight: 600, height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', bgcolor: '#e2e8f0', color: '#475569' }}>
                            {task.assignedToName?.charAt(0)}
                          </Avatar>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 100 }}>
                            {task.assignedToName}
                          </Typography>
                          <Chip 
                            label={task.priority} 
                            size="small" 
                            sx={{ 
                              height: 18, 
                              fontSize: '0.65rem',
                              bgcolor: `${getPriorityColor(task.priority)}15`,
                              color: getPriorityColor(task.priority),
                              fontWeight: 600,
                              ml: 1
                            }} 
                          />
                        </Box>

                        <IconButton size="small" onClick={(e) => handleReassignClick(e, task.id)} sx={{ bgcolor: '#f1f5f9' }}>
                          <SwapHorizIcon fontSize="small" color="action" />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                </Box>
              )
            })}
          </List>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{ sx: { width: 200 } }}
        >
          <MenuItem disabled sx={{ opacity: '1 !important' }}>
            <Typography variant="caption" color="text.secondary">Select new assignee:</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Arjun (Manager)</MenuItem>
          <MenuItem onClick={handleClose}>Rahul (Employee)</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  )
}