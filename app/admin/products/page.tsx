"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react"
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRes = await fetch("/api/admin/products")
        const productsData = await productsRes.json()
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "錯誤",
          description: "無法載入商品資料",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: "DELETE",
      })
      setProducts(products.filter((p: any) => p.id !== productToDelete.id))
      toast({
        title: "刪除成功",
        description: `商品 "${productToDelete.name}" 已成功刪除`,
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "刪除失敗",
        description: "無法刪除商品，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
        <h1 className="text-4xl font-extrabold">商品管理</h1>
        <Button asChild className="rounded-lg shadow-md font-bold text-base px-6 py-2 bg-primary text-white hover:brightness-110 active:scale-95 transition">
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-5 w-5" />
            新增商品
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜尋商品..."
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
            <DropdownMenuItem>所有商品</DropdownMenuItem>
            <DropdownMenuItem>有庫存</DropdownMenuItem>
            <DropdownMenuItem>庫存不足</DropdownMenuItem>
            <DropdownMenuItem>已下架</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">商品</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">分類</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">價格</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">庫存</th>
                <th className="px-6 py-3 text-left text-base font-bold text-gray-700 uppercase tracking-wider">狀態</th>
                <th className="px-6 py-3 text-right text-base font-bold text-gray-700 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-lg">
                    沒有找到商品
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: any) => (
                  <tr key={product.id} className="hover:bg-primary/5 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 mr-3 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                          <img
                            className="h-12 w-12 object-cover"
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                          />
                        </div>
                        <div className="max-w-xs truncate font-semibold text-base">{product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700 font-bold">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">{product.stock || "無限"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-sm font-bold rounded-full shadow-sm transition
                          ${product.isNew
                            ? "bg-green-200 text-green-900"
                            : product.stock === 0
                              ? "bg-red-200 text-red-900"
                              : "bg-blue-200 text-blue-900"}`}
                      >
                        {product.isNew ? "新品" : product.stock === 0 ? "缺貨" : "銷售中"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" asChild className="mr-2 hover:bg-blue-50 hover:text-blue-700 transition">
                        <Link href={`/admin/products/edits/${product.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          編輯
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-700 transition" onClick={() => handleDeleteClick(product)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        刪除
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
            <DialogDescription>您確定要刪除商品 "{productToDelete?.name}" 嗎？此操作無法撤銷。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
