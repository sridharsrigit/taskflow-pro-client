'use client'

import { Snackbar, Alert } from '@mui/material'
import { useToastStore } from '@/store/toastStore'

export default function ToastProvider() {
  const { open, message, severity, hideToast } = useToastStore()

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={hideToast}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={hideToast} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
