import { useState } from "react"
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { useAuth } from "../../src/hooks/useAuth"
import { Button } from "../../src/components/ui/Button"
import { Input } from "../../src/components/ui/Input"
import { useAppStore } from "../../src/store/useAppStore"

export default function SignUpScreen() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { signUpWithEmail } = useAuth()
  const { isLoading } = useAppStore()

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters")
      return
    }

    try {
      await signUpWithEmail(email, password, name)
      Alert.alert("Success", "Account created successfully! Please check your email to verify your account.", [
        { text: "OK", onPress: () => router.replace("/(auth)/sign-in") },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to create account. Please try again.")
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }}>
          <View style={{ marginBottom: 40 }}>
            <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>
              Create Account
            </Text>
            <Text style={{ fontSize: 16, color: "#6B7280", textAlign: "center" }}>Join the PayCase community</Text>
          </View>

          <View style={{ marginBottom: 20 }}>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              containerStyle={{ marginBottom: 16 }}
            />
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
              containerStyle={{ marginBottom: 16 }}
            />
            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
            />
          </View>

          <Button title="Sign Up" onPress={handleSignUp} loading={isLoading} style={{ marginBottom: 20 }} />

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: "#6B7280" }}>Already have an account? </Text>
            <Text style={{ color: "#3B82F6", fontWeight: "600" }} onPress={() => router.push("/(auth)/sign-in")}>
              Sign In
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}