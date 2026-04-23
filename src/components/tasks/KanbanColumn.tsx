import { Box, Typography, Chip, Paper } from '@mui/material'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import TaskCard from './TaskCard'
import { Task } from '@/types'

interface Props {
  columnId: string
  title: string
  tasks: Task[]
  color: string
  onTaskClick: (task: Task) => void
}

export default function KanbanColumn({
  columnId, title, tasks, color, onTaskClick,
}: Props) {
  return (
    <Box sx={{ flex: 1, minWidth: 260, maxWidth: 320 }}>
      {/* Column Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center',
        gap: 1, mb: 2, p: 1.5,
        bgcolor: 'white', borderRadius: 2,
        borderTop: `3px solid ${color}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <Typography variant="body1" sx={{ fontWeight: 700, flexGrow: 1 }}>
          {title}
        </Typography>
        <Chip
          label={tasks.length}
          size="small"
          sx={{ bgcolor: color, color: 'white', fontWeight: 700, height: 22 }}
        />
      </Box>

      {/* Droppable Area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <Paper
            ref={provided.innerRef}
            {...provided.droppableProps}
            elevation={0}
            sx={{
              minHeight: 200,
              p: 1,
              bgcolor: snapshot.isDraggingOver ? '#f0f9ff' : '#f8fafc',
              borderRadius: 2,
              border: snapshot.isDraggingOver
                ? `2px dashed ${color}`
                : '2px dashed transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{
                      opacity: snapshot.isDragging ? 0.8 : 1,
                      transform: snapshot.isDragging
                        ? 'rotate(2deg)'
                        : 'none',
                    }}
                  >
                    <TaskCard task={task} onClick={onTaskClick} />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Paper>
        )}
      </Droppable>
    </Box>
  )
}