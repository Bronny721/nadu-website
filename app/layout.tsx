import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/context/cart-context"
import { AuthProvider } from "@/lib/context/auth-context"
import { WishlistProvider } from "@/lib/context/wishlist-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "nadu. | 精選代購平台",
  description: "精選韓國、日本時尚飾品代購，為您的穿搭增添獨特魅力",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <Toaster />
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
