"use client"

import React, { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/context/auth-context"
import { Eye, EyeOff } from "lucide-react"

// 密碼強度條組件
const PasswordStrengthBar = React.memo(({ password }: { password: string }) => {
  const strength = useMemo(() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }, [password])

  const { color, text } = useMemo(() => {
    switch (strength) {
      case 4:
        return { color: "bg-green-500", text: "強" }
      case 3:
        return { color: "bg-lime-400", text: "中" }
      case 2:
        return { color: "bg-yellow-400", text: "弱" }
      default:
        return { color: "bg-red-400", text: "太弱" }
    }
  }, [strength])

  return (
    <div className="space-y-1">
      <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
        <div className={`h-full rounded ${color}`} style={{ width: `${(strength / 4) * 100}%` }} />
      </div>
      <p className="text-sm text-gray-500">密碼強度：{text}</p>
    </div>
  )
})

PasswordStrengthBar.displayName = "PasswordStrengthBar"

// 表單初始狀態
const initialRegisterForm = {
  name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export default function LoginPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  
  // 統一管理註冊表單狀態
  const [registerForm, setRegisterForm] = useState(initialRegisterForm)
  const [formErrors, setFormErrors] = useState<Partial<typeof initialRegisterForm>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [loginError, setLoginError] = useState("")

  // 表單驗證
  const validateForm = useCallback(() => {
    const errors: Partial<typeof initialRegisterForm> = {}
    
    if (!registerForm.name || registerForm.name.length > 8) {
      errors.name = "名字不可為空且不可超過8個字"
    }
    
    if (!/^09\d{8}$/.test(registerForm.phone)) {
      errors.phone = "請輸入正確的台灣手機號碼"
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = "密碼不一致"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [registerForm])

  // 處理表單輸入
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterForm(prev => ({ ...prev, [name]: value }))
    // 清除對應欄位的錯誤
    setFormErrors(prev => ({ ...prev, [name]: "" }))
  }, [])

  // 登入處理
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await login(email, password)
    console.log("login result", result)
    setIsLoading(false)

    if (result.success && result.role === "store_owner") {
      router.push("/admin/dashboard")
    } else if (result.success) {
      router.push("/")
    } else {
      setLoginError("登入失敗：帳號或密碼錯誤，請重新輸入。")
    }
  }, [login, router, toast])

  // 註冊處理
  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    const success = await register(registerForm.name, registerForm.email, registerForm.password, registerForm.phone)
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
  }, [register, registerForm, router, toast, validateForm])

  // 計算註冊按鈕是否應該禁用
  const isRegisterDisabled = useMemo(() => {
    return isLoading || !registerForm.password || registerForm.password.length < 8
  }, [isLoading, registerForm.password])

  return (
    <div className="min-h-screen flex items-center justify-center bg-coffee-light">
      <div className="bg-gradient-to-br from-coffee-light to-coffee p-10 w-full max-w-md rounded-2xl shadow-2xl hover:shadow-coffee-dark/40 transition-shadow duration-300 group relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 70%)'}} />
        {showRegister ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl font-bold text-coffee mb-2">註冊新帳戶</h2>
              <p className="text-gray-500 mb-4">請填寫以下資訊以建立帳戶</p>
            </div>
            <div>
              <Label htmlFor="register-name" className="text-coffee font-semibold">名字</Label>
              <Input
                id="register-name"
                name="name"
                value={registerForm.name}
                onChange={handleInputChange}
                maxLength={8}
                required
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? "name-error" : undefined}
                placeholder="請輸入名字（最多8字）"
                className="rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-coffee text-gray-900 mt-2"
              />
              {formErrors.name && (
                <p id="name-error" className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="register-phone" className="text-coffee font-semibold">手機</Label>
              <Input
                id="register-phone"
                name="phone"
                value={registerForm.phone}
                onChange={handleInputChange}
                pattern="^09\d{8}$"
                maxLength={10}
                required
                aria-invalid={!!formErrors.phone}
                aria-describedby={formErrors.phone ? "phone-error" : undefined}
                placeholder="範例：09-XX-XXX-XXX"
                className="rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-coffee text-gray-900 mt-2"
              />
              {formErrors.phone && (
                <p id="phone-error" className="text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="register-email" className="text-coffee font-semibold">電子郵件</Label>
              <Input
                id="register-email"
                name="email"
                type="email"
                value={registerForm.email}
                onChange={handleInputChange}
                required
                placeholder="請輸入電子郵件"
                className="rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-coffee text-gray-900 mt-2"
              />
            </div>
            <div>
              <Label htmlFor="register-password" className="text-coffee font-semibold">密碼</Label>
              <Input
                id="register-password"
                name="password"
                type="password"
                value={registerForm.password}
                onChange={handleInputChange}
                required
                minLength={8}
                placeholder="請輸入密碼"
                className="rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-coffee text-gray-900 mt-2"
              />
              <PasswordStrengthBar password={registerForm.password} />
              <p className="text-xs text-gray-500 mt-1">建議密碼包含大小寫英文字母、數字及特殊符號（如 !@#$%）</p>
            </div>
            <div>
              <Label htmlFor="register-confirm-password" className="text-coffee font-semibold">確認密碼</Label>
              <Input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                value={registerForm.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="請再次輸入密碼"
                aria-invalid={!!formErrors.confirmPassword}
                aria-describedby={formErrors.confirmPassword ? "confirm-password-error" : undefined}
                className="rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-coffee text-gray-900 mt-2"
              />
              {formErrors.confirmPassword && (
                <p id="confirm-password-error" className="text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
              {/* 即時提示密碼不符 */}
              {registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && (
                <p className="text-sm text-red-500">密碼與確認密碼不相符</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-coffee to-coffee-dark text-white rounded-xl shadow-lg text-lg py-3 mt-4 hover:brightness-110 transition-all active:scale-95 focus:ring-2 focus:ring-coffee/50"
              disabled={isRegisterDisabled}
              aria-busy={isLoading}
            >
              {isLoading ? "註冊中..." : "註冊"}
            </Button>
            <div className="text-center text-sm text-gray-600 mt-6">
              已經有帳戶了嗎？
              <button
                type="button"
                className="ml-1 text-coffee font-semibold hover:underline focus:outline-none"
                onClick={() => setShowRegister(false)}
              >
                登入
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-3xl font-bold text-coffee mb-2">歡迎回來</h2>
              <p className="text-gray-500 mb-4">請登入你的帳戶</p>
            </div>
            <div>
              <Label htmlFor="login-email" className="text-coffee font-semibold">電子郵件或手機</Label>
              <Input 
                id="login-email" 
                name="email" 
                type="email" 
                required 
                aria-label="登入電子郵件"
                placeholder="請輸入電子郵件或手機"
                className="rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-coffee text-gray-900 mt-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="login-password" className="text-coffee font-semibold">密碼</Label>
                <Link href="/forgot-password" className="text-sm text-coffee hover:underline">忘記密碼？</Link>
              </div>
              <div className="relative">
                <Input 
                  id="login-password" 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  required 
                  aria-label="登入密碼"
                  placeholder="請輸入密碼"
                  className="rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-coffee text-gray-900 pr-20"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-coffee text-sm font-medium transition-colors duration-150 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-coffee/50"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {loginError && (
              <p className="text-sm text-red-500 text-center mt-2">{loginError}</p>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-coffee to-coffee-dark text-white rounded-xl shadow-lg text-lg py-3 mt-4 hover:brightness-110 transition-all active:scale-95 focus:ring-2 focus:ring-coffee/50"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? "登入中..." : "登入"}
            </Button>
            <div className="text-center text-sm text-gray-600 mt-6">
              還沒有帳戶嗎？
              <button
                type="button"
                className="ml-1 text-coffee font-semibold hover:underline focus:outline-none"
                onClick={() => setShowRegister(true)}
              >
                註冊
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
