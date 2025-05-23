"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/context/cart-context"
import { useWishlist } from "@/lib/context/wishlist-context"
import ProductCard from "@/components/product-card"
import { 滿額贈品橫幅 } from "@/components/滿額贈品-橫幅"
import { SiteHeader } from "@/components/site-header"
import { ReviewForm } from "@/components/review-form"
import React from "react"
import Image from "next/image"
import { Carousel } from "@/components/ui/carousel"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

interface Review {
  name: string
  rating: number
  comment: string
  date: string
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = React.use(params as Promise<{ slug: string }>)
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState<Review[]>([])
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    // 取得單一商品資料
    fetch(`/api/admin/products/${slug}`)
      .then(res => {
        if (!res.ok) {
          // 404 或其他錯誤
          setProduct(null)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (data) setProduct(data)
      })
    // 取得相關商品
    fetch(`/api/admin/products?relatedTo=${slug}`)
      .then(res => res.json())
      .then(setRelatedProducts)
  }, [slug])

  // 計算平均評分和評論數量
  const reviewStats = useMemo(() => {
    if (reviews.length === 0) return { avgRating: 0, count: 0 };
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      avgRating: parseFloat((sum / reviews.length).toFixed(1)),
      count: reviews.length
    };
  }, [reviews]);

  if (!product) {
    return <div className="container py-12 text-center">商品不存在</div>
  }

  const isFavorite = isInWishlist(product.id)
  const productImages = product.images || [product.image || ""]

  const handleAddToCart = () => {
    addItem(product, quantity)
    toast({
      title: "已加入購物車",
      description: `${quantity} 件 ${product.name.substring(0, 20)}${product.name.length > 20 ? '...' : ''} 已成功加入購物車`,
      action: (
        <Button variant="outline" size="sm" onClick={() => window.location.href = "/cart"} className="mt-2">
          查看購物車
        </Button>
      ),
    })
  }

  const handleToggleFavorite = () => {
    toggleWishlist(product.id)
    toast({
      title: isFavorite ? "已從收藏移除" : "已加入收藏",
      description: isFavorite ? `${product.name} 已從收藏清單中移除` : `${product.name} 已加入收藏清單`,
    })
  }

  const handleReviewSubmit = (newReview: Review) => {
    setReviews([newReview, ...reviews])
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="container py-8">
        <Link href="/" className="flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首頁
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {product.images?.length > 0 ? (
              <Carousel>
                {product.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={product.name} />
                ))}
              </Carousel>
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                尚無圖片
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">{product.category}</div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              {/* 星級評分顯示 */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(reviewStats.avgRating) 
                          ? "text-yellow-400 fill-yellow-400" 
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {reviewStats.avgRating} ({reviewStats.count} 則評價)
                </span>
              </div>
              
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-muted-foreground line-through">${product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <span className="text-sm text-red-500">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% 折扣
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">商品描述</h3>
              <div className="text-muted-foreground whitespace-pre-line">{product.description}</div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">數量</h3>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">減少數量</span>
                </Button>
                <div className="px-4 py-2 border-y w-12 text-center">{quantity}</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">增加數量</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1 btn-coffee" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                加入購物車
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`shrink-0 ${isFavorite ? "text-red-500 border-red-500" : ""}`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
                <span className="sr-only">加入收藏</span>
              </Button>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">商品編號</span>
                <span>{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">產地</span>
                <span>{product.origin || "韓國"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">材質</span>
                <span>{product.material || "925純銀"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">配送</span>
                <span>全球配送</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">商品詳情</TabsTrigger>
            <TabsTrigger value="shipping">配送資訊</TabsTrigger>
            <TabsTrigger value="reviews">顧客評價 ({reviewStats.count})</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-4 border rounded-md mt-2">
            <div className="space-y-4">
              <h3 className="font-semibold">商品特色</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>韓國設計，925純銀材質</li>
                <li>極簡風格，日常百搭</li>
                <li>輕巧舒適，長時間配戴不負擔</li>
                <li>精緻包裝，送禮自用兩相宜</li>
              </ul>
              <h3 className="font-semibold">尺寸與規格</h3>
              <p>尺寸：內徑約1.2cm(小) / 內徑約1.4cm(大)</p>
              <p>重量：約 5g</p>
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="p-4 border rounded-md mt-2">
            <div className="space-y-4">
              <h3 className="font-semibold">配送政策</h3>
              <p>我們提供全球配送服務。配送時間取決於您的位置：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>本地配送：3-5 個工作日</li>
                <li>國際配送：7-14 個工作日</li>
              </ul>
              <h3 className="font-semibold">退換貨政策</h3>
              <p>如果您對商品不滿意，可以在收到商品後 14 天內申請退換貨。 請注意，商品必須保持原始狀態且包裝完整。</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4 border rounded-md mt-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">顧客評價</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(reviewStats.avgRating) 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm">
                      平均 {reviewStats.avgRating} / 5 ({reviewStats.count} 則評價)
                    </span>
                  </div>
                </div>
                <ReviewForm 
                  productId={product.id} 
                  productName={product.name}
                  onReviewSubmit={handleReviewSubmit}
                />
              </div>
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{review.name}</div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill={i < review.rating ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 py-4">
            <h2 className="text-xl font-medium mb-4">你可能也會喜歡這些商品</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct: any) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} showAddToCart={true} />
              ))}
            </div>
          </div>
        )}
        
        {/* 社群連結 */}
        <section className="py-12 mt-12 bg-coffee-light rounded-lg">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://www.instagram.com/nadu.tw" className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow" target="_blank">
                <svg className="text-[#E1306C]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/>
                </svg>
                <span>Instagram</span>
              </Link>
              <Link href="https://line.me/R/ti/p/@960wotkp?ts=08282016&oat_content=url" className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow" target="_blank">
                <svg className="text-[#06C755]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.365 9.89c.50 0 .906.41.906.91s-.406.91-.906.91H17.87v1.55h1.494c.5 0 .906.41.906.91s-.406.91-.906.91H16.97a.91.91 0 01-.906-.91V9.89c0-.5.407-.91.906-.91h2.395zm-4.443 0c.5 0 .905.41.905.91v3.37c0 .5-.405.91-.905.91s-.905-.41-.905-.91v-3.37c0-.5.405-.91.905-.91zm-3.298 0c.5 0 .905.41.905.91v1.86l1.494-2.353c.12-.223.35-.365.602-.398.253-.033.503.052.682.232.18.18.264.43.23.682-.031.252-.173.483-.396.603l-1.156 1.055 1.442 1.788c.138.215.177.48.109.728-.069.247-.238.454-.468.57-.23.115-.5.135-.745.054-.245-.08-.44-.267-.536-.513l-1.258-2.072v1.305c0 .5-.406.91-.906.91s-.905-.41-.905-.91V9.89c0-.5.405-.91.905-.91h.001zm-3.113.288a.91.91 0 00-.79.455l-1.8 3.143a.905.905 0 001.579.898l.333-.58h1.355l.334.58a.91.91 0 001.186.344.91.91 0 00.392-.553.91.91 0 00-.79-1.35l-1.8-3.143a.908.908 0 00-.79-.455.908.908 0 00-.791.454l.79.455-.789-.455.001.001zm.012 2.57l.394-.683.394.683h-.788zM24 10.63C24 4.765 18.614.002 12 .002S0 4.765 0 10.63c0 5.261 4.667 9.671 10.975 10.505.429.092 1.01.285 1.158.651.132.33.087.84.043 1.173l-.187 1.117c-.057.335-.268 1.31 1.15.715 1.417-.596 7.646-4.508 10.429-7.725h.002C23.565 17.067 24 13.985 24 10.63z" fill="currentColor"/>
                </svg>
                <span>LINE官方帳號</span>
              </Link>
              <Link href="https://shopee.tw/nadu.tw" className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow" target="_blank">
                <svg className="text-[#EE4D2D]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0C8.741 0 6.087 2.654 6.087 5.913c0 .261.213.474.474.474h10.878c.261 0 .474-.213.474-.474C17.913 2.654 15.259 0 12 0zm.113 1.425a4.318 4.318 0 014.252 3.51H7.847a4.318 4.318 0 014.266-3.51zM4.191 7.365C1.88 7.365 0 9.245 0 11.557v7.061c0 2.311 1.88 4.191 4.191 4.191h15.618c2.311 0 4.191-1.88 4.191-4.191v-7.061c0-2.311-1.88-4.191-4.191-4.191H4.191zm.474 1.422h14.67c1.527 0 2.77 1.242 2.77 2.77v7.061c0 1.527-1.242 2.77-2.77 2.77H4.665a2.774 2.774 0 01-2.77-2.77v-7.061c0-1.527 1.242-2.77 2.77-2.77zm3.309 2.196c-1.574 0-2.87 1.296-2.87 2.87s1.296 2.87 2.87 2.87c1.574 0 2.87-1.296 2.87-2.87s-1.296-2.87-2.87-2.87zm7.826 0c-1.574 0-2.87 1.296-2.87 2.87s1.296 2.87 2.87 2.87 2.87-1.296 2.87-2.87-1.296-2.87-2.87-2.87zm-7.826 1.422c.806 0 1.448.642 1.448 1.448 0 .806-.642 1.448-1.448 1.448a1.426 1.426 0 01-1.448-1.448c0-.806.642-1.448 1.448-1.448zm7.826 0c.806 0 1.448.642 1.448 1.448 0 .806-.642 1.448-1.448 1.448a1.426 1.426 0 01-1.448-1.448c0-.806.642-1.448 1.448-1.448z" fill="currentColor"/>
                </svg>
                <span>蝦皮商城</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 滿額贈品橫幅 - 移到底部 */}
      <滿額贈品橫幅 />

      <footer className="border-t py-8 bg-white">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} nadu. 保留所有權利.</p>
        </div>
      </footer>
    </div>
  )
}
