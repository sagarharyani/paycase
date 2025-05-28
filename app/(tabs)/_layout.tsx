import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { AuthGuard } from "../../src/components/AuthGuard"

export default function TabLayout() {
  return (
    <AuthGuard fallback={null}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3B82F6",
          tabBarInactiveTintColor: "#6B7280",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Feed",
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          }}
        />
      </Tabs>
    </AuthGuard>
  )
}