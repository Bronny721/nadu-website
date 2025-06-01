"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import { formatPrice } from "@/lib/utils"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const shipping = 150
  const total = totalPrice + shipping

  // 用戶未登入時重定向到註冊頁面
  useEffect(() => {
    if (!user) {
      toast({
        title: "需要登入",
        description: "請先登入或註冊帳戶才能進行結帳",
      })
      router.push('/login?redirect=/checkout')
    }
  }, [user, router, toast])

  // 如果用戶未登入，顯示加載狀態
  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p>正在檢查登入狀態...</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">您的購物車是空的</h2>
          <p className="text-muted-foreground mb-6">請先添加商品到購物車</p>
          <Button asChild>
            <Link href="/">瀏覽商品</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 獲取表單數據
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const shippingInfo: Record<string, any> = {};
    formData.forEach((value, key) => {
        shippingInfo[key] = value;
    });

    // 構建訂單數據
    const orderData = {
        items: items.map(item => ({ // 確保發送的數據符合後端 API 預期的格式
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            variant: item.variant,
            slug: item.slug, // 確保包含 slug
        })),
        total: total,
        shippingInfo: shippingInfo,
    };

    // 從 Local Storage 獲取 Token
    const token = localStorage.getItem('token');

    if (!token) {
        toast({
            title: "認證錯誤",
            description: "無法獲取使用者認證信息，請重新登入",
            variant: "destructive"
        });
        setIsSubmitting(false);
        return;
    }

    try {
      // 呼叫後端 API 創建訂單
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 在 Header 中帶上 Token
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('訂單創建成功:', result);

        // 清空購物車
        clearCart();

        // 顯示成功訊息
        toast({
          title: "訂單已提交",
          description: "您的訂單已成功提交，感謝您的購買！",
        });

        // 重定向到確認頁面
        router.push('/checkout/confirmation');

      } else {
        // 處理 API 錯誤
        const errorData = await response.json();
        console.error('訂單創建失敗:', response.status, errorData);
        toast({
          title: "訂單提交失敗",
          description: errorData.error || '發生未知錯誤，請稍後再試。',
          variant: "destructive"
        });
      }

    } catch (error) {
      // 處理網路或其他錯誤
      console.error('呼叫訂單 API 時發生錯誤:', error);
      toast({
        title: "發生錯誤",
        description: '無法提交訂單，請檢查您的網絡或稍後再試。',
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-8">
      <Link href="/cart" className="flex items-center text-sm mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回購物車
      </Link>

      <h1 className="text-3xl font-bold mb-8">結帳</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* 配送資訊 */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">配送資訊</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">名字</Label>
                    <Input id="firstName" name="firstName" defaultValue={user?.name?.split(" ")[0] || ""} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">姓氏</Label>
                    <Input id="lastName" name="lastName" defaultValue={user?.name?.split(" ")[1] || ""} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">電子郵件</Label>
                    <Input id="email" name="email" type="email" defaultValue={user?.email || ""} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">電話號碼</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">地址</Label>
                    <Input id="address" name="address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">城市</Label>
                    <Input id="city" name="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">郵遞區號</Label>
                    <Input id="postalCode" name="postalCode" required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="country">國家/地區</Label>
                    <Input id="country" name="country" defaultValue="台灣" required />
                  </div>
                </div>
              </div>

              {/* 付款方式 */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">付款方式</h2>
                <Tabs defaultValue="credit-card">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="credit-card">信用卡</TabsTrigger>
                    <TabsTrigger value="bank-transfer">銀行轉帳</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  </TabsList>
                  <TabsContent value="credit-card" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">卡號</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">到期日</Label>
                        <Input id="expiryDate" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">安全碼 (CVV)</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameOnCard">持卡人姓名</Label>
                      <Input id="nameOnCard" required />
                    </div>
                  </TabsContent>
                  <TabsContent value="bank-transfer" className="space-y-4 mt-4">
                    <p>請使用以下銀行帳戶資訊進行轉帳：</p>
                    <div className="bg-muted p-4 rounded-md">
                      <p>銀行名稱：範例銀行</p>
                      <p>帳戶名稱：手工藝品代購平台</p>
                      <p>帳號：1234-5678-9012-3456</p>
                      <p>銀行代碼：012</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      請在轉帳備註中填寫您的訂單編號。我們將在確認付款後處理您的訂單。
                    </p>
                  </TabsContent>
                  <TabsContent value="paypal" className="space-y-4 mt-4">
                    <p>點擊下方按鈕，您將被重定向到 PayPal 網站完成付款。</p>
                    <Button type="button" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      使用 PayPal 付款
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>

              {/* 配送方式 */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">配送方式</h2>
                <RadioGroup defaultValue="standard" className="space-y-3">
                  <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="font-normal cursor-pointer">
                        標準配送 (3-5 個工作日)
                      </Label>
                    </div>
                    <div className="font-medium">{formatPrice(shipping)}</div>
                  </div>
                  <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-normal cursor-pointer">
                        快速配送 (1-2 個工作日)
                      </Label>
                    </div>
                    <div className="font-medium">{formatPrice(300)}</div>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full btn-coffee" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "處理中..." : `確認付款 ${formatPrice(total)}`}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-4">
            <h2 className="font-semibold text-lg mb-4">訂單摘要</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.id}-${item.variant}`} className="flex gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                    <img
                      src={item.image || `/placeholder.svg?height=80&width=80&text=${item.name}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium line-clamp-1">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.variant}</div>
                    <div className="text-sm">
                      {item.quantity} x {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="text-right">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="text-muted-foreground">小計</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">運費</span>
              <span>{formatPrice(shipping)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">折扣</span>
              <span>{formatPrice(0)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-semibold">
              <span>總計</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
