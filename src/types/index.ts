export type UserRole = 'Employee' | 'Manager' | 'Admin'

export type TaskStatus =
  | 'Todo'
  | 'InProgress'
  | 'InReview'
  | 'Done'
  | 'Cancelled'

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  isActive: boolean
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  createdAt: string
  completedAt?: string
  assignedToId: string
  assignedToName: string
  assignedToEmail: string
  createdByName: string
  riskScore: number
  isHighRisk: boolean
  isOverdue: boolean
  commentCount: number
}

export interface Comment {
  id: string
  message: string
  createdAt: string
  userName: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  role: string
  name: string
  email: string
  userId: string
}

export interface TaskSummary {
  total: number
  todo: number
  inProgress: number
  inReview: number
  done: number
  overdue: number
}

export interface TeamMember {
  employeeId: string
  name: string
  department: string
  total: number
  todo: number
  inProgress: number
  done: number
  overdue: number
}

export interface CreateTaskData {
  title: string
  description: string
  priority: number
  dueDate: string
  assignedToId: string
}

export interface UpdateTaskData {
  title?:        string
  description?:  string
  status?:       string
  priority?:     string
  dueDate?:      string
  assignedToId?: string
}