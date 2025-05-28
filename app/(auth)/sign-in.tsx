import { useState } from "react"
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { useAuth } from "../../src/hooks/useAuth"
import { Button } from "../../src/components/ui/Button"
import { Input } from "../../src/components/ui/Input"
import { useAppStore } from "../../src/store/useAppStore"

export default function SignInScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signInWithEmail } = useAuth()
  const { isLoading } = useAppStore()

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    try {
      await signInWithEmail(email, password)
      router.replace("/(tabs)")
    } catch (error) {
      Alert.alert("Error", "Failed to sign in. Please check your credentials.")
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}>
          <View style={{ marginBottom: 40 }}>
            <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>
              Welcome Back
            </Text>
            <Text style={{ fontSize: 16, color: "#6B7280", textAlign: "center" }}>Sign in to your account</Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={{ marginBottom: 16 }}
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>

          <Button title="Sign In" onPress={handleSignIn} loading={isLoading} style={{ marginBottom: 20 }} />

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#6B7280" }}>Don't have an account? </Text>
            <Text style={{ color: "#3B82F6", fontWeight: "600" }} onPress={() => router.push("/(auth)/sign-up")}>
              Sign Up
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}