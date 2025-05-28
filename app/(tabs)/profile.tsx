"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, Alert, Switch, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import * as ImagePicker from "expo-image-picker"
import { useAuth } from "../../src/hooks/useAuth"
import { useSubscription } from "../../src/hooks/useSubscription"
import { Button } from "../../src/components/ui/Button"
import { Input } from "../../src/components/ui/Input"
import { Card } from "../../src/components/ui/Card"
import { profileApi } from "../../src/services/api"
import { useAppStore } from "../../src/store/useAppStore"
import { router } from "expo-router"

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const { hasActiveSubscription } = useSubscription()
  const { profile, setProfile } = useAppStore()
  const [name, setName] = useState(user?.name || "")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const profileData = await profileApi.getProfile()
      if (profileData) {
        setProfile(profileData)
        setName(profileData.name || "")
        setNotificationsEnabled(profileData.notifications_enabled)
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const updatedProfile = await profileApi.updateProfile({
        user_id: user.id,
        name,
        notifications_enabled: notificationsEnabled,
      })
      setProfile(updatedProfile)
      Alert.alert("Success", "Profile updated successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions to upload an avatar")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled && result.assets[0]) {
      setIsLoading(true)
      try {
        const avatarUrl = await profileApi.uploadAvatar(result.assets[0].uri)
        const updatedProfile = await profileApi.updateProfile({
          user_id: user!.id,
          avatar_url: avatarUrl,
        })
        setProfile(updatedProfile)
        Alert.alert("Success", "Avatar updated successfully")
      } catch (error) {
        Alert.alert("Error", "Failed to upload avatar")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut()
          router.replace("/(auth)/sign-in")
        },
      },
    ])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#111827" }}>Profile</Text>

        <Card style={{ marginBottom: 20 }}>
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 12 }}
              />
            ) : (
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "#E5E7EB",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 32, fontWeight: "600", color: "#6B7280" }}>
                  {name.charAt(0) || user?.email?.charAt(0) || "?"}
                </Text>
              </View>
            )}
            <Button
              title="Change Avatar"
              onPress={handleImagePicker}
              variant="outline"
              size="small"
              loading={isLoading}
            />
          </View>

          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            containerStyle={{ marginBottom: 16 }}
          />

          <Input
            label="Email"
            value={user?.email || ""}
            editable={false}
            containerStyle={{ marginBottom: 20 }}
            inputStyle={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
          />

          <Button title="Update Profile" onPress={handleUpdateProfile} loading={isLoading} />
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16, color: "#111827" }}>Settings</Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
          >
            <Text style={{ fontSize: 16, color: "#374151" }}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Card>

        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16, color: "#111827" }}>Subscription</Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}
          >
            <Text style={{ fontSize: 16, color: "#374151" }}>Status</Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: hasActiveSubscription ? "#10B981" : "#6B7280",
                backgroundColor: hasActiveSubscription ? "#D1FAE5" : "#F3F4F6",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              {hasActiveSubscription ? "Active" : "Free"}
            </Text>
          </View>

          {!hasActiveSubscription && (
            <Button title="Upgrade to Premium" onPress={() => router.push("/paywall")} variant="outline" />
          )}
        </Card>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={{ borderColor: "#EF4444" }}
          textStyle={{ color: "#EF4444" }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
