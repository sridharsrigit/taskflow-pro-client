'use client'

import {
  AppBar, Toolbar, Typography,
  Box, Chip,
} from '@mui/material'
import { useAuthStore } from '@/store/authStore'

interface Props {
  title: string
}

const roleColors: Record<string, 'primary' | 'secondary' | 'success'> = {
  Admin:    'secondary',
  Manager:  'primary',
  Employee: 'success',
}

export default function TopBar({ title }: Props) {
  const { user } = useAuthStore()

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: '1px solid #e2e8f0',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Welcome, {user?.name}
          </Typography>
          <Chip
            label={user?.role}
            size="small"
            color={roleColors[user?.role ?? 'Employee']}
            variant="outlined"
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}