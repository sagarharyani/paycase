export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  name?: string
  avatar_url?: string
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}

export type Theme = "light" | "dark" | "system"