"use client"

import Link from "next/link"
import { CheckCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConfirmationPage() {
  // 不再產生假訂單編號
  // const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">訂單已確認</h1>
        <p className="text-muted-foreground mb-6">感謝您的購買！您的訂單已成功提交，我們將盡快處理。</p>

        <div className="bg-muted p-6 rounded-lg mb-8">
          {/* <div className="text-sm text-muted-foreground mb-2">訂單編號</div>
          <div className="text-xl font-bold mb-4">{orderNumber}</div> */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>預計配送時間：3-5 個工作日</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">繼續購物</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/account/orders">查看訂單</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
