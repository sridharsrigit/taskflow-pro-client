'use client'

import { Card, CardContent, Skeleton, Box, Grid } from '@mui/material'

interface Props {
  count?: number
}

export default function CardSkeleton({ count = 1 }: Props) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="40%" height={16} />
                </Box>
              </Box>

              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="rounded" width={80} height={32} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
