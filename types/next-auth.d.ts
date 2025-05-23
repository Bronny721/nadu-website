import NextAuth from "next-auth"

// 擴充 next-auth 的 Session 型別，讓 user 支援 id

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string | number
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
} 