'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Box, Paper, Typography, TextField,
  Button, Avatar, IconButton, Chip,
  Divider, Tooltip, Fade,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import PeopleIcon from '@mui/icons-material/People'
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningIcon from '@mui/icons-material/Warning'
import TopBar from '@/components/layout/TopBar'
import api from '@/lib/api'

interface Message {
  role: 'user' | 'ai'
  text: string
  time: string
  id: string
}

const suggestedQuestions = [
  {
    icon: <AssignmentLateIcon sx={{ fontSize: 18 }} />,
    text: 'Which employees have the most overdue tasks?',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
    text: "What is the team's completion rate this week?",
  },
  {
    icon: <WarningIcon sx={{ fontSize: 18 }} />,
    text: 'Which tasks are at high risk of being delayed?',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 18 }} />,
    text: 'Who has the lightest workload right now?',
  },
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} />,
    text: "Give me a summary of this week's progress",
  },
  {
    icon: <AssignmentLateIcon sx={{ fontSize: 18 }} />,
    text: 'What are the top critical priority tasks?',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 18 }} />,
    text: 'Which department is performing best?',
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
    text: 'Give me action items for today',
  },
]

const capabilities = [
  'Analyze team workload and capacity',
  'Find and explain overdue tasks',
  'Summarize weekly progress',
  'Identify at-risk tasks',
  'Compare department performance',
  'Suggest action items',
]

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'ai',
    id: '0',
    text: "Hi! I'm TaskFlow Copilot. I have access to your " +
          "team's real-time task data. Ask me anything about " +
          "workload, progress, overdue tasks, or team performance.",
    time: new Date().toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit',
    }),
  }])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied,  setCopied]  = useState<string | null>(null)
  const bottomRef             = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      role: 'user',
      id:   Date.now().toString(),
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/ai/chat', {
        message: text.trim(),
      })
      const aiMsg: Message = {
        role: 'ai',
        id:   (Date.now() + 1).toString(),
        text: res.data.reply,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit',
        }),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'ai',
        id:   (Date.now() + 1).toString(),
        text: 'Sorry, I could not process that right now. ' +
              'Please check your Gemini API key configuration.',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit', minute: '2-digit',
        }),
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TopBar title="AI Assistant" />

      <Box sx={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
        p: 2,
        gap: 2,
      }}>

        {/* LEFT PANEL */}
        <Paper sx={{
          width: 280,
          flexShrink: 0,
          borderRadius: 3,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: 1.5, color: '#1e293b' }}
            >
              Suggested Questions
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}>
              {suggestedQuestions.map((q, i) => (
                <Box
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#eff6ff',
                      borderColor: '#2563eb',
                    },
                  }}
                >
                  <Box sx={{ color: '#2563eb', mt: 0.2, flexShrink: 0 }}>
                    {q.icon}
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#475569',
                      lineHeight: 1.4,
                      fontWeight: 500,
                    }}
                  >
                    {q.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: 1.5, color: '#1e293b' }}
            >
              What I Can Help With
            </Typography>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
            }}>
              {capabilities.map((cap, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#7c3aed',
                    flexShrink: 0,
                  }} />
                  <Typography
                    variant="caption"
                    sx={{ color: '#64748b' }}
                  >
                    {cap}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* RIGHT PANEL — CHAT */}
        <Paper sx={{
          flex: 1,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* Chat Header */}
          <Box sx={{
            p: 2,
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}>
            <Avatar sx={{ bgcolor: '#7c3aed', width: 36, height: 36 }}>
              <SmartToyIcon sx={{ fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700 }}
              >
                TaskFlow Copilot
              </Typography>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#16a34a',
                }} />
                <Typography
                  variant="caption"
                  sx={{ color: '#16a34a', fontWeight: 600 }}
                >
                  Online • RAG Enabled
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            {messages.map((msg) => (
              <Fade key={msg.id} in timeout={300}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user'
                    ? 'flex-end'
                    : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}>
                  {msg.role === 'ai' && (
                    <Avatar sx={{
                      width: 32,
                      height: 32,
                      bgcolor: '#7c3aed',
                    }}>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}

                  <Box sx={{ maxWidth: '75%' }}>
                    {msg.role === 'ai' ? (
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0 12px 12px 12px',
                          position: 'relative',
                        }}
                      >
                        <Tooltip
                          title={copied === msg.id
                            ? 'Copied!'
                            : 'Copy'}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleCopy(msg.id, msg.text)
                            }
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              opacity: 0.4,
                              '&:hover': { opacity: 1 },
                            }}
                          >
                            <ContentCopyIcon
                              sx={{ fontSize: 14 }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.7,
                            pr: 3,
                          }}
                        >
                          {msg.text}
                        </Typography>
                      </Paper>
                    ) : (
                      <Box sx={{
                        p: 2,
                        bgcolor: '#2563eb',
                        borderRadius: '12px 0 12px 12px',
                      }}>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'white',
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.7,
                          }}
                        >
                          {msg.text}
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        mt: 0.5,
                        display: 'block',
                        textAlign: msg.role === 'user'
                          ? 'right'
                          : 'left',
                      }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>

                  {msg.role === 'user' && (
                    <Avatar sx={{
                      width: 32,
                      height: 32,
                      bgcolor: '#2563eb',
                    }}>
                      <PersonIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                </Box>
              </Fade>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <Avatar sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#7c3aed',
                }}>
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid #e2e8f0',
                    borderRadius: '0 12px 12px 12px',
                    display: 'flex',
                    gap: 0.5,
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#7c3aed',
                        animation: 'bounce 1.4s infinite',
                        animationDelay: `${i * 0.2}s`,
                        '@keyframes bounce': {
                          '0%, 80%, 100%': {
                            transform: 'scale(0)',
                            opacity: 0.3,
                          },
                          '40%': {
                            transform: 'scale(1)',
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  ))}
                </Paper>
              </Box>
            )}

            <div ref={bottomRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{
            p: 2,
            borderTop: '1px solid #e2e8f0',
          }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask about your team, tasks, workload..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage(input)
                  }
                }}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                sx={{
                  borderRadius: 3,
                  px: 2.5,
                  minWidth: 56,
                  alignSelf: 'flex-end',
                }}
              >
                <SendIcon />
              </Button>
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                mt: 1,
                display: 'block',
                textAlign: 'center',
              }}
            >
              ✨ Powered by Gemini AI + RAG • 
              Answers based on your live team data
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}