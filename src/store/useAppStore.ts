import { create } from "zustand"
import type { User, Profile, Theme } from "../types/global"

interface AppState {
  user: User | null
  profile: Profile | null
  theme: Theme
  isLoading: boolean
  error: string | null
}

interface AppStore extends AppState {
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setTheme: (theme: Theme) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: AppState = {
  user: null,
  profile: null,
  theme: "system",
  isLoading: false,
  error: null,
}

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}))