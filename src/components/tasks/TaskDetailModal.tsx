'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent,
  Box, Typography, Chip, Button,
  TextField, Avatar, Divider,
  CircularProgress, Alert, MenuItem,
  IconButton, Tooltip, Grid
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import DescriptionIcon from '@mui/icons-material/Description'
import { Task } from '@/types'
import { useTask, useAddComment, useUpdateTask, useDeleteTask } from '@/lib/queries/tasks'
import { useEmployees } from '@/lib/queries/users'
import { useAuthStore } from '@/store/authStore'
import { format } from 'date-fns'
import api from '@/lib/api'

interface Props {
  taskId: string | null
  onClose: () => void
}

const priorities = [
  { value: 0, label: 'Low' },
  { value: 1, label: 'Medium' },
  { value: 2, label: 'High' },
  { value: 3, label: 'Critical' },
]

const statuses = [
  { value: 'Todo', label: 'To Do' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'InReview', label: 'In Review' },
  { value: 'Done', label: 'Done' },
  { value: 'Cancelled', label: 'Cancelled' },
]

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'critical': return '#dc2626'
    case 'high': return '#f59e0b'
    case 'medium': return '#2563eb'
    default: return '#94a3b8'
  }
}

const statusColors: Record<string, string> = {
  Todo: '#64748b', InProgress: '#2563eb',
  InReview: '#7c3aed', Done: '#16a34a', Cancelled: '#dc2626',
}

export default function TaskDetailModal({ taskId, onClose }: Props) {
  const { user } = useAuthStore()
  const isEmployee = user?.role === 'Employee'

  const [comment, setComment] = useState('')
  const [aiSummary, setAiSummary] = useState('')
  const [loadingAi, setLoadingAi] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  // Edit form state
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editPriority, setEditPriority] = useState(0)
  const [editDueDate, setEditDueDate] = useState('')
  const [editAssignedTo, setEditAssignedTo] = useState('')

  const { data: task, isLoading } = useTask(taskId ?? '')
  const { data: employees = [] } = useEmployees()
  const addComment = useAddComment()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  useEffect(() => {
    if (task) {
      setEditTitle(task.title)
      setEditDesc(task.description)
      setEditStatus(task.status)
      setEditPriority(
        priorities.find((p) => p.label === task.priority)?.value ?? 1
      )
      setEditDueDate(
        task.dueDate ? task.dueDate.substring(0, 10) : ''
      )
      setEditAssignedTo(task.assignedToId)
    }
  }, [task])

  const handleAddComment = async () => {
    if (!comment.trim() || !taskId) return
    await addComment.mutateAsync({ taskId, message: comment })
    setComment('')
  }

  const handleSaveEdit = async () => {
    if (!taskId) return
    const priorityLabels = ['Low', 'Medium', 'High', 'Critical']
    await updateTask.mutateAsync({
      id: taskId,
      data: {
        title: editTitle,
        description: editDesc,
        status: editStatus,
        priority: priorityLabels[editPriority],
        dueDate: new Date(editDueDate).toISOString(),
        assignedToId: editAssignedTo,
      },
    })
    setEditMode(false)
  }

  const handleDelete = async () => {
    if (!taskId) return
    await deleteTask.mutateAsync(taskId)
    onClose()
  }

  const handleAiSummary = async () => {
    if (!taskId) return
    setLoadingAi(true)
    try {
      const res = await api.post(`/ai/summarize/${taskId}`)
      setAiSummary(res.data.summary)
    } catch {
      setAiSummary('AI summary unavailable. Please check your API key.')
    } finally {
      setLoadingAi(false)
    }
  }

  return (
    <Dialog
      open={!!taskId}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, height: '85vh', maxHeight: 800 } } }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : task ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* ── HEADER ─────────────────────────────────── */}
          <Box sx={{
            px: 3, py: 2,
            borderBottom: '1px solid #e2e8f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                TASK-{task.id.split('-')[0].toUpperCase()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isEmployee && !editMode && (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setConfirmDel(true)}
                    sx={{ textTransform: 'none' }}
                  >
                    Delete
                  </Button>
                </>
              )}
              {editMode && (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={updateTask.isPending ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                    onClick={handleSaveEdit}
                    disabled={updateTask.isPending}
                    sx={{ textTransform: 'none' }}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    onClick={() => setEditMode(false)}
                    sx={{ textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <IconButton size="small" onClick={onClose} sx={{ ml: 1 }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* ── BODY ─────────────────────────────────── */}
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

            {/* ── LEFT COLUMN ───────────────────────────── */}
            <Box sx={{
              flex: 2,
              p: 4,
              overflowY: 'auto',
              borderRight: '1px solid #e2e8f0'
            }}>

              {confirmDel && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                  action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" color="error" variant="contained" onClick={handleDelete} disabled={deleteTask.isPending}>
                        {deleteTask.isPending ? 'Deleting...' : 'Yes, Delete'}
                      </Button>
                      <Button size="small" onClick={() => setConfirmDel(false)}>Cancel</Button>
                    </Box>
                  }
                >
                  Are you sure you want to delete this task? This cannot be undone.
                </Alert>
              )}

              {editMode ? (
                <TextField
                  fullWidth
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  sx={{ mb: 4, '& .MuiInputBase-input': { fontSize: '1.5rem', fontWeight: 700 } }}
                  variant="standard"
                />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 4, lineHeight: 1.3 }}>
                  {task.title}
                </Typography>
              )}

              {/* Description */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <DescriptionIcon sx={{ color: '#64748b' }} /> Description
                </Typography>

                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                ) : (
                  <Box sx={{ pl: 4 }}>
                    <Typography variant="body1" sx={{ color: '#334155', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {task.description || 'No description provided.'}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* AI Summary */}
              {!editMode && (
                <Box sx={{ pl: 4, mb: 4 }}>
                  <Button
                    variant="outlined"
                    startIcon={loadingAi ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                    onClick={handleAiSummary}
                    disabled={loadingAi}
                    size="small"
                    sx={{
                      borderColor: '#8b5cf6',
                      color: '#8b5cf6',
                      textTransform: 'none',
                      fontWeight: 600,
                      mb: 2,
                      '&:hover': { borderColor: '#7c3aed', bgcolor: '#f5f3ff' },
                    }}
                  >
                    {loadingAi ? 'Generating...' : 'Summarize Thread with AI'}
                  </Button>

                  {aiSummary && (
                    <Alert
                      icon={<AutoAwesomeIcon sx={{ color: '#8b5cf6' }} />}
                      sx={{ bgcolor: '#f5f3ff', border: '1px solid #ddd6fe', color: '#4c1d95', borderRadius: 2 }}
                    >
                      <Typography variant="body2">{aiSummary}</Typography>
                    </Alert>
                  )}
                </Box>
              )}

              {/* Comments */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <ForumOutlinedIcon sx={{ fontSize: 16, mr: 1.5, color: '#64748b' }} />                </Typography>

                <Box sx={{ pl: 4 }}>
                  {/* Add Comment Input */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#e2e8f0', color: '#475569' }}>
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleAddComment()
                          }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          bgcolor: 'white'
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                          variant="contained"
                          onClick={handleAddComment}
                          disabled={!comment.trim() || addComment.isPending}
                          size="small"
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          Save
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  {/* Comment List */}
                  {(task as any).comments?.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                      No comments yet.
                    </Typography>
                  ) : (
                    (task as any).comments?.map((c: any) => (
                      <Box key={c.id} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: '#3b82f6' }}>
                          {c.userName?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                              {c.userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                              {format(new Date(c.createdAt), 'MMM d, yyyy HH:mm')}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: '#334155' }}>{c.message}</Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>

            </Box>

            {/* ── RIGHT COLUMN ──────────────────────────── */}
            <Box sx={{
              flex: 1,
              bgcolor: '#f8fafc',
              p: 4,
              overflowY: 'auto'
            }}>
              <Box sx={{
                bgcolor: 'white',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                p: 3
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#64748b', mb: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Details
                </Typography>

                {editMode ? (
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        label="Status"
                        size="small"
                        fullWidth
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        {statuses.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        label="Priority"
                        size="small"
                        fullWidth
                        value={editPriority}
                        onChange={(e) => setEditPriority(Number(e.target.value))}
                      >
                        {priorities.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Due Date"
                        type="date"
                        size="small"
                        fullWidth
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        label="Assignee"
                        size="small"
                        fullWidth
                        value={editAssignedTo}
                        onChange={(e) => setEditAssignedTo(e.target.value)}
                      >
                        {employees.map((emp) => <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>)}
                      </TextField>
                    </Grid>
                  </Grid>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>STATUS</Typography>
                      <Chip
                        label={task.status}
                        size="small"
                        sx={{
                          bgcolor: `${statusColors[task.status]}15`,
                          color: statusColors[task.status],
                          fontWeight: 700,
                          borderRadius: 1
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>PRIORITY</Typography>
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          bgcolor: `${getPriorityColor(task.priority)}15`,
                          color: getPriorityColor(task.priority),
                          fontWeight: 700,
                          borderRadius: 1
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>ASSIGNEE</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: '#e2e8f0', color: '#475569' }}>
                          {task.assignedToName?.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                          {task.assignedToName}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>DUE DATE</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: task.isOverdue ? '#dc2626' : '#334155' }}>
                        {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>REPORTER</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#334155' }}>
                        {task.createdByName}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    <Box>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, display: 'block', mb: 0.5 }}>CREATED</Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {format(new Date(task.createdAt), 'MMM d, yyyy HH:mm')}
                      </Typography>
                    </Box>

                    {task.riskScore > 0 && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: '#fef2f2', borderRadius: 2, border: '1px solid #fecaca' }}>
                        <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                          🔥 RISK SCORE: {(task.riskScore * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Dialog>
  )
}