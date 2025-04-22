"use client"

import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()
  const shipping = 150
  const total = totalPrice + shipping

  return (
    <div className="container py-8">
      <Link href="/" className="flex items-center text-sm mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        繼續購物
      </Link>

      <h1 className="text-3xl font-bold mb-8">購物車</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">您的購物車是空的</h2>
          <p className="text-muted-foreground mb-6">看起來您還沒有添加任何商品到購物車</p>
          <Button asChild>
            <Link href="/">瀏覽商品</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-3 font-medium grid grid-cols-12">
                <div className="col-span-6">商品</div>
                <div className="col-span-2 text-center">單價</div>
                <div className="col-span-2 text-center">數量</div>
                <div className="col-span-2 text-center">小計</div>
              </div>
              <div className="divide-y">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="p-4 grid grid-cols-12 items-center">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded overflow-hidden shrink-0">
                        <img
                          src={item.image || `/placeholder.svg?height=100&width=100&text=${item.name}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/product/${item.slug}`} className="font-medium line-clamp-1 hover:underline">
                          {item.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">{item.variant}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          移除
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">{formatPrice(item.price)}</div>
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">減少數量</span>
                        </Button>
                        <div className="px-3 py-1 border-y w-10 text-center">{item.quantity}</div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">增加數量</span>
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-2 text-center font-medium">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 space-y-4 sticky top-4">
              <h2 className="font-semibold text-lg mb-4">訂單摘要</h2>

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

              <div className="pt-4">
                <div className="flex gap-2 mb-4">
                  <Input placeholder="優惠碼" />
                  <Button variant="outline">套用</Button>
                </div>

                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">前往結帳</Link>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground pt-4">
                <p>我們接受以下付款方式：</p>
                <div className="flex gap-2 mt-2">
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">Visa</div>
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">MC</div>
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">JCB</div>
                  <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">PayPal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
