'use client'

import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, TextField, MenuItem,
  Typography, CircularProgress,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateTask } from '@/lib/queries/tasks'
import { useEmployees } from '@/lib/queries/users'

const schema = z.object({
  title:        z.string().min(3, 'Title must be at least 3 characters'),
  description:  z.string().optional(),
  priority:     z.number(),
  dueDate:      z.string().min(1, 'Due date is required'),
  assignedToId: z.string().min(1, 'Please select an employee'),
})

type FormData = z.infer<typeof schema>

interface Props {
  open:    boolean
  onClose: () => void
}

const priorities = [
  { value: 0, label: 'Low' },
  { value: 1, label: 'Medium' },
  { value: 2, label: 'High' },
  { value: 3, label: 'Critical' },
]

export default function CreateTaskForm({ open, onClose }: Props) {
  const createTask              = useCreateTask()
  const { data: employees = [] } = useEmployees()

  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 1 },
  })

  const priorityLabels = ['Low', 'Medium', 'High', 'Critical']

  const onSubmit = async (data: FormData) => {
    await createTask.mutateAsync({
      title:        data.title,
      description:  data.description ?? '',
      priority:     priorityLabels[data.priority] as any,
      dueDate:      new Date(data.dueDate).toISOString(),
      assignedToId: data.assignedToId,
    })
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle>
          Create New Task
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            <TextField
              label="Task Title"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title')}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              {...register('description')}
            />

            <TextField
              label="Priority"
              select
              fullWidth
              defaultValue={1}
              error={!!errors.priority}
              {...register('priority', { valueAsNumber: true })}
            >
              {priorities.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Due Date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              error={!!errors.dueDate}
              helperText={errors.dueDate?.message}
              {...register('dueDate')}
            />

            <TextField
              label="Assign To"
              select
              fullWidth
              defaultValue=""
              error={!!errors.assignedToId}
              helperText={errors.assignedToId?.message}
              {...register('assignedToId')}
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name} — {emp.department}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createTask.isPending}
          >
            {createTask.isPending
              ? <CircularProgress size={20} color="inherit" />
              : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}