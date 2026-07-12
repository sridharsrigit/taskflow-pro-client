'use client'

import {
  AppBar, Toolbar, Typography,
  Box, Chip, IconButton, InputBase,
  Badge, Avatar
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
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
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important', px: 3 }}>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Global Search */}
          <Box sx={{
            display: 'flex', alignItems: 'center',
            bgcolor: '#f1f5f9',
            borderRadius: 2,
            px: 2, py: 0.5,
            width: 250,
          }}>
            <SearchIcon sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />
            <InputBase
              placeholder="Search everywhere..."
              sx={{ flex: 1, fontSize: '0.875rem' }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small">
              <Badge badgeContent={3} color="error">
                <NotificationsNoneIcon sx={{ color: '#64748b' }} />
              </Badge>
            </IconButton>
            <IconButton size="small">
              <SettingsOutlinedIcon sx={{ color: '#64748b' }} />
            </IconButton>
          </Box>

          <Box sx={{ width: '1px', height: 32, bgcolor: '#e2e8f0', mx: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#2563eb', fontSize: 14 }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}