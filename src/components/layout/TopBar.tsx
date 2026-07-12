'use client'

import {
  AppBar, Toolbar, Typography,
  Box, Chip, Avatar,
  IconButton, Menu, MenuItem, Divider
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import GlobalSearch from './GlobalSearch'

const roleColors: Record<string,
  'primary' | 'secondary' | 'success'> = {
  Admin: 'secondary',
  Manager: 'primary',
  Employee: 'success',
}

interface Props {
  title: string
}

export default function TopBar({ title }: Props) {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

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
      <Toolbar sx={{
        justifyContent: 'space-between',
        gap: 2,
      }}>

        {/* Left: Page Title */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: 'text.primary', minWidth: 120 }}
        >
          {title}
        </Typography>

        {/* Center: Global Search */}
        <GlobalSearch />

        {/* Right: User Info */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}>
          <Chip
            label={user?.role}
            size="small"
            color={roleColors[user?.role ?? 'Employee']}
            variant="outlined"
          />
          <IconButton
            size="small"
            onClick={(e) => setAnchor(e.currentTarget)}
          >
            <Avatar sx={{
              width: 32,
              height: 32,
              bgcolor: '#2563eb',
              fontSize: 13,
              sx: { fontWeight: 700 },
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={() => setAnchor(null)}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 2,
                  minWidth: 180,
                },
              },
            }}
          >
            <MenuItem disabled>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary' }}
                >
                  {user?.email}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{ color: 'error.main', gap: 1 }}
            >
              <LogoutIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}