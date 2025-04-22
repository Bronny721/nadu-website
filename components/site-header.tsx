"use client"

import Link from "next/link"
import { Heart, User, Menu, ShoppingBag, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartDropdown } from "@/components/cart-dropdown"
import { useAuth } from "@/lib/context/auth-context"
import { useWishlist } from "@/lib/context/wishlist-context"
import { categories } from "@/lib/data"
import { SearchInput } from "@/components/search-input"
import { LineQRDialog } from "@/components/line-qr-dialog"

export function SiteHeader() {
  const { user } = useAuth()
  const { items: wishlistItems } = useWishlist()

  return (
    <header className="border-b border-coffee/10 bg-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-coffee">
                <Menu className="h-5 w-5" />
                <span className="sr-only">導航選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-coffee-light">
              <div className="flex justify-center mb-6">
                <img src="/images/nadu-logo.png" alt="nadu." className="h-24 w-24" />
              </div>
              <nav className="grid gap-4 py-4">
                <Link href="/" className="text-lg font-semibold text-coffee">
                  首頁
                </Link>
                {categories.map((category) => (
                  <Link key={category.id} href={`/category/${category.slug}`} className="text-lg text-coffee-light hover:text-coffee transition-colors">
                    {category.name}
                  </Link>
                ))}
                <Link href="/favorites" className="text-lg text-coffee-light hover:text-coffee transition-colors">
                  我的收藏
                </Link>
                {user ? (
                  <Link href="/account" className="text-lg text-coffee-light hover:text-coffee transition-colors">
                    我的帳戶
                  </Link>
                ) : (
                  <Link href="/login" className="text-lg text-coffee-light hover:text-coffee transition-colors">
                    登入 / 註冊
                  </Link>
                )}
                <div className="pt-4 border-t border-coffee/20 mt-4">
                  <div className="grid gap-2">
                    <Link
                      href="https://shopee.tw/nadu.tw#product_list"
                      target="_blank"
                      className="flex items-center text-lg text-coffee-light hover:text-coffee transition-colors"
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      蝦皮 Shopee
                    </Link>
                    <Link
                      href="https://www.instagram.com/nadu.tw"
                      target="_blank"
                      className="flex items-center text-lg text-coffee-light hover:text-coffee transition-colors"
                    >
                      <Instagram className="h-5 w-5 mr-2" />
                      Instagram
                    </Link>
                    <div className="flex items-center text-lg text-coffee-light hover:text-coffee transition-colors">
                      <LineQRDialog
                        title="官方 LINE"
                        description="掃描QR碼添加我們的官方LINE"
                        imageSrc="/images/line-qr.png"
                        lineUrl="https://line.me/ti/p/@nadu.tw"
                      />
                    </div>
                    <div className="flex items-center text-lg text-coffee-light hover:text-coffee transition-colors">
                      <LineQRDialog
                        title="LINE社群/密碼6666"
                        description="掃描QR碼加入我們的LINE社群"
                        imageSrc="/images/line-社群-qr.png"
                        password="6666"
                        lineUrl="https://line.me/ti/g2/社群ID"
                      />
                    </div>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center">
            <img src="/images/nadu-logo.png" alt="nadu." className="h-12 w-12 mr-2 hidden md:block" />
            <span className="text-2xl font-bold text-coffee">nadu.</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center w-full max-w-sm mx-4">
          <SearchInput />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="relative text-coffee hover:text-coffee-light hover:bg-coffee-light">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-coffee text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
              <span className="sr-only">收藏</span>
            </Button>
          </Link>
          <CartDropdown />
          <Link href={user ? "/account" : "/login"}>
            <Button variant="ghost" size="icon" className="text-coffee hover:text-coffee-light hover:bg-coffee-light">
              <User className="h-5 w-5" />
              <span className="sr-only">{user ? "帳戶" : "登入"}</span>
            </Button>
          </Link>
        </div>
      </div>
      <nav className="container py-2 hidden lg:block border-t border-coffee/10">
        <ul className="flex gap-6 justify-center">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/category/${category.slug}`} className="text-sm text-coffee-light hover:text-coffee transition-colors">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
