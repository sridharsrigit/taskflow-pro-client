'use client'

import { useState, useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent,
  Box, Typography, Chip, Button,
  TextField, Avatar, Divider,
  CircularProgress, Alert, MenuItem,
  IconButton, Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
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
  { value: 'Todo',       label: 'To Do' },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'InReview',   label: 'In Review' },
  { value: 'Done',       label: 'Done' },
  { value: 'Cancelled',  label: 'Cancelled' },
]

const priorityColors: Record<string, 'default' | 'warning' | 'error' | 'primary'> = {
  Low: 'default', Medium: 'primary', High: 'warning', Critical: 'error',
}

const statusColors: Record<string, string> = {
  Todo: '#64748b', InProgress: '#2563eb',
  InReview: '#7c3aed', Done: '#16a34a', Cancelled: '#dc2626',
}

export default function TaskDetailModal({ taskId, onClose }: Props) {
  const { user }                      = useAuthStore()
  const isEmployee                    = user?.role === 'Employee'

  const [comment,    setComment]      = useState('')
  const [aiSummary,  setAiSummary]    = useState('')
  const [loadingAi,  setLoadingAi]    = useState(false)
  const [editMode,   setEditMode]     = useState(false)
  const [confirmDel, setConfirmDel]   = useState(false)

  // Edit form state
  const [editTitle,      setEditTitle]      = useState('')
  const [editDesc,       setEditDesc]       = useState('')
  const [editStatus,     setEditStatus]     = useState('')
  const [editPriority,   setEditPriority]   = useState(0)
  const [editDueDate,    setEditDueDate]    = useState('')
  const [editAssignedTo, setEditAssignedTo] = useState('')

  const { data: task, isLoading }  = useTask(taskId ?? '')
  const { data: employees = [] }   = useEmployees()
  const addComment                 = useAddComment()
  const updateTask                 = useUpdateTask()
  const deleteTask                 = useDeleteTask()

  // Populate edit form when task loads
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
      title:        editTitle,
      description:  editDesc,
      status:       editStatus,
      priority:     priorityLabels[editPriority],
      dueDate:      new Date(editDueDate).toISOString(),
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
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      {isLoading ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : task ? (
        <>
          {/* ── TITLE BAR ─────────────────────────────────── */}
          <DialogTitle sx={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', pb: 1,
          }}>
            <Box sx={{ flex: 1, pr: 2 }}>
              {editMode ? (
                <TextField
                  fullWidth
                  size="small"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {task.title}
                </Typography>
              )}

              {!editMode && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={task.status}
                    size="small"
                    sx={{ bgcolor: statusColors[task.status], color: 'white' }}
                  />
                  <Chip
                    label={task.priority}
                    size="small"
                    color={priorityColors[task.priority]}
                    variant="outlined"
                  />
                  {task.isOverdue && (
                    <Chip label="Overdue" size="small" color="error" />
                  )}
                  {task.isHighRisk && (
                    <Chip label="High Risk" size="small" color="warning" />
                  )}
                </Box>
              )}
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {!isEmployee && !editMode && (
                <>
                  <Tooltip title="Edit Task">
                    <IconButton
                      size="small"
                      onClick={() => setEditMode(true)}
                      sx={{ color: '#2563eb' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Task">
                    <IconButton
                      size="small"
                      onClick={() => setConfirmDel(true)}
                      sx={{ color: '#dc2626' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              {editMode && (
                <>
                  <Tooltip title="Save Changes">
                    <IconButton
                      size="small"
                      onClick={handleSaveEdit}
                      sx={{ color: '#16a34a' }}
                      disabled={updateTask.isPending}
                    >
                      {updateTask.isPending
                        ? <CircularProgress size={16} />
                        : <SaveIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel Edit">
                    <IconButton
                      size="small"
                      onClick={() => setEditMode(false)}
                      sx={{ color: '#64748b' }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
              <IconButton size="small" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent>

            {/* ── DELETE CONFIRMATION ──────────────────────── */}
            {confirmDel && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      color="error"
                      variant="contained"
                      onClick={handleDelete}
                      disabled={deleteTask.isPending}
                    >
                      {deleteTask.isPending ? 'Deleting...' : 'Yes, Delete'}
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setConfirmDel(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                }
              >
                Are you sure you want to delete this task? This cannot be undone.
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>

              {/* ── LEFT COLUMN ───────────────────────────── */}
              <Box sx={{ flex: 2, minWidth: 280 }}>

                {/* Description */}
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 3 }}
                  >
                    {task.description || 'No description provided.'}
                  </Typography>
                )}

                {/* AI Summary Button */}
                {!editMode && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={
                        loadingAi
                          ? <CircularProgress size={16} />
                          : <AutoAwesomeIcon />
                      }
                      onClick={handleAiSummary}
                      disabled={loadingAi}
                      size="small"
                      sx={{
                        mb: 2,
                        borderColor: '#7c3aed',
                        color: '#7c3aed',
                        '&:hover': {
                          borderColor: '#6d28d9',
                          bgcolor: '#faf5ff',
                        },
                      }}
                    >
                      {loadingAi ? 'Generating...' : 'AI Summary'}
                    </Button>

                    {aiSummary && (
                      <Alert
                        severity="info"
                        icon={<AutoAwesomeIcon />}
                        sx={{ mb: 2, bgcolor: '#faf5ff', border: '1px solid #e9d5ff' }}
                      >
                        <Typography variant="body2">{aiSummary}</Typography>
                      </Alert>
                    )}
                  </>
                )}

                <Divider sx={{ mb: 2 }} />

                {/* Comments */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Comments ({task.commentCount})
                </Typography>

                <Box sx={{ maxHeight: 240, overflow: 'auto', mb: 2 }}>
                  {(task as any).comments?.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      No comments yet.
                    </Typography>
                  ) : (
                    (task as any).comments?.map((c: any) => (
                      <Box key={c.id} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                        <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: '#3b82f6' }}>
                          {c.userName?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, bgcolor: '#f8fafc', borderRadius: 2, p: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {c.userName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {format(new Date(c.createdAt), 'dd MMM, HH:mm')}
                            </Typography>
                          </Box>
                          <Typography variant="body2">{c.message}</Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>

                {/* Add Comment */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={!comment.trim() || addComment.isPending}
                    sx={{ minWidth: 0, px: 2 }}
                  >
                    <SendIcon fontSize="small" />
                  </Button>
                </Box>
              </Box>

              {/* ── RIGHT COLUMN ──────────────────────────── */}
              <Box sx={{
                flex: 1, minWidth: 200,
                bgcolor: '#f8fafc', borderRadius: 2, p: 2,
                height: 'fit-content',
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Task Details
                </Typography>

                {editMode ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      select
                      label="Status"
                      size="small"
                      fullWidth
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      {statuses.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                          {s.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select
                      label="Priority"
                      size="small"
                      fullWidth
                      value={editPriority}
                      onChange={(e) => setEditPriority(Number(e.target.value))}
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
                    size="small"
                    fullWidth
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <TextField
                      select
                      label="Assigned To"
                      size="small"
                      fullWidth
                      value={editAssignedTo}
                      onChange={(e) => setEditAssignedTo(e.target.value)}
                    >
                      {employees.map((emp) => (
                        <MenuItem key={emp.id} value={emp.id}>
                          {emp.name} — {emp.department}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                ) : (
                  <>
                    {[
                      { label: 'Assigned To',  value: task.assignedToName },
                      { label: 'Created By',   value: task.createdByName },
                      { label: 'Due Date',     value: format(new Date(task.dueDate), 'dd MMM yyyy') },
                      { label: 'Created',      value: format(new Date(task.createdAt), 'dd MMM yyyy') },
                      { label: 'Email',        value: task.assignedToEmail },
                    ].map((item) => (
                      <Box key={item.label} sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.value}
                        </Typography>
                      </Box>
                    ))}

                    {task.riskScore > 0 && (
                      <Box sx={{ mt: 2, p: 1.5, bgcolor: '#fef2f2', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>
                          Risk Score: {(task.riskScore * 100).toFixed(0)}%
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </DialogContent>
        </>
      ) : null}
    </Dialog>
  )
}