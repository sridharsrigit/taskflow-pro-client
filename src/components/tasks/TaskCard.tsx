import {
  Card, CardContent, Typography,
  Box, Chip, Avatar, Tooltip,
} from '@mui/material'
import CalendarIcon from '@mui/icons-material/CalendarToday'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { Task } from '@/types'
import { format } from 'date-fns'

interface Props {
  task: Task
  onClick: (task: Task) => void
}

export default function TaskCard({ task, onClick }: Props) {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return '#dc2626'
      case 'high': return '#f59e0b'
      case 'medium': return '#2563eb'
      default: return '#94a3b8'
    }
  }

  const isOverdue = new Date(task.dueDate).getTime() < Date.now() && task.status !== 'Done'

  return (
    <Card
      onClick={() => onClick(task)}
      sx={{
        mb: 1.5,
        cursor: 'pointer',
        borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
        bgcolor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)'
        },
      }}
    >
      <CardContent sx={{ p: '12px !important' }}>

        {/* Header: Title + Risk Emoji */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#0f172a',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
              mr: 1
            }}
          >
            {task.title}
          </Typography>
          {task.isHighRisk && (
            <Tooltip title="High Risk">
              <Typography sx={{ fontSize: '1.1rem' }}>🔥</Typography>
            </Tooltip>
          )}
        </Box>

        {/* Description Preview */}
        {task.description && (
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              display: 'block',
              mb: 1.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Footer row */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 1
        }}>
          {/* Left: Avatar + Due Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title={task.assignedToName}>
              <Avatar sx={{
                width: 24, height: 24,
                fontSize: '0.75rem',
                bgcolor: '#e2e8f0',
                color: '#475569',
                fontWeight: 600
              }}>
                {task.assignedToName?.charAt(0)}
              </Avatar>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarIcon sx={{ fontSize: 14, color: isOverdue ? '#dc2626' : '#94a3b8' }} />
              <Typography
                variant="caption"
                sx={{
                  color: isOverdue ? '#dc2626' : '#64748b',
                  fontWeight: isOverdue ? 600 : 500
                }}
              >
                {format(new Date(task.dueDate), 'MMM d')}
              </Typography>
            </Box>
          </Box>

          {/* Right: Priority + Comments */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={task.priority}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 600,
                bgcolor: `${getPriorityColor(task.priority)}15`,
                color: getPriorityColor(task.priority),
                borderRadius: 1
              }}
            />
            {task.commentCount > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                <ForumOutlinedIcon sx={{ fontSize: 16, mr: 1.5, color: '#64748b' }} />                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {task.commentCount}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}