import {
  Card, CardContent, Typography,
  Box, Chip, Avatar, Tooltip,
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import CalendarIcon from '@mui/icons-material/CalendarToday'
import { Task } from '@/types'
import { format } from 'date-fns'

interface Props {
  task: Task
  onClick: (task: Task) => void
}

const priorityColors: Record<string, 'default' | 'warning' | 'error' | 'primary'> = {
  Low:      'default',
  Medium:   'primary',
  High:     'warning',
  Critical: 'error',
}

export default function TaskCard({ task, onClick }: Props) {
  return (
    <Card
      onClick={() => onClick(task)}
      sx={{
        mb: 1.5, cursor: 'pointer',
        border: task.isOverdue ? '1px solid #fecaca' : '1px solid #e2e8f0',
        bgcolor: task.isOverdue ? '#fff5f5' : 'white',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-1px)',
          transition: 'all 0.2s ease',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>

        {/* Priority + Risk badges */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={task.priority}
            size="small"
            color={priorityColors[task.priority]}
            variant="outlined"
          />
          {task.isHighRisk && (
            <Chip
              icon={<WarningIcon style={{ fontSize: 12 }} />}
              label="High Risk"
              size="small"
              color="error"
              variant="filled"
            />
          )}
          {task.isOverdue && (
            <Chip
              label="Overdue"
              size="small"
              color="error"
              variant="filled"
            />
          )}
        </Box>

        {/* Title */}
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, lineHeight: 1.4 }}>
          {task.title}
        </Typography>

        {/* Footer */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Assignee */}
          <Tooltip title={task.assignedToName}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: '#3b82f6' }}>
                {task.assignedToName?.charAt(0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 80 }}>
                {task.assignedToName}
              </Typography>
            </Box>
          </Tooltip>

          {/* Due date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarIcon sx={{ fontSize: 12, color: task.isOverdue ? 'error.main' : 'text.disabled' }} />
            <Typography
              variant="caption"
              color={task.isOverdue ? 'error.main' : 'text.secondary'}
            >
              {format(new Date(task.dueDate), 'dd MMM')}
            </Typography>
          </Box>
        </Box>

        {/* Comment count */}
        {task.commentCount > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            💬 {task.commentCount} comment{task.commentCount > 1 ? 's' : ''}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}