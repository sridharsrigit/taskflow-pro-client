import { Card, CardContent, Typography } from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TeamMember } from '@/types'

interface Props {
  data: TeamMember[]
}

export default function TeamChart({ data }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Team Productivity
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }}
            />
            <Legend />
            <Bar dataKey="done"       name="Completed"  fill="#16a34a" radius={[4,4,0,0]} />
            <Bar dataKey="inProgress" name="In Progress" fill="#2563eb" radius={[4,4,0,0]} />
            <Bar dataKey="overdue"    name="Overdue"    fill="#dc2626" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}