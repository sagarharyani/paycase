"use client"

import { useState } from "react"
import { View, Text, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { Button } from "../src/components/ui/Button"
import { Card } from "../src/components/ui/Card"
import { useSubscription } from "../src/hooks/useSubscription"
import { purchasePackage, restorePurchases } from "../src/lib/revenuecat"

export default function PaywallScreen() {
  const { offerings, loadCustomerInfo } = useSubscription()
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async (packageToPurchase: any) => {
    setIsLoading(true)
    try {
      await purchasePackage(packageToPurchase)
      await loadCustomerInfo()
      Alert.alert("Success", "Subscription activated successfully!", [{ text: "OK", onPress: () => router.back() }])
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert("Error", "Failed to complete purchase. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async () => {
    setIsLoading(true)
    try {
      await restorePurchases()
      await loadCustomerInfo()
      Alert.alert("Success", "Purchases restored successfully!")
    } catch (error) {
      Alert.alert("Error", "No purchases found to restore.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 8 }}>
            Unlock Premium Features
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280", textAlign: "center" }}>
            Get unlimited access to all PayCase features
          </Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>Premium includes:</Text>
          {[
            "Unlimited posting",
            "Advanced feed filtering",
            "Priority customer support",
            "Exclusive premium content",
            "Ad-free experience",
          ].map((feature, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 16, color: "#10B981", marginRight: 8 }}>✓</Text>
              <Text style={{ fontSize: 16, color: "#374151" }}>{feature}</Text>
            </View>
          ))}
        </View>

        {offerings.map((offering) => (
          <View key={offering.identifier} style={{ marginBottom: 20 }}>
            {offering.availablePackages.map((pkg) => (
              <Card key={pkg.identifier} style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}>{pkg.product.title}</Text>
                    <Text style={{ fontSize: 14, color: "#6B7280" }}>{pkg.product.description}</Text>
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: "bold", color: "#3B82F6" }}>{pkg.product.priceString}</Text>
                </View>
                <Button
                  title={`Subscribe for ${pkg.product.priceString}`}
                  onPress={() => handlePurchase(pkg)}
                  loading={isLoading}
                />
              </Card>
            ))}
          </View>
        ))}

        <View style={{ marginTop: 20, gap: 12 }}>
          <Button title="Restore Purchases" onPress={handleRestore} variant="outline" loading={isLoading} />
          <Button title="Maybe Later" onPress={() => router.back()} variant="outline" />
        </View>

        <Text style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 20 }}>
          Subscriptions auto-renew unless cancelled. You can manage your subscription in your device settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
