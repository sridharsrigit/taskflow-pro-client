import {
  Card, CardContent, Typography,
  List, ListItem, Box, Chip, Divider,
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import { Task } from '@/types'

interface Props {
  tasks: Task[]
}

export default function OverduePanel({ tasks }: Props) {
  return (
    <Card>
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
            sx={{ ml: 'auto' }}
          />
        </Box>

        {tasks.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            No overdue tasks!
          </Typography>
        ) : (
          <List disablePadding>
            {tasks.slice(0, 6).map((task, i) => {
              const daysOverdue = Math.floor(
                (Date.now() - new Date(task.dueDate).getTime()) / 86400000
              )
              return (
                <Box key={task.id}>
                  {i > 0 && <Divider />}
                  <ListItem disablePadding sx={{ py: 1.5 }}>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                       <Typography variant="body2" noWrap sx={{ fontWeight: 600, maxWidth: '60%' }}>
                          {task.title}
                        </Typography>
                        <Chip
                          label={`${daysOverdue}d overdue`}
                          size="small"
                          color="error"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Assigned to: {task.assignedToName}
                      </Typography>
                    </Box>
                  </ListItem>
                </Box>
              )
            })}
          </List>
        )}
      </CardContent>
    </Card>
  )
}