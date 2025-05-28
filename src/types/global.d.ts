export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Vibe {
  id: string
  user_id: string
  content: string
  image_url?: string
  created_at: string
  updated_at: string
  user?: User
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

export interface Subscription {
  id: string
  user_id: string
  plan_type: "monthly" | "yearly"
  status: "active" | "inactive" | "cancelled"
  expires_at: string
  created_at: string
}

export type Theme = "light" | "dark" | "system"

export interface AppState {
  user: User | null
  profile: Profile | null
  subscription: Subscription | null
  theme: Theme
  isLoading: boolean
  error: string | null
}
