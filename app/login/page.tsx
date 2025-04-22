"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/context/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const success = await login(email, password)

    setIsLoading(false)

    if (success) {
      toast({
        title: "登入成功",
        description: "歡迎回來！",
      })
      router.push("/")
    } else {
      toast({
        title: "登入失敗",
        description: "電子郵件或密碼不正確",
        variant: "destructive",
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const success = await register(name, email, password)

    setIsLoading(false)

    if (success) {
      toast({
        title: "註冊成功",
        description: "您的帳戶已成功創建",
      })
      router.push("/")
    } else {
      toast({
        title: "註冊失敗",
        description: "無法創建帳戶，請稍後再試",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">帳戶</h1>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登入</TabsTrigger>
            <TabsTrigger value="register">註冊</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">電子郵件</Label>
                <Input id="login-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">密碼</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    忘記密碼？
                  </Link>
                </div>
                <Input id="login-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "登入中..." : "登入"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">姓名</Label>
                <Input id="register-name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">電子郵件</Label>
                <Input id="register-email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">密碼</Label>
                <Input id="register-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "註冊中..." : "註冊"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
