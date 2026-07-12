'use client'

import { useState } from 'react'
import {
  Box, Typography, Card, CardContent,
  Switch, FormControlLabel, Button,
  Divider, TextField
} from '@mui/material'
import TopBar from '@/components/layout/TopBar'
import { useAuthStore } from '@/store/authStore'

export default function SettingsPage() {
  const { user } = useAuthStore()
  
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  
  return (
    <Box>
      <TopBar title="Settings" />
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Account Settings
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Profile
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
              <TextField 
                label="Full Name" 
                size="small" 
                defaultValue={user?.name}
                disabled
              />
              <TextField 
                label="Email" 
                size="small" 
                defaultValue={user?.email}
                disabled
              />
              <TextField 
                label="Role" 
                size="small" 
                defaultValue={user?.role}
                disabled
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel 
                control={<Switch checked={emailNotifs} onChange={e => setEmailNotifs(e.target.checked)} />} 
                label="Email Notifications (Task assignments, mentions)" 
              />
              <FormControlLabel 
                control={<Switch checked={pushNotifs} onChange={e => setPushNotifs(e.target.checked)} />} 
                label="Push Notifications" 
              />
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Appearance
            </Typography>
            <FormControlLabel 
              control={<Switch checked={darkMode} onChange={e => setDarkMode(e.target.checked)} disabled />} 
              label="Dark Mode (Coming soon)" 
            />
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="inherit">Cancel</Button>
          <Button variant="contained">Save Changes</Button>
        </Box>
        
      </Box>
    </Box>
  )
}
