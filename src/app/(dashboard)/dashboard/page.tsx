'use client'

import { Box, Grid, Typography } from '@mui/material'
import TopBar from '@/components/layout/TopBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useOverdueTasks } from '@/lib/queries/tasks'
import SummaryCards from '../../../components/dashboard/SummaryCards'
import TeamChart from './TeamChart'
import OverduePanel from './OverduePanel'
import { useSummary, useTeamBreakdown } from '@/lib/queries/report'

export default function DashboardPage() {
  const { data: summary,  isLoading: loadingSummary  } = useSummary()
  const { data: team,     isLoading: loadingTeam     } = useTeamBreakdown()
  const { data: overdue,  isLoading: loadingOverdue  } = useOverdueTasks()

  if (loadingSummary || loadingTeam || loadingOverdue) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  return (
    <Box>
      <TopBar title="Manager Dashboard" />
      <Box sx={{ p: 3 }}>

        {/* Page Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your team's performance and task progress
          </Typography>
        </Box>

        {/* Summary Cards */}
        {summary && <SummaryCards summary={summary} />}

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            {team && <TeamChart data={team} />}
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            {overdue && <OverduePanel tasks={overdue} />}
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}