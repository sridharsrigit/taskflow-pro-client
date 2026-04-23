'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Box, Card, CardContent, TextField,
  Button, Typography, Avatar,
  CircularProgress, Chip,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import TopBar from '@/components/layout/TopBar'
import api from '@/lib/api'

interface Message {
  role: 'user' | 'ai'
  text: string
  time: string
}

const quickPrompts = [
  'Who has the most overdue tasks?',
  'Summarise this weeks progress',
  'Which tasks are critical priority?',
  'Show me the team workload',
]

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Hi! I am TaskFlow Copilot. Ask me anything about your team\'s tasks, workload, or project status.',
      time: new Date().toLocaleTimeString(),
    },
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      role: 'user',
      text,
      time: new Date().toLocaleTimeString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/ai/chat', { message: text })
      const aiMsg: Message = {
        role: 'ai',
        text: res.data.reply,
        time: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'ai',
        text: 'Sorry, I could not process that. Please check your OpenAI API key.',
        time: new Date().toLocaleTimeString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <TopBar title="AI Assistant" />
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            TaskFlow Copilot
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask questions about your team and tasks in plain English
          </Typography>
        </Box>

        {/* Chat Window */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{
              height: 420, overflowY: 'auto',
              p: 2, display: 'flex',
              flexDirection: 'column', gap: 2,
            }}>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    gap: 1.5,
                    alignItems: 'flex-start',
                  }}
                >
                  {msg.role === 'ai' && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#7c3aed' }}>
                      <SmartToyIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}

                  <Box sx={{ maxWidth: '75%' }}>
                    <Box sx={{
                      p: 1.5, borderRadius: 2,
                      bgcolor: msg.role === 'user' ? '#2563eb' : '#f8fafc',
                      color:   msg.role === 'user' ? 'white'   : 'text.primary',
                      border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                    }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.text}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: 'block',
                        textAlign: msg.role === 'user' ? 'right' : 'left' }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>

                  {msg.role === 'user' && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#2563eb' }}>
                      <PersonIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                </Box>
              ))}

              {loading && (
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#7c3aed' }}>
                    <SmartToyIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box sx={{
                    p: 1.5, borderRadius: 2,
                    bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                  }}>
                    <CircularProgress size={16} />
                  </Box>
                </Box>
              )}

              <div ref={bottomRef} />
            </Box>
          </CardContent>
        </Card>

        {/* Quick Prompts */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {quickPrompts.map((prompt) => (
            <Chip
              key={prompt}
              label={prompt}
              size="small"
              clickable
              onClick={() => sendMessage(prompt)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        {/* Input Box */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Ask about tasks, team workload, overdue items..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            sx={{ px: 3 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}