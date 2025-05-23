"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "設定已儲存",
        description: "您的設定已成功更新",
      })
    }, 1000)
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold mb-8">設定</h1>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="mb-4 bg-gray-100 rounded-xl p-1 flex gap-2">
          <TabsTrigger value="general" className="px-4 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold transition">一般設定</TabsTrigger>
          <TabsTrigger value="shipping" className="px-4 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold transition">運送設定</TabsTrigger>
          <TabsTrigger value="payment" className="px-4 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold transition">付款設定</TabsTrigger>
          <TabsTrigger value="notifications" className="px-4 py-2 rounded-lg data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-semibold transition">通知設定</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">商店資訊</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="font-semibold">商店名稱</Label>
                  <Input id="storeName" defaultValue="nadu." className="focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail" className="font-semibold">商店電子郵件</Label>
                  <Input id="storeEmail" type="email" defaultValue="contact@nadu.tw" className="focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone" className="font-semibold">商店電話</Label>
                  <Input id="storePhone" defaultValue="0912-345-678" className="focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeCurrency" className="font-semibold">貨幣</Label>
                  <Input id="storeCurrency" defaultValue="TWD" className="focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress" className="font-semibold">商店地址</Label>
                <Textarea id="storeAddress" defaultValue="台北市信義區信義路五段7號" className="focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription" className="font-semibold">商店描述</Label>
                <Textarea
                  id="storeDescription"
                  defaultValue="nadu. 成立於2022年，專注於為台灣消費者帶來韓國、日本最新流行的時尚飾品。我們精心挑選每一件商品，確保品質與設計兼具。"
                  className="focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="rounded-lg px-8 py-2 font-bold text-base bg-primary text-white hover:brightness-110 active:scale-95 transition">
                  {isSubmitting ? "儲存中..." : "儲存設定"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">運送選項</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-6">
                <div className="border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">標準配送</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="standardShippingFee" className="font-semibold">運費 (NT$)</Label>
                      <Input id="standardShippingFee" type="number" defaultValue="150" className="focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="standardShippingTime" className="font-semibold">預計配送時間 (天)</Label>
                      <Input id="standardShippingTime" type="number" defaultValue="3" className="focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">快速配送</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="expressShippingFee" className="font-semibold">運費 (NT$)</Label>
                      <Input id="expressShippingFee" type="number" defaultValue="300" className="focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expressShippingTime" className="font-semibold">預計配送時間 (天)</Label>
                      <Input id="expressShippingTime" type="number" defaultValue="1" className="focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">免運門檻</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="freeShippingThreshold" className="font-semibold">訂單金額達到 (NT$)</Label>
                      <Input id="freeShippingThreshold" type="number" defaultValue="1500" className="focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="rounded-lg px-8 py-2 font-bold text-base bg-primary text-white hover:brightness-110 active:scale-95 transition">
                  {isSubmitting ? "儲存中..." : "儲存設定"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">付款方式</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-6">
                <div className="border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">信用卡付款</div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">ATM轉帳</div>
                    <Switch defaultChecked />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="bankAccount" className="font-semibold">銀行帳號</Label>
                    <Input id="bankAccount" defaultValue="1234-5678-9012-3456" className="focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">超商付款</div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="border rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">LINE Pay</div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="rounded-lg px-8 py-2 font-bold text-base bg-primary text-white hover:brightness-110 active:scale-95 transition">
                  {isSubmitting ? "儲存中..." : "儲存設定"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6">通知設定</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="font-semibold">新訂單通知</div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="font-semibold">訂單狀態變更通知</div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="font-semibold">庫存不足通知</div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">促銷活動通知</div>
                  <Switch defaultChecked />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="rounded-lg px-8 py-2 font-bold text-base bg-primary text-white hover:brightness-110 active:scale-95 transition">
                  {isSubmitting ? "儲存中..." : "儲存設定"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
