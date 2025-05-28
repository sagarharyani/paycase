import type React from "react"
import { TouchableOpacity, Text, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    }

    const sizeStyles = {
      small: { paddingHorizontal: 12, paddingVertical: 8 },
      medium: { paddingHorizontal: 16, paddingVertical: 12 },
      large: { paddingHorizontal: 20, paddingVertical: 16 },
    }

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? "#9CA3AF" : "#3B82F6",
      },
      secondary: {
        backgroundColor: disabled ? "#F3F4F6" : "#E5E7EB",
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: disabled ? "#9CA3AF" : "#3B82F6",
      },
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.6 : 1,
    }
  }

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "600",
    }

    const sizeStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    }

    const variantStyles = {
      primary: { color: "#FFFFFF" },
      secondary: { color: "#374151" },
      outline: { color: disabled ? "#9CA3AF" : "#3B82F6" },
    }

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    }
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#FFFFFF" : "#3B82F6"}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}
