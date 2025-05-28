import * as SQLite from "expo-sqlite"
import type { Vibe } from "../types/global"

const db = SQLite.openDatabase("vibes.db")

export const initializeDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS vibes (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            content TEXT NOT NULL,
            image_url TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            user_name TEXT,
            user_avatar_url TEXT
          );`,
        )
        tx.executeSql(`CREATE INDEX IF NOT EXISTS idx_vibes_created_at ON vibes(created_at DESC);`)
      },
      (error) => reject(error),
      () => resolve(),
    )
  })
}

export const cacheVibes = (vibes: Vibe[]) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        vibes.forEach((vibe) => {
          tx.executeSql(
            `INSERT OR REPLACE INTO vibes 
             (id, user_id, content, image_url, created_at, updated_at, user_name, user_avatar_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              vibe.id,
              vibe.user_id,
              vibe.content,
              vibe.image_url || null,
              vibe.created_at,
              vibe.updated_at,
              vibe.user?.name || null,
              vibe.user?.avatar_url || null,
            ],
          )
        })
      },
      (error) => reject(error),
      () => resolve(),
    )
  })
}

export const getCachedVibes = (limit = 20, offset = 0): Promise<Vibe[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM vibes ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset],
        (_, { rows }) => {
          const vibes: Vibe[] = []
          for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i)
            vibes.push({
              id: row.id,
              user_id: row.user_id,
              content: row.content,
              image_url: row.image_url,
              created_at: row.created_at,
              updated_at: row.updated_at,
              user: {
                id: row.user_id,
                name: row.user_name,
                avatar_url: row.user_avatar_url,
                email: "",
                created_at: "",
                updated_at: "",
              },
            })
          }
          resolve(vibes)
        },
        (_, error) => {
          reject(error)
          return false
        },
      )
    })
  })
}

export const clearVibesCache = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("DELETE FROM vibes")
      },
      (error) => reject(error),
      () => resolve(),
    )
  })
}
