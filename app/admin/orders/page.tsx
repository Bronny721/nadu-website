"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Eye, Truck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/utils"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRes = await fetch("/api/admin/orders")
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "錯誤",
          description: "無法載入訂單資料",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  const handleUpdateStatus = (order: any, status: string) => {
    setSelectedOrder(order)
    setNewStatus(status)
    setTrackingNumber(order.trackingNumber || "")
    setUpdateDialogOpen(true)
  }

  const confirmUpdateStatus = async () => {
    if (!selectedOrder) return

    try {
      const updatedOrderRes = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, trackingNumber }),
      })
      const updatedOrder = await updatedOrderRes.json()
      setOrders(orders.map((order: any) => (order.id === updatedOrder.id ? updatedOrder : order)))
      toast({
        title: "訂單已更新",
        description: `訂單 ${selectedOrder.id} 狀態已更新為 ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating order:", error)
      toast({
        title: "更新失敗",
        description: "無法更新訂單狀態，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setUpdateDialogOpen(false)
      setSelectedOrder(null)
      setNewStatus("")
      setTrackingNumber("")
    }
  }

  const filteredOrders = orders.filter((order: any) => {
    // Filter by search query
    const matchesSearch =
      String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by status
    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
        <h1 className="text-4xl font-extrabold">訂單管理</h1>
      </div>

      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜尋訂單編號或客戶..."
            className="pl-10 w-full shadow-sm rounded-lg focus:ring-2 focus:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-lg font-semibold hover:bg-primary/10 transition">
              <Filter className="mr-2 h-4 w-4" />
              {statusFilter === "all" ? "所有狀態" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>所有狀態</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("處理中")}>處理中</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("已發貨")}>已發貨</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("已完成")}>已完成</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("已取消")}>已取消</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">訂單編號</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">客戶</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">日期</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">金額</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">狀態</th>
                <th className="px-6 py-3 text-right text-base font-bold text-gray-700 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-lg">
                    沒有找到訂單
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-primary/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-lg">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{order.customer?.name || "未知客戶"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700 font-bold">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-sm font-bold rounded-full shadow-sm transition
                          ${order.status === "已完成"
                            ? "bg-green-200 text-green-900"
                            : order.status === "已發貨"
                              ? "bg-blue-200 text-blue-900"
                              : order.status === "已取消"
                                ? "bg-red-200 text-red-900"
                                : "bg-yellow-200 text-yellow-900"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" asChild className="mr-2 hover:bg-blue-50 hover:text-blue-700 transition">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          查看
                        </Link>
                      </Button>
                      {order.status === "處理中" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mr-2 hover:bg-yellow-50 hover:text-yellow-700 transition"
                          onClick={() => handleUpdateStatus(order, "已發貨")}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          標記為已發貨
                        </Button>
                      )}
                      {order.status === "已發貨" && (
                        <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-700 transition" onClick={() => handleUpdateStatus(order, "已完成")}> 
                          <CheckCircle className="h-4 w-4 mr-1" />
                          標記為已完成
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>更新訂單狀態</DialogTitle>
            <DialogDescription>
              您正在將訂單 {selectedOrder?.id} 的狀態更新為 {newStatus}
            </DialogDescription>
          </DialogHeader>

          {newStatus === "已發貨" && (
            <div className="space-y-2 py-4">
              <Label htmlFor="trackingNumber">物流追蹤號碼</Label>
              <Input
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="輸入物流追蹤號碼"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmUpdateStatus}>確認更新</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface LabelProps {
  htmlFor: string
  children: React.ReactNode
}

function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
    </label>
  )
}
