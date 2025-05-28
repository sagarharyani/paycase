"use client"

import { useState, useEffect, useCallback } from "react"
import { View, FlatList, RefreshControl, ActivityIndicator, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { VibeCard } from "../../src/components/VibeCard"
import { SubscriptionGuard } from "../../src/components/SubscriptionGuard"
import { vibesApi } from "../../src/services/api"
import { getCachedVibes, cacheVibes } from "../../src/lib/database"
import type { Vibe } from "../../src/types/global"

export default function FeedScreen() {
  const [refreshing, setRefreshing] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch } = useInfiniteQuery({
    queryKey: ["vibes"],
    queryFn: ({ pageParam = 0 }) => vibesApi.getVibes(pageParam, 20),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 20 ? pages.length : undefined
    },
    initialPageParam: 0,
  })

  // Cache vibes locally
  useEffect(() => {
    if (data?.pages) {
      const allVibes = data.pages.flat()
      cacheVibes(allVibes).catch(console.error)
    }
  }, [data])

  // Load cached vibes on mount
  const { data: cachedVibes } = useQuery({
    queryKey: ["cachedVibes"],
    queryFn: () => getCachedVibes(20, 0),
    enabled: !data && !isLoading,
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const renderItem = ({ item }: { item: Vibe }) => <VibeCard vibe={item} />

  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    )
  }

  const vibes = data?.pages.flat() || cachedVibes || []

  if (isLoading && !cachedVibes) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 10, color: "#6B7280" }}>Loading feed...</Text>
      </SafeAreaView>
    )
  }

  if (error && !cachedVibes) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8, textAlign: "center" }}>
          Something went wrong
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>
          Unable to load feed. Please try again.
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SubscriptionGuard>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <View style={{ padding: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}>PayCase Feed</Text>
        </View>

        <FlatList
          data={vibes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 0 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </SubscriptionGuard>
  )
}
