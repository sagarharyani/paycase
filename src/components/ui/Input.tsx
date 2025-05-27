import type React from "react"
import { TextInput, View, Text, type TextInputProps, type ViewStyle, type TextStyle } from "react-native"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
  inputStyle?: TextStyle
  labelStyle?: TextStyle
  errorStyle?: TextStyle
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  const getInputStyle = (): TextStyle => ({
    borderWidth: 1,
    borderColor: error ? "#EF4444" : "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#111827",
  })

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[{ fontSize: 14, fontWeight: "500", marginBottom: 4, color: "#374151" }, labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput style={[getInputStyle(), inputStyle]} placeholderTextColor="#9CA3AF" {...props} />
      {error && <Text style={[{ fontSize: 12, color: "#EF4444", marginTop: 4 }, errorStyle]}>{error}</Text>}
    </View>
  )
}