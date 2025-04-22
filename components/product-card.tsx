"use client"

import type React from "react"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/context/cart-context"
import { useWishlist } from "@/lib/context/wishlist-context"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  showAddToCart?: boolean
}

export default function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { toast } = useToast()
  const isFavorite = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast({
      title: "已加入購物車",
      description: `${product.name} 已成功加入購物車`,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    toast({
      title: isFavorite ? "已從收藏移除" : "已加入收藏",
      description: isFavorite ? `${product.name} 已從收藏清單中移除` : `${product.name} 已加入收藏清單`,
    })
  }

  return (
    <Card className="overflow-hidden group border-none shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image || `/placeholder.svg?height=300&width=300&text=${product.name}`}
            alt={product.name}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          {product.isNew && <Badge className="absolute top-2 left-2 bg-red-500">新品</Badge>}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">加入收藏</span>
          </Button>
        </div>
        <CardContent className="p-3">
          <div className="text-sm text-muted-foreground mb-1">nadu. | 現貨</div>
          <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
          <div className="mt-2 flex items-center">
            <div className="text-red-500 font-semibold">${product.price}</div>
            {product.originalPrice && (
              <div className="text-xs line-through text-muted-foreground ml-2">${product.originalPrice}</div>
            )}
            {product.originalPrice && (
              <div className="text-xs text-red-500 ml-2">
                {Math.round((1 - product.price / product.originalPrice) * 100)}折
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      {showAddToCart && (
        <CardFooter className="p-3 pt-0">
          <Button className="w-full" size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            加入購物車
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
