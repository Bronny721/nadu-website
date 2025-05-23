"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/context/cart-context"
import { useWishlist } from "@/lib/context/wishlist-context"

interface Product {
  id: string
  slug: string
  name: string
  price: number
  originalPrice?: number
  image?: string
  isNew?: boolean
  description: string
  category: string
}

interface ProductCardProps {
  product: Product
  showAddToCart?: boolean
}

export default function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  const { addItem } = useCart?.() || { addItem: () => {} }
  const { isInWishlist, toggleWishlist } = useWishlist?.() || { isInWishlist: () => false, toggleWishlist: () => {} }
  const { toast } = useToast?.() || { toast: () => {} }
  const isFavorite = isInWishlist?.(product.id) ?? false

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem?.(product)
    toast?.({
      title: "已加入購物車",
      description: `${product.name} 已成功加入購物車`,
    })
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist?.(product.id)
    toast?.({
      title: isFavorite ? "已從收藏移除" : "已加入收藏",
      description: isFavorite ? `${product.name} 已從收藏清單中移除` : `${product.name} 已加入收藏清單`,
    })
  }

  return (
    <Link href={`/product/${product.slug || product.id}`} className="group block">
      <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl h-full">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || `/placeholder.svg?height=300&width=300&text=${product.name}`}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full text-[#BFA18A] hover:text-[#6B4F36] transition-colors"
            onClick={handleToggleFavorite}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            <span className="sr-only">加入收藏</span>
          </Button>
          {product.isNew && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-[#BFA18A] hover:bg-[#BFA18A] text-white">新品</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-[#6B4F36] mb-1 truncate group-hover:text-[#BFA18A] transition-colors">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center">
            <p className="text-[#BFA18A] font-bold">NT$ {product.price}</p>
            {product.originalPrice && (
              <span className="text-xs line-through text-muted-foreground ml-2">NT$ {product.originalPrice}</span>
            )}
            {product.originalPrice && (
              <span className="text-xs text-red-500 ml-2">
                {Math.round((1 - product.price / product.originalPrice) * 100)}折
              </span>
            )}
          </div>
        </CardContent>
        {showAddToCart && (
          <CardFooter className="p-3 pt-0">
            <Button className="w-full" size="sm" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              加入購物車
            </Button>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}