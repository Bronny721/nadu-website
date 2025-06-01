"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/auth-context"
import { formatPrice } from "@/lib/utils"
import { useEffect, useState } from "react"

interface OrderItem {
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

interface Order {
  id: number
  status: string
  date: string // 或 Date 類型，根據你的 API 回傳格式調整
  total: number
  items: OrderItem[]
  shippingAddress: any // 你可以定義更詳細的 shippingAddress 類型
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && orders.length === 0 && isLoading) {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem("token")

          if (!token) {
            setIsLoading(false)
            setError("未登入或無法獲取認證資訊")
            return
          }

          const response = await fetch("/api/account/orders", {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "無法獲取訂單列表")
          }
          const data = await response.json()
          setOrders(data)
        } catch (err: any) {
          console.error("獲取訂單失敗:", err)
          setError(err.message || "獲取訂單失敗")
        } finally {
          setIsLoading(false)
        }
      }

      fetchOrders()
    }

    if (!user && !authLoading) {
      setIsLoading(false)
    }

  }, [user, authLoading, orders.length, isLoading])

  if (authLoading || isLoading) {
    return (
      <div className="container py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p>載入中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-red-500">
        <p>載入訂單時發生錯誤: {error}</p>
      </div>
    )
  }

  if (!user) {
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
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold">訂單號碼: {order.id}</h3>
                  <p className="text-sm text-muted-foreground">訂單日期: {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <Badge variant="secondary">{order.status}</Badge>
              </div>
              <div className="mb-4">
                <p className="text-muted-foreground">總金額: {formatPrice(order.total)}</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/account/orders/${order.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    查看詳情
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
