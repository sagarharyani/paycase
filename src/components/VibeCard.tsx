import type React from "react"
import { View, Text, Image } from "react-native"
import type { Vibe } from "../types/global"
import { Card } from "./ui/Card"

interface VibeCardProps {
  vibe: Vibe
}

export const VibeCard: React.FC<VibeCardProps> = ({ vibe }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        {vibe.user?.avatar_url ? (
          <Image
            source={{ uri: vibe.user.avatar_url }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#E5E7EB",
              marginRight: 12,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#6B7280" }}>
              {vibe.user?.name?.charAt(0) || "?"}
            </Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}>{vibe.user?.name || "Anonymous"}</Text>
          <Text style={{ fontSize: 12, color: "#6B7280" }}>{formatDate(vibe.created_at)}</Text>
        </View>
      </View>

      <Text style={{ fontSize: 16, color: "#111827", marginBottom: 12, lineHeight: 22 }}>{vibe.content}</Text>

      {vibe.image_url && (
        <Image
          source={{ uri: vibe.image_url }}
          style={{ width: "100%", height: 200, borderRadius: 8 }}
          resizeMode="cover"
        />
      )}
    </Card>
  )
}
