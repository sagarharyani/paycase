"use client"

import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { router } from "expo-router"
import { useAuth } from "../src/hooks/useAuth"

export default function IndexScreen() {
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        router.replace("/(tabs)")
      } else {
        router.replace("/(auth)/sign-in")
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [user])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  )
}
