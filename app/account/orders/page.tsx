"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/context/auth-context"
import { formatPrice } from "@/lib/utils"

// 模擬訂單數據
const mockOrders = [
  {
    id: "ORD-123456",
    date: "2023-10-15",
    status: "已完成",
    total: 2350,
    items: 3,
  },
  {
    id: "ORD-123457",
    date: "2023-11-02",
    status: "處理中",
    total: 1680,
    items: 2,
  },
  {
    id: "ORD-123458",
    date: "2023-11-20",
    status: "已發貨",
    total: 850,
    items: 1,
  },
]

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

      {mockOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">您還沒有訂單</h2>
          <p className="text-muted-foreground mb-6">開始購物並創建您的第一個訂單</p>
          <Button asChild>
            <Link href="/">瀏覽商品</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 bg-muted px-4 py-3 font-medium">
            <div className="col-span-3">訂單編號</div>
            <div className="col-span-2">日期</div>
            <div className="col-span-2">狀態</div>
            <div className="col-span-2">商品數量</div>
            <div className="col-span-2">總金額</div>
            <div className="col-span-1"></div>
          </div>
          <div className="divide-y">
            {mockOrders.map((order) => (
              <div key={order.id} className="grid grid-cols-12 px-4 py-4 items-center">
                <div className="col-span-3 font-medium">{order.id}</div>
                <div className="col-span-2">{order.date}</div>
                <div className="col-span-2">
                  <Badge
                    variant={
                      order.status === "已完成" ? "default" : order.status === "已發貨" ? "secondary" : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <div className="col-span-2">{order.items} 件商品</div>
                <div className="col-span-2 font-medium">{formatPrice(order.total)}</div>
                <div className="col-span-1 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
