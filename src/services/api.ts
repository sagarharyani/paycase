import { supabase } from "../lib/supabase"
import type { Vibe, Profile } from "../types/global"

const EDGE_FUNCTION_URL = `${supabase.supabaseUrl}/functions/v1`

export const vibesApi = {
  /**
   * Fetches posts from the edge function.
   * @param page The page number to fetch.
   * @param limit The number of posts to fetch per page.
   * @returns A promise that resolves to an array of Vibe objects.
   */
  async getVibes(page = 0, limit = 20): Promise<Vibe[]> {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const response = await fetch(`${EDGE_FUNCTION_URL}/vibes?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch vibes")
    }

    return response.json()
  },

  /**
   * Creates a new post.
   * @param content The content of the post.
   * @param imageUrl The URL of the image to attach to the post.
   * @returns A promise that resolves to the created Vibe object.
   */
  async createVibe(content: string, imageUrl?: string): Promise<Vibe> {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const response = await fetch(`${EDGE_FUNCTION_URL}/vibes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        image_url: imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create vibe")
    }

    return response.json()
  },

  /**
   * Updates an existing post.
   * @param id The ID of the post to update.
   * @param content The updated content of the post.
   * @param imageUrl The updated URL of the image to attach to the post.
   * @returns A promise that resolves to the updated Vibe object.
   */
  async updateVibe(id: string, content: string, imageUrl?: string): Promise<Vibe> {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const response = await fetch(`${EDGE_FUNCTION_URL}/vibes/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        image_url: imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update vibe")
    }

    return response.json()
  },

  /**
   * Deletes a post.
   * @param id The ID of the post to delete.
   * @returns A promise that resolves when the post is deleted.
   */
  async deleteVibe(id: string): Promise<void> {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) throw new Error("Not authenticated")

    const response = await fetch(`${EDGE_FUNCTION_URL}/vibes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete vibe")
    }
  },
}

export const profileApi = {
  async getProfile(): Promise<Profile | null> {
    const { data, error } = await supabase.from("profiles").select("*").single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return data
  },

  async updateProfile(updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase.from("profiles").upsert(updates).select().single()

    if (error) throw error
    return data
  },

  async uploadAvatar(uri: string): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const response = await fetch(uri)
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const fileExt = uri.split(".").pop()
    const fileName = `${user.id}.${fileExt}`

    const { data, error } = await supabase.storage.from("avatars").upload(fileName, arrayBuffer, {
      contentType: blob.type,
      upsert: true,
    })

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName)

    return publicUrl
  },
}
