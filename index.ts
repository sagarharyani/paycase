import { View, Text } from "react-native"

export default function IndexScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>PayCase</Text>
      <Text style={{ fontSize: 16, color: "#666", marginTop: 8 }}>Coming Soon</Text>
    </View>
  )
}