import {
  Grid, Card, CardContent,
  Typography, Box,
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import HourglassIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import { TaskSummary } from '@/types'

interface Props {
  summary: TaskSummary
}

export default function SummaryCards({ summary }: Props) {
  const cards = [
    {
      label:   'Total Tasks',
      value:   summary.total,
      icon:    <AssignmentIcon fontSize="large" />,
      bgcolor: '#eff6ff',
      color:   '#2563eb',
    },
    {
      label:   'In Progress',
      value:   summary.inProgress,
      icon:    <HourglassIcon fontSize="large" />,
      bgcolor: '#fffbeb',
      color:   '#d97706',
    },
    {
      label:   'Completed',
      value:   summary.done,
      icon:    <CheckCircleIcon fontSize="large" />,
      bgcolor: '#f0fdf4',
      color:   '#16a34a',
    },
    {
      label:   'Overdue',
      value:   summary.overdue,
      icon:    <WarningIcon fontSize="large" />,
      bgcolor: '#fef2f2',
      color:   '#dc2626',
    },
  ]

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h3" color="text.primary" sx={{ fontWeight: 700 }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{
                  p: 1.5, borderRadius: 2,
                  bgcolor: card.bgcolor, color: card.color,
                }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}