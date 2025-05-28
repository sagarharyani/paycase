"use client"

import { useEffect, useState } from "react"
import { getCustomerInfo, hasActiveSubscription, getOfferings } from "../lib/revenuecat"
import { useAppStore } from "../store/useAppStore"
import type { CustomerInfo, PurchasesOffering } from "react-native-purchases"

export const useSubscription = () => {
  const { user, subscription, setSubscription } = useAppStore()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadCustomerInfo()
      loadOfferings()
    }
  }, [user])

  const loadCustomerInfo = async () => {
    try {
      const info = await getCustomerInfo()
      setCustomerInfo(info)

      // Update subscription state based on RevenueCat info
      const hasActive = hasActiveSubscription(info)
      if (hasActive) {
        // You would typically sync this with your backend
        setSubscription({
          id: "rc_subscription",
          user_id: user!.id,
          plan_type: "monthly", // Determine from RevenueCat
          status: "active",
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        })
      } else {
        setSubscription(null)
      }
    } catch (error) {
      console.error("Error loading customer info:", error)
    }
  }

  const loadOfferings = async () => {
    setIsLoading(true)
    try {
      const availableOfferings = await getOfferings()
      setOfferings(availableOfferings)
    } catch (error) {
      console.error("Error loading offerings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const hasActiveSubscriptionStatus = customerInfo ? hasActiveSubscription(customerInfo) : false

  return {
    customerInfo,
    offerings,
    hasActiveSubscription: hasActiveSubscriptionStatus,
    subscription,
    isLoading,
    loadCustomerInfo,
    loadOfferings,
  }
}
