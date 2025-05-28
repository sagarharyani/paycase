"use client"

import type React from "react"
import { View, ActivityIndicator } from "react-native"
import { useAuth } from "../hooks/useAuth"
import { useAppStore } from "../store/useAppStore"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { user } = useAuth()
  const { isLoading } = useAppStore()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    )
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
