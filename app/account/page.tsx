"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, User, Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/context/auth-context"
import React from "react"

export default function AccountPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  React.useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "已登出",
      description: "您已成功登出帳戶",
    })
    router.push("/")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">我的帳戶</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>個人資料</CardTitle>
            <CardDescription>管理您的個人資料和密碼</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link href="/account/profile">編輯個人資料</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>我的訂單</CardTitle>
            <CardDescription>查看和管理您的訂單</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">訂單歷史</div>
                  <div className="text-sm text-muted-foreground">查看您的訂單狀態和歷史記錄</div>
                </div>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link href="/account/orders">查看訂單</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>我的收藏</CardTitle>
            <CardDescription>查看您收藏的商品</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">收藏清單</div>
                  <div className="text-sm text-muted-foreground">查看您收藏的商品</div>
                </div>
              </div>
              <Button variant="outline" asChild className="w-full">
                <Link href="/favorites">查看收藏</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          登出
        </Button>
      </div>
    </div>
  )
}
