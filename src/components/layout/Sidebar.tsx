'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Box, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, Button,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TaskIcon from '@mui/icons-material/Assignment'
import PeopleIcon from '@mui/icons-material/People'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuthStore } from '@/store/authStore'

const DRAWER_WIDTH = 260

const managerLinks = [
  { label: 'Dashboard',    href: '/dashboard',     icon: <DashboardIcon /> },
  { label: 'Tasks',        href: '/tasks',          icon: <TaskIcon /> },
  { label: 'Employees',    href: '/employees',      icon: <PeopleIcon /> },
  { label: 'AI Assistant', href: '/ai-assistant',  icon: <SmartToyIcon /> },
]

const employeeLinks = [
  { label: 'My Tasks',     href: '/tasks',          icon: <TaskIcon /> },
  { label: 'AI Assistant', href: '/ai-assistant',  icon: <SmartToyIcon /> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, logout } = useAuthStore()

  const links = user?.role === 'Employee' ? employeeLinks : managerLinks

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#1e293b',
          color: 'white',
          border: 'none',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2,
            bgcolor: '#3b82f6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <TaskIcon sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Typography variant="h6" color="white" sx={{ fontWeight: 700 }}>
            TaskFlow Pro
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#334155', mx: 2 }} />

      {/* Navigation Links */}
      <List sx={{ px: 2, pt: 2, flexGrow: 1 }}>
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <ListItem key={link.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(link.href)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? '#3b82f6' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? '#3b82f6' : '#334155',
                  },
                }}
              >
                <ListItemIcon sx={{
                  color: isActive ? 'white' : '#94a3b8',
                  minWidth: 40,
                }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'white' : '#cbd5e1',
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Divider sx={{ borderColor: '#334155', mx: 2 }} />

      {/* User Info + Logout */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center',
          gap: 1.5, mb: 2, p: 1.5,
          bgcolor: '#334155', borderRadius: 2,
        }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#3b82f6', fontSize: 14 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" color="white" noWrap sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="#94a3b8" noWrap>
              {user?.role}
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          size="small"
          sx={{
            color: '#94a3b8',
            borderColor: '#334155',
            '&:hover': { borderColor: '#ef4444', color: '#ef4444' },
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  )
}