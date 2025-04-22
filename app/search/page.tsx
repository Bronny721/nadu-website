"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { categories } from "@/lib/data"
import ProductCard from "@/components/product-card"
import { SiteHeader } from "@/components/site-header"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000])
  const [sortBy, setSortBy] = useState("newest")

  // 模擬搜索功能 - 現在返回空數組，等待實際商品數據
  useEffect(() => {
    // 暫時返回空數組，等待實際商品數據
    setSearchResults([])
  }, [query, selectedCategories, priceRange, sortBy])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max])
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 3000])
    setSortBy("newest")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 container py-8">
        <Link href="/" className="flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回首頁
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{query ? `搜尋結果：${query}` : "所有商品"}</h1>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  篩選
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>篩選條件</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">商品分類</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-category-${category.id}`}
                              checked={selectedCategories.includes(category.name)}
                              onCheckedChange={() => handleCategoryChange(category.name)}
                            />
                            <Label htmlFor={`mobile-category-${category.id}`}>{category.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">價格範圍</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="mobile-min-price">最低價格</Label>
                          <Input
                            id="mobile-min-price"
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                          />
                        </div>
                        <div>
                          <Label htmlFor="mobile-max-price">最高價格</Label>
                          <Input
                            id="mobile-max-price"
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">排序方式</h3>
                      <div className="space-y-2">
                        {[
                          { value: "price-asc", label: "價格：低到高" },
                          { value: "price-desc", label: "價格：高到低" },
                          { value: "newest", label: "最新商品" },
                        ].map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`mobile-sort-${option.value}`}
                              name="mobile-sort"
                              value={option.value}
                              checked={sortBy === option.value}
                              onChange={() => handleSortChange(option.value)}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`mobile-sort-${option.value}`}>{option.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                      清除所有篩選條件
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <select
              className="border rounded-md px-2 py-1 text-sm"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">最新商品</option>
              <option value="price-asc">價格：低到高</option>
              <option value="price-desc">價格：高到低</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-4">商品分類</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() => handleCategoryChange(category.name)}
                      />
                      <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium text-lg mb-4">價格範圍</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="min-price">最低價格</Label>
                    <Input
                      id="min-price"
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-price">最高價格</Label>
                    <Input
                      id="max-price"
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <Button onClick={clearFilters} variant="outline" className="w-full">
                清除所有篩選條件
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-2">暫無商品</h2>
                <p className="text-muted-foreground mb-6">我們正在更新商品，請稍後再查看</p>
                <Button asChild>
                  <Link href="/">返回首頁</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-muted">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} nadu. 保留所有權利.</p>
        </div>
      </footer>
    </div>
  )
}
