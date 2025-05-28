"use client"

import { useEffect } from "react"
import { Stack } from "expo-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { StatusBar } from "expo-status-bar"
import { initializeDatabase } from "../src/lib/database"

const queryClient = new QueryClient()

export default function RootLayout() {
  useEffect(() => {
    initializeDatabase().catch(console.error)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="paywall" />
      </Stack>
      <StatusBar style="auto" />
    </QueryClientProvider>
  )
}
