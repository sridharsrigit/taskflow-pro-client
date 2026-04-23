'use client'

import {
  Box, Card, CardContent, Typography,
  Avatar, Grid, Chip,
} from '@mui/material'
import TopBar from '@/components/layout/TopBar'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { useUsers } from '@/lib/queries/users'

export default function EmployeesPage() {
  const { data: users = [], isLoading } = useUsers()

  if (isLoading) return <LoadingSpinner message="Loading employees..." />

  return (
    <Box>
      <TopBar title="Employees" />
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
         <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Team Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {users.length} members in your organisation
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{
                      width: 48, height: 48,
                      bgcolor: user.role === 'Manager' ? '#7c3aed' :
                               user.role === 'Admin'   ? '#dc2626' : '#2563eb',
                      fontSize: 18, fontWeight: 700,
                    }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={user.role}
                      size="small"
                      color={
                        user.role === 'Admin'   ? 'error'   :
                        user.role === 'Manager' ? 'secondary' : 'primary'
                      }
                      variant="outlined"
                    />
                    <Chip
                      label={user.department}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={user.isActive ? 'success' : 'default'}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}