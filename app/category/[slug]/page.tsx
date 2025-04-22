"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import ProductCard from "@/components/product-card"
import { categories, featuredProducts } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Product } from "@/lib/types"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<any>(null)
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    // 查找當前分類
    const currentCategory = categories.find((cat) => cat.slug === params.slug)
    setCategory(currentCategory)

    // 從featuredProducts中過濾出該分類的商品
    if (currentCategory) {
      // 獲取指定分類的產品
      const filteredProducts = featuredProducts.filter(
        (product) => product.category === currentCategory.name
      )

      // 根據排序選項排序產品
      let sortedProducts = [...filteredProducts]
      
      if (sortBy === "price-asc") {
        sortedProducts.sort((a, b) => a.price - b.price)
      } else if (sortBy === "price-desc") {
        sortedProducts.sort((a, b) => b.price - a.price)
      } else {
        // 默認按最新排序 (id倒序)
        sortedProducts.sort((a, b) => b.id.localeCompare(a.id))
      }
      
      setCategoryProducts(sortedProducts)
    } else {
      setCategoryProducts([])
    }
  }, [params.slug, sortBy])

  if (!category) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">分類不存在</h1>
          <p className="mb-8">找不到您請求的分類</p>
          <Button asChild>
            <Link href="/">返回首頁</Link>
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 container py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首頁
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">排序：</span>
            <select
              className="text-sm border rounded-md px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">最新</option>
              <option value="price-asc">價格低至高</option>
              <option value="price-desc">價格高至低</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <Separator className="my-4" />
        </div>

        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">暫無商品</h2>
            <p className="text-muted-foreground mb-6">此分類暫時沒有商品，請稍後再查看</p>
            <Button asChild>
              <Link href="/">返回首頁</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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

      <footer className="border-t py-8 bg-muted">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} nadu. 保留所有權利.</p>
        </div>
      </footer>
    </div>
  )
}
