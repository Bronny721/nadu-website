"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/context/cart-context"
import { formatPrice } from "@/lib/utils"

export function CartDropdown() {
  const { items, itemCount, totalPrice, removeItem, updateQuantity } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-coffee hover:text-coffee-light hover:bg-coffee-light">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 bg-coffee text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="sr-only">購物車</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-coffee-light">
        <SheetHeader className="border-b border-coffee/10 pb-4">
          <SheetTitle className="text-coffee">購物車 ({itemCount})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-10">
            <ShoppingBag className="h-12 w-12 text-coffee-light mb-4" />
            <p className="text-coffee-light">您的購物車是空的</p>
            <Button variant="outline" className="mt-4 border-coffee text-coffee" onClick={() => setOpen(false)} asChild>
              <Link href="/search">繼續購物</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={`${item.id}-${item.variant}`} className="flex gap-4 p-2 bg-white rounded-md">
                    <div className="w-20 h-20 rounded-md overflow-hidden shrink-0 border border-coffee/10">
                      <img
                        src={item.image || `/placeholder.svg?height=80&width=80&text=${item.name}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-medium hover:underline line-clamp-1 text-coffee"
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <div className="text-sm text-coffee-light">{item.variant}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-coffee/20 text-coffee hover:bg-coffee-light/70"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm text-coffee">{item.quantity}</span>
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-coffee/20 text-coffee hover:bg-coffee-light/70"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-coffee">{formatPrice(item.price * item.quantity)}</div>
                      <button
                        className="text-sm text-red-500 hover:text-red-700 mt-auto"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-coffee/10">
              <div className="flex justify-between mb-2">
                <span className="text-coffee-light">小計</span>
                <span className="text-coffee">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-coffee-light">運費</span>
                <span className="text-coffee">{formatPrice(150)}</span>
              </div>
              <Separator className="bg-coffee/10" />
              <div className="flex justify-between my-4 font-medium">
                <span className="text-coffee">總計</span>
                <span className="text-coffee">{formatPrice(totalPrice + 150)}</span>
              </div>
              <div className="grid gap-2">
                <Button className="btn-coffee" asChild onClick={() => setOpen(false)}>
                  <Link href="/cart">查看購物車</Link>
                </Button>
                <Button variant="outline" className="border-coffee text-coffee hover:bg-coffee-light/50" asChild onClick={() => setOpen(false)}>
                  <Link href="/checkout">前往結帳</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
