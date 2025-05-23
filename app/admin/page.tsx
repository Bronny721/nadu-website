"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"

export default function AdminPage() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login")
      return
    }
    try {
      const payload = jwtDecode<{ role: string }>(token)
      if (payload.role !== "vendor") {
        router.replace("/")
      }
    } catch {
      router.replace("/login")
    }
  }, [router])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">店家後台</h1>
      {/* 這裡是後台內容 */}
      <p>只有店家（vendor）可以看到這個頁面。</p>
    </div>
  )
} 