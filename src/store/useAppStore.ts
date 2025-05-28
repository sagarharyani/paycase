import { create } from "zustand"
import type { AppState, User, Profile, Subscription, Theme } from "../types/global"

interface AppStore extends AppState {
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setSubscription: (subscription: Subscription | null) => void
  setTheme: (theme: Theme) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState: AppState = {
  user: null,
  profile: null,
  subscription: null,
  theme: "system",
  isLoading: false,
  error: null,
}

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setSubscription: (subscription) => set({ subscription }),
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}))
