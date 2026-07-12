'use client'

import { useParams } from 'next/navigation'
import {
  Box, Typography, Card, CardContent,
  Avatar, Grid, Chip, Divider, Skeleton
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import DomainIcon from '@mui/icons-material/Domain'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TopBar from '@/components/layout/TopBar'
import { useEmployees } from '@/lib/queries/users'
import { useTasks } from '@/lib/queries/tasks'
import { format } from 'date-fns'
import TaskCard from '@/components/tasks/TaskCard'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useState } from 'react'
import TaskDetailModal from '@/components/tasks/TaskDetailModal'
import { Task } from '@/types'

const COLORS = ['#2563eb', '#16a34a', '#dc2626']

export default function EmployeeDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id

  const { data: employees, isLoading: loadingEmps } = useEmployees()
  const { data: tasks, isLoading: loadingTasks } = useTasks()

  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const employee = employees?.find(e => e.id === id)
  const empTasks = tasks?.filter(t => t.assignedToId === id) || []

  const completed = empTasks.filter(t => t.status === 'Done').length
  const inProgress = empTasks.filter(t => t.status === 'InProgress' || t.status === 'InReview').length
  const todo = empTasks.filter(t => t.status === 'Todo').length

  const chartData = [
    { name: 'In Progress', value: inProgress },
    { name: 'Completed', value: completed },
    { name: 'To Do', value: todo }
  ]

  if (loadingEmps || loadingTasks) {
    return <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={400} /></Box>
  }

  if (!employee) {
    return <Box sx={{ p: 4 }}><Typography>Employee not found.</Typography></Box>
  }

  return (
    <Box>
      <TopBar title="Employee Profile" />
      <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
        
        <Grid container spacing={4}>
          {/* Profile Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ textAlign: 'center', p: 3, mb: 3 }}>
              <Avatar 
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#3b82f6', fontSize: 32 }}
              >
                {employee.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{employee.name}</Typography>
              <Chip label={employee.role} size="small" color="primary" variant="outlined" sx={{ mb: 3 }} />
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon sx={{ color: '#64748b' }} />
                  <Typography variant="body2">{employee.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DomainIcon sx={{ color: '#64748b' }} />
                  <Typography variant="body2">{employee.department || 'General'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarTodayIcon sx={{ color: '#64748b' }} />
                  <Typography variant="body2">Joined {format(new Date(employee.createdAt), 'MMM yyyy')}</Typography>
                </Box>
              </Box>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Task Distribution</Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: COLORS[1], fontWeight: 700 }}>{completed}</Typography>
                    <Typography variant="caption">Done</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: COLORS[0], fontWeight: 700 }}>{inProgress}</Typography>
                    <Typography variant="caption">Active</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Tasks List */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Current Tasks ({empTasks.length})
              </Typography>
            </Box>
            
            {empTasks.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No tasks assigned.</Typography>
              </Card>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
                {empTasks.map(task => (
                  <Box key={task.id}>
                    <TaskCard task={task} onClick={(t: Task) => setSelectedTask(t.id)} />
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>

        <TaskDetailModal taskId={selectedTask} onClose={() => setSelectedTask(null)} />
      </Box>
    </Box>
  )
}
