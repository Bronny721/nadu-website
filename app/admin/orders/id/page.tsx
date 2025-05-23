"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Truck, CheckCircle, XCircle, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/utils"

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

export default function AdminOrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [trackingNumber, setTrackingNumber] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderRes = await fetch(`/api/admin/orders/${params.id}`)
        const orderData = await orderRes.json()
        setOrder(orderData)
        setTrackingNumber(orderData?.trackingNumber || "")
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "錯誤",
          description: "無法載入訂單資料",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, toast])

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return

    setIsUpdating(true)
    try {
      const updatedOrder = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, trackingNumber }),
      })
      const updatedOrderData = await updatedOrder.json()
      setOrder(updatedOrderData)
      toast({
        title: "訂單已更新",
        description: `訂單狀態已更新為 ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "更新失敗",
        description: "無法更新訂單狀態，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">訂單不存在</h2>
          <p className="text-muted-foreground mb-6">找不到您請求的訂單</p>
          <Button asChild>
            <Link href="/admin/orders">返回訂單列表</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回訂單列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">訂單 {order.id}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            列印訂單
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">訂單詳情</h2>
                  <p className="text-sm text-muted-foreground">訂單日期: {order.date}</p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      order.status === "已完成"
                        ? "bg-green-100 text-green-800"
                        : order.status === "已出貨"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "已取消"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">商品</th>
                      <th className="text-center py-3 px-4">數量</th>
                      <th className="text-right py-3 px-4">單價</th>
                      <th className="text-right py-3 px-4">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item: any) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                              />
                            </div>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              {item.variant && <div className="text-sm text-muted-foreground">{item.variant}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">{item.quantity}</td>
                        <td className="py-4 px-4 text-right">{formatPrice(item.price)}</td>
                        <td className="py-4 px-4 text-right">{formatPrice(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-b">
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">
                        小計
                      </td>
                      <td className="py-3 px-4 text-right">{formatPrice(order.total - order.shipping)}</td>
                    </tr>
                    <tr className="border-b">
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">
                        運費
                      </td>
                      <td className="py-3 px-4 text-right">{formatPrice(order.shipping)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">
                        總計
                      </td>
                      <td className="py-3 px-4 text-right font-bold">{formatPrice(order.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* 訂單狀態更新 */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">訂單狀態更新</h2>
              <div className="space-y-4">
                {order.status === "待出貨" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber">物流追蹤號碼</Label>
                      <Input
                        id="trackingNumber"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="輸入物流追蹤號碼"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => handleUpdateStatus("已出貨")} disabled={isUpdating} className="flex-1">
                        <Truck className="h-4 w-4 mr-2" />
                        標記為已出貨
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatus("已取消")}
                        disabled={isUpdating}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        取消訂單
                      </Button>
                    </div>
                  </>
                )}

                {order.status === "已出貨" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber">物流追蹤號碼</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="trackingNumber"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="輸入物流追蹤號碼"
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleUpdateStatus(order.status)}
                          disabled={isUpdating || trackingNumber === order.trackingNumber}
                        >
                          更新
                        </Button>
                      </div>
                    </div>
                    <Button onClick={() => handleUpdateStatus("已完成")} disabled={isUpdating} className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      標記為已完成
                    </Button>
                  </>
                )}

                {order.status === "已完成" && (
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <p className="text-green-700">此訂單已完成</p>
                    </div>
                  </div>
                )}

                {order.status === "已取消" && (
                  <div className="bg-red-50 p-4 rounded-md">
                    <div className="flex">
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-red-700">此訂單已取消</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* 客戶資訊 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">客戶資訊</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{order.customer?.name}</p>
                  <p className="text-sm text-muted-foreground">{order.customer?.email}</p>
                  <p className="text-sm text-muted-foreground">{order.customer?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 配送資訊 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">配送資訊</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">收件人: {order.shippingAddress?.name}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>
                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                  </p>
                  <p>{order.shippingAddress?.country}</p>
                  <p>{order.shippingAddress?.phone}</p>
                </div>
                {order.trackingNumber && (
                  <div className="pt-2">
                    <p className="text-sm font-medium">物流追蹤號碼:</p>
                    <p className="text-sm">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 付款資訊 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">付款資訊</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">付款方式:</p>
                  <p>{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="font-medium">付款狀態:</p>
                  <p className="text-green-600">已付款</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
