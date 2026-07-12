'use client'

import { Box, Grid, Typography, Card, CardContent, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip, Divider, Skeleton } from '@mui/material'
import TopBar from '@/components/layout/TopBar'
import SummaryCards from '../../../components/dashboard/SummaryCards'
import TeamChart from './TeamChart'
import OverduePanel from './OverduePanel'
import { useSummary, useTeamBreakdown } from '@/lib/queries/report'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useOverdueTasks } from '@/lib/queries/tasks'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useSummary()
  const { data: team, isLoading: loadingTeam } = useTeamBreakdown()
  const { data: overdue, isLoading: loadingOverdue } = useOverdueTasks()

  const loading = loadingSummary || loadingTeam || loadingOverdue

  // Top performers
  const topPerformers = team ? [...team].sort((a, b) => b.done - a.done).slice(0, 3) : []

  // Department summary
  const deptSummary = team ? Object.values(team.reduce((acc: any, curr: any) => {
    if (!acc[curr.department]) {
      acc[curr.department] = { name: curr.department, value: 0 }
    }
    acc[curr.department].value += curr.total
    return acc
  }, {})) : []

  return (
    <Box>
      <TopBar title="Manager Dashboard" />
      <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Good morning 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>

        {/* Summary Cards */}
        {loading ? (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map(i => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          summary && <Box sx={{ mb: 3 }}><SummaryCards summary={summary} /></Box>
        )}

        <Grid container spacing={3}>
          {/* Main Charts */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {loading ? <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2 }} /> : (
                team && <TeamChart data={team} />
              )}

              <Grid container spacing={3}>
                {/* Department Summary */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Department Summary</Typography>
                      {loading ? <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} /> : (
                        <Box sx={{ height: 240 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={deptSummary} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {deptSummary.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                              <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Top Performers */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Top Performers</Typography>
                      {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {[1, 2, 3].map(i => <Skeleton key={i} variant="rectangular" height={60} />)}
                        </Box>
                      ) : (
                        <List disablePadding>
                          {topPerformers.map((emp, i) => (
                            <Box key={emp.employeeId}>
                              {i > 0 && <Divider component="li" />}
                              <ListItem sx={{ px: 0, py: 1.5 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: i === 0 ? '#fef08a' : i === 1 ? '#e2e8f0' : '#ffedd5', color: i === 0 ? '#ca8a04' : i === 1 ? '#64748b' : '#c2410c', fontWeight: 'bold' }}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{emp.name}</Typography>}
                                  secondary={<Typography variant="caption">{emp.department}</Typography>}
                                />
                                <Chip label={`${emp.done} done`} size="small" color="success" sx={{ fontWeight: 600 }} />
                              </ListItem>
                            </Box>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Sidebar - Overdue Panel */}
          <Grid size={{ xs: 12, lg: 4 }}>
            {loading ? <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} /> : (
              overdue && <OverduePanel tasks={overdue} />
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}