'use client'

import { Box, Typography, Button } from '@mui/material'
import FolderOffIcon from '@mui/icons-material/FolderOff'

interface Props {
  title?: string
  description?: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ 
  title = "No Data Found", 
  description = "There is nothing to display here at the moment.", 
  icon, 
  actionLabel, 
  onAction 
}: Props) {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      p: 6, 
      textAlign: 'center',
      bgcolor: '#f8fafc',
      borderRadius: 4,
      border: '2px dashed #e2e8f0'
    }}>
      <Box sx={{ color: '#94a3b8', mb: 2 }}>
        {icon || <FolderOffIcon sx={{ fontSize: 64 }} />}
      </Box>
      <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 400, mb: 3 }}>
        {description}
      </Typography>
      
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}
