'use client'

import { useState, useEffect } from 'react'
import {
  Grid, Card, CardContent,
  Typography, Box,
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import HourglassIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { TaskSummary } from '@/types'

interface Props {
  summary: TaskSummary
}

function AnimatedCounter({ end }: { end: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1000 // 1 second
    const stepTime = Math.abs(Math.floor(duration / (end || 1)))
    
    if (end === 0) {
      setCount(0)
      return
    }

    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [end])

  return <>{count}</>
}

export default function SummaryCards({ summary }: Props) {
  // Using hardcoded trend logic for demo, as API doesn't provide it yet
  const cards = [
    {
      label:   'Total Tasks',
      value:   summary.total,
      icon:    <AssignmentIcon sx={{ fontSize: 32 }} />,
      bg:      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      trend:   '+12%',
      isUp:    true,
    },
    {
      label:   'In Progress',
      value:   summary.inProgress,
      icon:    <HourglassIcon sx={{ fontSize: 32 }} />,
      bg:      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      trend:   '+5%',
      isUp:    true,
    },
    {
      label:   'Completed',
      value:   summary.done,
      icon:    <CheckCircleIcon sx={{ fontSize: 32 }} />,
      bg:      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      trend:   '+18%',
      isUp:    true,
    },
    {
      label:   'Overdue',
      value:   summary.overdue,
      icon:    <WarningIcon sx={{ fontSize: 32 }} />,
      bg:      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      trend:   '-2%',
      isUp:    false,
    },
  ]

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
          <Card sx={{ 
            background: card.bg,
            color: 'white',
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 10px 20px -10px rgba(0,0,0,0.5)'
            }
          }}>
            {/* Subtle glow effect behind icon */}
            <Box sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, opacity: 0.9, fontWeight: 500 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    <AnimatedCounter end={card.value} />
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(0,0,0,0.2)', px: 1, py: 0.25, borderRadius: 1, width: 'fit-content' }}>
                    {card.isUp ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {card.trend} this week
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 1 }}>
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