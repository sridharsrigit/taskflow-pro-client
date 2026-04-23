'use client'

import { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Box, Typography } from '@mui/material'
import KanbanColumn from './KanbanColumn'
import TaskDetailModal from './TaskDetailModal'
import { Task, TaskStatus } from '@/types'
import { useUpdateTask } from '@/lib/queries/tasks'

interface Props {
  tasks: Task[]
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'Todo',       title: 'To Do',      color: '#64748b' },
  { id: 'InProgress', title: 'In Progress', color: '#2563eb' },
  { id: 'InReview',   title: 'In Review',   color: '#7c3aed' },
  { id: 'Done',       title: 'Done',        color: '#16a34a' },
]

export default function KanbanBoard({ tasks }: Props) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const updateTask = useUpdateTask()

  const onDragEnd = async (result: DropResult) => {
    const { draggableId, destination, source } = result

    // Dropped outside a column
    if (!destination) return

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return

    const newStatus = destination.droppableId as TaskStatus
    const task      = tasks.find((t) => t.id === draggableId)

    if (!task || task.status === newStatus) return

    // Optimistically update happens via invalidateQueries in mutation
    await updateTask.mutateAsync({
      id:   draggableId,
      data: { status: newStatus },
    })
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{
          display: 'flex', gap: 2,
          overflowX: 'auto', pb: 2,
          alignItems: 'flex-start',
        }}>
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              columnId={col.id}
              title={col.title}
              color={col.color}
              tasks={tasks.filter((t) => t.status === col.id)}
              onTaskClick={(task) => setSelectedTaskId(task.id)}
            />
          ))}
        </Box>
      </DragDropContext>

      <TaskDetailModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </>
  )
}