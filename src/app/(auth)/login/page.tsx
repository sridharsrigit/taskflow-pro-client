'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box, Button, Card, CardContent,
  TextField, Alert,
  CircularProgress, Divider,
  Typography,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
})

type LoginForm = z.infer<typeof schema>

const demoUsers = [
  { label: 'Admin', email: 'admin@taskflow.com', password: 'Admin@123' },
  { label: 'Manager', email: 'arjun@taskflow.com', password: 'Manager@123' },
  { label: 'Employee', email: 'rahul@taskflow.com', password: 'Employee@123' },
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<LoginForm>({ resolver: zodResolver(schema) })

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
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      bgcolor: '#f1f5f9', px: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{
            width: 60, height: 60, borderRadius: '50%',
            bgcolor: 'primary.main', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            mx: 'auto', mb: 2,
          }}>
            <LockIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
            <Typography variant="h4" sx={{  fontWeight: 700 }}>
            TaskFlow Pro
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            AI-Powered Task Management
          </Typography>
        </Box>

        {/* Card */}
        <Card>
          <CardContent sx={{ p: 4 }}>
             <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Sign in to your account
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email')}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register('password')}
                />

                {error && (
                  <Alert severity="error">{error}</Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, mt: 1 }}
                >
                  {loading
                    ? <CircularProgress size={24} color="inherit" />
                    : 'Sign In'}
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Quick Login
              </Typography>
            </Divider>

            {/* Demo buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {demoUsers.map((u) => (
                <Button
                  key={u.label}
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => {
                    setValue('email', u.email)
                    setValue('password', u.password)
                  }}
                  sx={{ justifyContent: 'space-between', px: 2 }}
                >
                  <Typography variant="caption" sx={{  fontWeight: 600 }}>

                    {u.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {u.email}
                  </Typography>
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}