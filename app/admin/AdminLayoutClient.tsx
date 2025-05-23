"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Menu, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/context/auth-context"

interface AdminLayoutClientProps {
  children: React.ReactNode
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 檢查是否為店家，如果不是則重定向到登入頁面
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else if (user.role !== "merchant" && user.role !== "store_owner") {
      router.push("/")
    }
  }, [user, router])

  // 如果用戶未登入或不是店家，不顯示後台內容
  if (!user || (user.role !== "merchant" && user.role !== "store_owner")) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navigation = [
    { name: "儀表板", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "商品管理", href: "/admin/products", icon: Package },
    { name: "訂單管理", href: "/admin/orders", icon: ShoppingCart },
    { name: "客戶管理", href: "/admin/customers", icon: Users },
    { name: "設定", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 桌面側邊欄 */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/admin/dashboard" className="flex items-center">
              <img src="/images/nadu-logo.png" alt="nadu." className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">店家後台</span>
            </Link>
          </div>
          <div className="flex flex-col flex-grow">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-5 w-5 ${
                        isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user.name}</p>
                  <div className="flex items-center mt-1">
                    <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-700 mr-3">
                      <Home className="inline-block h-4 w-4 mr-1" />
                      前台
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      登出
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 手機選單 */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b w-full">
        <div className="flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">開啟選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex items-center mb-6">
                <img src="/images/nadu-logo.png" alt="nadu." className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">店家後台</span>
              </div>
              <nav className="flex flex-col space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Link
                    href="/"
                    className="flex items-center px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="mr-3 h-5 w-5 text-gray-400" />
                    返回前台
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md w-full text-left"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                    登出
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <span className="text-lg font-semibold ml-2">店家後台</span>
        </div>
        <div className="flex items-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 mr-4">
            <Home className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
