import { Box, CircularProgress, Typography } from '@mui/material'

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: 300, gap: 2,
    }}>
      <CircularProgress />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  )
}