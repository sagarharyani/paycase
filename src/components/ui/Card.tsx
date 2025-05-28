import type React from "react"
import { View, type ViewStyle } from "react-native"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  const cardStyle: ViewStyle = {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  }

  return <View style={[cardStyle, style]}>{children}</View>
}
