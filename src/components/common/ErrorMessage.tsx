import { Alert, Box, Button } from '@mui/material'

interface Props {
  message?: string
  onRetry?: () => void
}

export default function ErrorMessage({
  message = 'Something went wrong',
  onRetry,
}: Props) {
  return (
    <Box sx={{ p: 3 }}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Box>
  )
}