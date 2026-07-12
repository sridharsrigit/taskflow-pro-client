'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box, Button, Card, CardContent,
  TextField, Alert, CircularProgress, Divider,
  Typography, InputAdornment, IconButton, Grid, keyframes
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import SecurityIcon from '@mui/icons-material/Security'
import PeopleIcon from '@mui/icons-material/People'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

type LoginForm = z.infer<typeof schema>

const demoUsers = [
  { label: 'Admin', email: 'admin@taskflow.com', password: 'Admin@123', color: '#dc2626' },
  { label: 'Manager', email: 'arjun@taskflow.com', password: 'Manager@123', color: '#2563eb' },
  { label: 'Employee', email: 'rahul@taskflow.com', password: 'Employee@123', color: '#16a34a' },
]

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
`

const fadeInAnimation = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<LoginForm>({ resolver: zodResolver(schema) })

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', data)
      const { accessToken, name, email, role, userId } = res.data
      login(
        { id: userId, name, email, role, department: '', isActive: true, createdAt: '' },
        accessToken
      )
      router.push(role === 'Employee' ? '/tasks' : '/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      
      {/* LEFT SIDE */}
      <Grid size={{ xs: 12, md: 6 }} sx={{
        bgcolor: '#0f172a',
        color: 'white',
        position: 'relative',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: 8,
        overflow: 'hidden',
        background: 'linear-gradient(-45deg, #0f172a, #1e293b, #334155, #0f172a)',
        backgroundSize: '400% 400%',
        animation: `${gradientAnimation} 15s ease infinite`,
      }}>
        {/* Dot pattern overlay */}
        <Box sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
          zIndex: 0
        }} />

        <Box sx={{ position: 'relative', zIndex: 1, animation: `${fadeInAnimation} 1s ease-out` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)'
            }}>
              <SecurityIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
              TaskFlow Pro
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 300, mb: 6, color: '#94a3b8', maxWidth: 400, lineHeight: 1.4 }}>
            Manage smarter.<br />
            <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>Deliver faster.</Box>
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <SecurityIcon sx={{ color: '#60a5fa' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>AI-Powered Insights</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Smart analytics and proactive suggestions.</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <PeopleIcon sx={{ color: '#34d399' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Real-time Collaboration</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Keep your entire team aligned perfectly.</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <AutoGraphIcon sx={{ color: '#f472b6' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Smart Task Tracking</Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Never miss a deadline again with our system.</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* RIGHT SIDE */}
      <Grid size={{ xs: 12, md: 6 }} sx={{
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4
      }}>
        <Box sx={{ width: '100%', maxWidth: 420, animation: `${fadeInAnimation} 0.8s ease-out` }}>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Sign in to continue to TaskFlow Pro
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, animation: shake ? `${shakeAnimation} 0.5s ease` : 'none' }}>
              
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                  }
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#94a3b8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5, mt: 1,
                  bgcolor: '#2563eb',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)',
                  '&:hover': { bgcolor: '#1d4ed8' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          </form>

          <Divider sx={{ my: 4 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, px: 1 }}>
              Quick Demo Access
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {demoUsers.map((u) => (
              <Card 
                key={u.label} 
                variant="outlined" 
                onClick={() => {
                  setValue('email', u.email)
                  setValue('password', u.password)
                }}
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: `4px solid ${u.color}`,
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                }}
              >
                <CardContent sx={{ p: '12px !important', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      {u.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {u.email}
                    </Typography>
                  </Box>
                  <Button size="small" variant="text" sx={{ color: u.color, fontWeight: 600 }}>
                    Auto-fill
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              TaskFlow Pro v1.0 — Built with Next.js & .NET
            </Typography>
          </Box>

        </Box>
      </Grid>
    </Grid>
  )
}