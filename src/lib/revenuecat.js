import Purchases, { type PurchasesOffering, type CustomerInfo } from "react-native-purchases"
import { EXPO_PUBLIC_REVENUECAT_API_KEY } from "@env"
import { Platform } from "react-native"

export const initializeRevenueCat = async (userId: string) => {
  try {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG)

    if (Platform.OS === "ios") {
      await Purchases.configure({ apiKey: EXPO_PUBLIC_REVENUECAT_API_KEY })
    } else if (Platform.OS === "android") {
      await Purchases.configure({ apiKey: EXPO_PUBLIC_REVENUECAT_API_KEY })
    }

    await Purchases.logIn(userId)
  } catch (error) {
    console.error("Error initializing RevenueCat:", error)
  }
}

export const getOfferings = async (): Promise<PurchasesOffering[]> => {
  try {
    const offerings = await Purchases.getOfferings()
    return Object.values(offerings.all)
  } catch (error) {
    console.error("Error getting offerings:", error)
    return []
  }
}

export const purchasePackage = async (packageToPurchase: any) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase)
    return customerInfo
  } catch (error) {
    console.error("Error purchasing package:", error)
    throw error
  }
}

export const restorePurchases = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.restorePurchases()
    return customerInfo
  } catch (error) {
    console.error("Error restoring purchases:", error)
    throw error
  }
}

export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo()
    return customerInfo
  } catch (error) {
    console.error("Error getting customer info:", error)
    throw error
  }
}

export const hasActiveSubscription = (customerInfo: CustomerInfo): boolean => {
  return Object.keys(customerInfo.entitlements.active).length > 0
}
