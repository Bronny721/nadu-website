"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/auth-context"
import { formatPrice } from "@/lib/utils"

// 這裡未來可串接 API 取得訂單資料
const orders: any[] = [] // 目前無資料

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="container py-8">
      <Link href="/account" className="flex items-center text-sm mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回帳戶
      </Link>

      <h1 className="text-3xl font-bold mb-8">我的訂單</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">您還沒有訂單</h2>
          <p className="text-muted-foreground mb-6">開始購物並創建您的第一個訂單</p>
          <Button asChild>
            <Link href="/">瀏覽商品</Link>
          </Button>
        </div>
      ) : (
        // 這裡未來可渲染訂單列表
        <></>
      )}
    </div>
  )
}
