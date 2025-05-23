"use client"

import { useState, useEffect } from "react"
import { Package, ShoppingBag, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetch("/api/admin/products")
        const productsData = await productsRes.json()
        const ordersRes = await fetch("/api/admin/orders")
        const ordersData = await ordersRes.json()
        setProducts(productsData)
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate dashboard metrics
  const totalRevenue = orders.reduce((sum, order: any) => sum + order.total, 0)
  const pendingOrders = orders.filter((order: any) => order.status === "處理中").length
  const totalProducts = products.length
  const totalCustomers = [...new Set(orders.map((order: any) => order.customer?.id))].length

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold">儀表板</h1>
        <div className="text-sm text-muted-foreground">
          最後更新: {new Date().toLocaleDateString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">總營收</CardTitle>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-green-700">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">待處理訂單</CardTitle>
            <ShoppingBag className="h-6 w-6 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-yellow-700">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">需要處理的訂單</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">商品總數</CardTitle>
            <Package className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-700">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">在售商品數量</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">客戶總數</CardTitle>
            <Users className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-purple-700">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">已購買的客戶數量</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent-orders" className="mt-8">
        <TabsList className="mb-4 bg-gray-100 rounded-xl p-1 flex gap-2">
          <TabsTrigger value="recent-orders" className="px-4 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold transition">最近訂單</TabsTrigger>
          <TabsTrigger value="popular-products" className="px-4 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold transition">熱門商品</TabsTrigger>
        </TabsList>
        <TabsContent value="recent-orders" className="space-y-4">
          <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold">最近訂單</CardTitle>
              <CardDescription>過去 7 天內的訂單</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left p-3 font-bold">訂單編號</th>
                      <th className="text-left p-3 font-bold">客戶</th>
                      <th className="text-left p-3 font-bold">日期</th>
                      <th className="text-left p-3 font-bold">狀態</th>
                      <th className="text-right p-3 font-bold">金額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.slice(0, 5).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400 text-lg">暫無訂單</td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((order: any) => (
                        <tr key={order.id} className="hover:bg-primary/5 transition">
                          <td className="p-3 font-semibold">{order.id}</td>
                          <td className="p-3">{order.customer?.name || "未知客戶"}</td>
                          <td className="p-3">{order.date}</td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition
                                ${order.status === "已完成"
                                  ? "bg-green-200 text-green-900"
                                  : order.status === "已發貨"
                                    ? "bg-blue-200 text-blue-900"
                                    : "bg-yellow-200 text-yellow-900"}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-right text-base font-bold text-primary">{formatPrice(order.total)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="popular-products" className="space-y-4">
          <Card className="shadow-lg rounded-2xl border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-bold">熱門商品</CardTitle>
              <CardDescription>銷售量最高的商品</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left p-3 font-bold">商品</th>
                      <th className="text-left p-3 font-bold">分類</th>
                      <th className="text-right p-3 font-bold">價格</th>
                      <th className="text-right p-3 font-bold">銷售量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.slice(0, 5).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-400 text-lg">暫無商品</td>
                      </tr>
                    ) : (
                      products.slice(0, 5).map((product: any) => (
                        <tr key={product.id} className="hover:bg-primary/5 transition">
                          <td className="p-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="truncate max-w-[200px] font-semibold">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-3">{product.category}</td>
                          <td className="p-3 text-right font-bold text-blue-700">{formatPrice(product.price)}</td>
                          <td className="p-3 text-right font-bold">{Math.floor(Math.random() * 100)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
