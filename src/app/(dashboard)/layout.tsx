'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@mui/material'
import Sidebar from '@/components/layout/Sidebar'
import { useAuthStore } from '@/store/authStore'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isLoggedIn, initFromStorage } = useAuthStore()

  useEffect(() => {
    initFromStorage()
  }, [])

  useEffect(() => {
    if (!isLoggedIn) {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        router.push('/login')
      }
    }
  }, [isLoggedIn])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: '#f1f5f9',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}