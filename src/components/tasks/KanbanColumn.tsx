import { Box, Typography, Chip, Paper } from '@mui/material'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import InboxIcon from '@mui/icons-material/Inbox'
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
  // Generate a very light tint of the column color for background
  const getLightTint = (hex: string) => {
    return `${hex}0A` // 10% opacity
  }

  return (
    <Box sx={{ flex: 1, minWidth: 280, maxWidth: 320 }}>
      {/* Column Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center',
        gap: 1, mb: 2, p: 1.5,
        bgcolor: 'white', borderRadius: 2,
        borderTop: `3px solid ${color}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1, color: '#0f172a' }}>
          {title}
        </Typography>
        <Chip
          label={tasks.length}
          size="small"
          sx={{ bgcolor: `${color}20`, color: color, fontWeight: 700, height: 22 }}
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
              minHeight: 300,
              p: 1.5,
              bgcolor: snapshot.isDraggingOver ? `${color}15` : getLightTint(color),
              borderRadius: 2,
              border: snapshot.isDraggingOver
                ? `2px dashed ${color}`
                : '2px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column'
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
                      opacity: snapshot.isDragging ? 0.9 : 1,
                      transform: snapshot.isDragging
                        ? 'rotate(3deg) scale(1.02)'
                        : 'none',
                      transition: 'transform 0.1s ease',
                      zIndex: snapshot.isDragging ? 100 : 1
                    }}
                  >
                    <TaskCard task={task} onClick={onTaskClick} />
                  </Box>
                )}
              </Draggable>
            ))}
            
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '2px dashed #cbd5e1',
                borderRadius: 2,
                color: '#94a3b8',
                p: 3,
                mt: 1
              }}>
                <InboxIcon sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Drop tasks here
                </Typography>
              </Box>
            )}

            {provided.placeholder}
          </Paper>
        )}
      </Droppable>
    </Box>
  )
}