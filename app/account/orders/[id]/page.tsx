"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/context/auth-context"
import { formatPrice } from "@/lib/utils"
import { useState, useEffect, use } from "react"

type Order = {
  id: number
  status: string
  date: string
  total: number
  shipping: number
  items: Array<{
    id: number
    name: string
    image?: string
    variant?: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
    phone: string
  }
  paymentMethod: string
}

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  if (!user) {
    router.push("/login")
    return null
  }

  useEffect(() => {
    const orderId = use(params).id;
    fetch(`/api/account/orders/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .finally(() => setLoading(false))
  }, [params])

  if (loading) return <div>載入中...</div>
  if (!order) return <div>查無訂單資料</div>

  return (
    <div className="container py-8">
      <Link href="/account/orders" className="flex items-center text-sm mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回訂單列表
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">訂單 {order.id}</h1>
        <Badge variant={order.status === "已完成" ? "default" : order.status === "已發貨" ? "secondary" : "outline"}>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 font-medium">訂單商品</div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-1">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.variant}</div>
                    <div className="text-sm">
                      {item.quantity} x {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="text-right font-medium">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 font-medium">訂單摘要</div>
            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">訂單日期</span>
                <span>{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">訂單編號</span>
                <span>{order.id}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">小計</span>
                <span>{formatPrice(order.total - order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">運費</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>總計</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 font-medium">配送資訊</div>
            <div className="p-4">
              <div className="space-y-1 mb-4">
                <div className="font-medium">{order.shippingAddress.name}</div>
                <div>{order.shippingAddress.address}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
                <div>{order.shippingAddress.phone}</div>
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">付款方式：</span>
                {order.paymentMethod}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
