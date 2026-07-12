'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Box, TextField, Button, Typography, Avatar,
  CircularProgress, Chip, IconButton, Divider, List, ListItem, ListItemButton, ListItemText
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
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

const mockHistory = [
  'Overdue tasks this week',
  'Team workload summary',
  'Critical priority items'
]

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Hi! I am TaskFlow Copilot. Ask me anything about your team\'s tasks, workload, or project status.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: Message = {
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/ai/chat', { message: text })
      const aiMsg: Message = {
        role: 'ai',
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'ai',
        text: 'Sorry, I could not process that. Please check your OpenAI API key.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([{
      role: 'ai',
      text: 'Hi! I am TaskFlow Copilot. Ask me anything about your team\'s tasks, workload, or project status.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }])
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar title="AI Assistant" />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar History */}
        <Box sx={{
          width: 260,
          bgcolor: '#f8fafc',
          borderRight: '1px solid #e2e8f0',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          p: 2
        }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleNewChat}
            sx={{ mb: 3, bgcolor: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', '&:hover': { bgcolor: '#f1f5f9' }, textTransform: 'none', fontWeight: 600 }}
          >
            New Chat
          </Button>

          <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', mb: 1, px: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Recent Chats
          </Typography>

          <List disablePadding>
            {mockHistory.map((item, i) => (
              <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton sx={{ borderRadius: 2, '&:hover': { bgcolor: '#e2e8f0' } }}>
                  <ForumOutlinedIcon sx={{ fontSize: 16, mr: 1.5, color: '#64748b' }} />                  <Typography
                    noWrap
                    sx={{
                      fontSize: '0.85rem',
                      color: '#334155',
                    }}
                  >
                    {item}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', bgcolor: '#ffffff' }}>

          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 }, pb: { xs: 20, md: 24 } }}>
            <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <Avatar sx={{
                    width: 36, height: 36,
                    bgcolor: msg.role === 'user' ? '#2563eb' : '#7c3aed',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {msg.role === 'user' ? <PersonIcon sx={{ fontSize: 20 }} /> : <SmartToyIcon sx={{ fontSize: 20 }} />}
                  </Avatar>

                  <Box sx={{ maxWidth: '80%' }}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 3,
                      borderTopRightRadius: msg.role === 'user' ? 4 : 24,
                      borderTopLeftRadius: msg.role === 'ai' ? 4 : 24,
                      bgcolor: msg.role === 'user' ? '#2563eb' : '#f8fafc',
                      color: msg.role === 'user' ? 'white' : '#0f172a',
                      border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                      boxShadow: msg.role === 'user' ? '0 4px 12px rgba(37,99,235,0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
                    }}>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                        {msg.text}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        display: 'block',
                        color: '#94a3b8',
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                        px: 1
                      }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {loading && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: '#7c3aed' }}>
                    <SmartToyIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box sx={{
                    p: 2, borderRadius: 3, borderTopLeftRadius: 4,
                    bgcolor: '#f8fafc', border: '1px solid #e2e8f0',
                  }}>
                    <CircularProgress size={20} sx={{ color: '#7c3aed' }} />
                  </Box>
                </Box>
              )}

              <div ref={bottomRef} />
            </Box>
          </Box>

          {/* Input Area */}
          <Box sx={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            bgcolor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid #e2e8f0',
            p: { xs: 2, md: 3 }
          }}>
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, justifyContent: 'center' }}>
                  {quickPrompts.map((prompt) => (
                    <Chip
                      key={prompt}
                      label={prompt}
                      onClick={() => sendMessage(prompt)}
                      sx={{
                        bgcolor: 'white',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Chat Input */}
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-end',
                bgcolor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 4,
                p: 1,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'border-color 0.2s',
                '&:focus-within': { borderColor: '#3b82f6' }
              }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Message Copilot..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(input)
                    }
                  }}
                  disabled={loading}
                  variant="standard"
                  slotProps={{ input: { disableUnderline: true } }}
                  sx={{ px: 2, py: 1 }}
                />
                <Box sx={{ p: 0.5 }}>
                  <IconButton
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    sx={{
                      bgcolor: input.trim() ? '#2563eb' : '#f1f5f9',
                      color: input.trim() ? 'white' : '#cbd5e1',
                      '&:hover': { bgcolor: input.trim() ? '#1d4ed8' : '#f1f5f9' },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: '#94a3b8' }}>
                AI can make mistakes. Check important info.
              </Typography>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  )
}