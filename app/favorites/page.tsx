"use client"

import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useWishlist } from "@/lib/context/wishlist-context"
import { useCart } from "@/lib/context/cart-context"
import { featuredProducts } from "@/lib/data"
import { formatPrice } from "@/lib/utils"

export default function FavoritesPage() {
  const { items: wishlistItems, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const wishlistProducts = featuredProducts.filter((product) => wishlistItems.includes(product.id))

  return (
    <div className="container py-8">
      <Link href="/" className="flex items-center text-sm mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-2" />
        返回首頁
      </Link>

      <h1 className="text-3xl font-bold mb-8">我的收藏</h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">您的收藏清單是空的</h2>
          <p className="text-muted-foreground mb-6">瀏覽商品並將您喜歡的商品加入收藏</p>
          <Button asChild>
            <Link href="/">瀏覽商品</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <Link href={`/product/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image || `/placeholder.svg?height=300&width=300&text=${product.name}`}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-red-500"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeFromWishlist(product.id)
                      toast({
                        title: "已從收藏移除",
                        description: `${product.name} 已從收藏清單中移除`,
                      })
                    }}
                  >
                    <Heart className="h-5 w-5 fill-red-500" />
                    <span className="sr-only">從收藏移除</span>
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
                  <h3 className="font-medium line-clamp-1">{product.name}</h3>
                  <div className="mt-2 flex justify-between items-center">
                    <div className="font-semibold">{formatPrice(product.price)}</div>
                    {product.originalPrice && (
                      <div className="text-sm line-through text-muted-foreground">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Link>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => {
                    addItem(product)
                    toast({
                      title: "已加入購物車",
                      description: `${product.name} 已成功加入購物車`,
                    })
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  加入購物車
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
