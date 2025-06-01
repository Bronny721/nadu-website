"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

async function getCustomers() {
  const res = await fetch("/api/admin/users")
  if (!res.ok) return []
  return res.json()
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("[AdminCustomersPage] Authentication token not found.");
            setIsLoading(false);
            toast({
              title: "錯誤",
              description: "找不到驗證 Token，無法載入客戶資料",
              variant: "destructive",
            });
            return;
        }

        const authHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        const customersRes = await fetch("/api/admin/users", { headers: authHeaders });
        if (!customersRes.ok) throw new Error(`HTTP error! status: ${customersRes.status} from /api/admin/users`);
        const customersData = await customersRes.json();
        console.log("[AdminCustomersPage] API 返回的客戶原始數據:", customersData);
        setCustomers(customersData);
        console.log("[AdminCustomersPage] 設置到狀態後的客戶數據:", customers);
      } catch (error) {
        console.error("Error fetching customers:", error)
        toast({
          title: "錯誤",
          description: "無法載入客戶資料",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [toast])

  const filteredCustomers = customers.filter(
    (customer: any) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  console.log("[AdminCustomersPage] 過濾後的客戶數據:", filteredCustomers);

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
        <h1 className="text-4xl font-extrabold">客戶管理</h1>
      </div>

      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜尋客戶..."
            className="pl-10 w-full shadow-sm rounded-lg focus:ring-2 focus:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-lg font-semibold hover:bg-primary/10 transition">
              <Filter className="mr-2 h-4 w-4" />
              篩選
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>所有客戶</DropdownMenuItem>
            <DropdownMenuItem>最近訂購</DropdownMenuItem>
            <DropdownMenuItem>高消費客戶</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">客戶</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">電子郵件</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">電話</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">訂單數</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">註冊日期</th>
                <th className="px-6 py-3 text-right text-base font-bold text-gray-700 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-lg">
                    沒有找到客戶
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-primary/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 mr-3 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-500">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-semibold text-base">{customer.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.phone || "未提供"}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">{customer.orderCount || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.registeredAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" className="mr-2 hover:bg-blue-50 hover:text-blue-700 transition">
                        <Mail className="h-4 w-4 mr-1" />
                        郵件
                      </Button>
                      {customer.phone && (
                        <Button variant="ghost" size="sm" className="hover:bg-green-50 hover:text-green-700 transition">
                          <Phone className="h-4 w-4 mr-1" />
                          電話
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
    </div>
  )
}
