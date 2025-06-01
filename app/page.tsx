"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Search, ShoppingBag, ClipboardList, User, Instagram, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/context/cart-context"

// 輪播圖片資料
const carouselItems = [
  {
    type: "image",
    src: "/images/banner1.jpg",
    alt: "踏入質感生活",
    subtitle: "精選韓國時尚飾品，點亮你的每一天"
  },
  {
    type: "video",
    src: "/videos/banner2.mp4",
    alt: "春日新品上市",
    subtitle: "2025春季系列，搶先體驗流行新風格"
  },
  {
    type: "image",
    src: "/images/banner3.jpg",
    alt: "限時優惠85折",
    subtitle: "精選商品限時特惠，錯過不再"
  },
  {
    type: "image",
    src: "/images/banner4.jpg",
    alt: "自信由你定義",
    subtitle: "百搭飾品，展現獨特魅力"
  },
]

// Instagram 貼文資料
const instagramPosts = [
  {
    image: "https://i.meee.com.tw/Bvqk2Ea.jpg",
    url: "https://www.instagram.com/p/DJy6E2CTHVL/",
  },
  {
    image: "https://i.meee.com.tw/3x917zY.jpg",
    url: "https://www.instagram.com/p/DJfulC-zUNN/?img_index=1",
  },
  {
    image: "https://i.meee.com.tw/SIAtrZ9.jpg",
    url: "https://www.instagram.com/p/DDuLlMaz6RM/",
  },
  {
    image: "https://i.meee.com.tw/aBE55Gk.jpg",
    url: "https://www.instagram.com/p/DDj-j-LT5zJ/",
  },
  {
    image: "https://i.meee.com.tw/VzUxLTk.jpg",
    url: "https://www.instagram.com/p/DDMqcxlTian/?img_index=1",
  },
  {
    image: "https://i.meee.com.tw/3esrxnr.jpg",
    url: "https://www.instagram.com/p/DEJ2wCxTi13/",
  },
]

export default function Home() {
  const { user } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { items } = useCart()
  const cartCount = items.length
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 取得商品資料
  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
        else if (Array.isArray(data.products)) setProducts(data.products)
      })
      .catch((err) => console.error("Failed to fetch products:", err))
  }, [])

  // 輪播計時器
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
      }, 10000) // 10 秒
    }

    startTimer()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentSlide])

  // 切換到下一張輪播圖
  const nextSlide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
  }

  // 切換到上一張輪播圖
  const prevSlide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  // 切換到指定輪播圖
  const goToSlide = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setCurrentSlide(index)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF7F2]">
      {/* 頂部導航欄 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8D5C4] shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-[#BFA18A]">
                <Image src="/images/nadu-logo.jpeg" alt="nadu." fill className="object-cover" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#6B4F36]">nadu.</span>
            </Link>

            {/* 桌面版導航選項 */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/search"
                className="text-[#6B4F36] hover:text-[#BFA18A] transition-colors font-medium text-center"
              >
                所有商品<br/>
              </Link>
              <Link
                href="/category/bag"
                className="text-[#6B4F36] hover:text-[#BFA18A] transition-colors font-medium text-center"
              >
                包包<br/>
              </Link>
              <Link
                href="/category/chain bracelet"
                className="text-[#6B4F36] hover:text-[#BFA18A] transition-colors font-medium text-center"
              >
                手鍊<br/>
              </Link>
              <Link
                href="/category/ring"
                className="text-[#6B4F36] hover:text-[#BFA18A] transition-colors font-medium text-center"
              >
                戒指<br/>
              </Link>
              <Link
                href="/category/earrings"
                className="text-[#6B4F36] hover:text-[#BFA18A] transition-colors font-medium text-center"
              >
                耳環<br/>
              </Link>
              <Link
                href="/category/necklace"
                className="text-[#6B4F36] hover:text-[#BFA18A] transition-colors font-medium text-center"
              >
                項鍊<br/>
              </Link>
            </nav>

            {/* 右側功能按鈕 */}
            <div className="flex items-center space-x-1 md:space-x-3">
              {/* 搜尋按鈕 */}
              <Link
                href="/search"
                className="relative p-2 text-[#6B4F36] hover:text-[#BFA18A] transition-colors rounded-full hover:bg-[#F5E9DF]"
                aria-label="搜尋商品"
              >
                <Search className="w-5 h-5" />
                <span className="sr-only">搜尋商品</span>
              </Link>

              {/* 購物車按鈕 */}
              <Link
                href="/cart"
                className="relative p-2 text-[#6B4F36] hover:text-[#BFA18A] transition-colors rounded-full hover:bg-[#F5E9DF]"
                aria-label="購物車"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-[#BFA18A] hover:bg-[#6B4F36] text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full p-0">
                    {cartCount}
                  </Badge>
                )}
                <span className="sr-only">購物車</span>
              </Link>

              {/* 訂單查詢按鈕 */}
              {user && (user.role === 'admin' || user.role === 'store_owner') && (
                <Link
                  href="/admin/dashboard"
                  className="relative p-2 text-[#6B4F36] hover:text-[#BFA18A] transition-colors rounded-full hover:bg-[#F5E9DF]"
                  aria-label="訂單查詢"
                >
                  <ClipboardList className="w-5 h-5" />
                  <span className="sr-only">訂單查詢</span>
                </Link>
              )}

              {/* 登入/註冊按鈕 */}
              {user ? (
                <Link
                  href="/account"
                  className="relative p-2 text-[#6B4F36] hover:text-[#BFA18A] transition-colors rounded-full hover:bg-[#F5E9DF]"
                  aria-label="會員中心"
                >
                  <User className="w-5 h-5" />
                  <span className="sr-only">會員中心</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="relative flex items-center space-x-1 px-3 py-2 text-[#6B4F36] hover:text-[#BFA18A] transition-colors rounded-full hover:bg-[#F5E9DF]"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">登入/註冊</span>
                </Link>
              )}
            </div>
          </div>

          {/* 搜尋欄 */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pb-4"
              >
                <div className="flex items-center">
                  <Input
                    type="search"
                    placeholder="搜尋商品..."
                    className="border-[#BFA18A] focus-visible:ring-[#BFA18A]"
                  />
                  <Button className="ml-2 bg-[#BFA18A] hover:bg-[#6B4F36] text-white">搜尋</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="flex-1">
        {/* 輪播圖區域 */}
        <section className="relative overflow-hidden bg-[#F5E9DF]">
          <div className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
            {/* 輪播圖片/影片 */}
            {carouselItems.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B4F36]/60 to-transparent z-10 rounded-xl" />
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={index === 0}
                    className="object-cover w-full h-full rounded-xl shadow-lg"
                  />
                ) : (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full rounded-xl shadow-lg"
                    style={{ display: 'block' }}
                  />
                )}
                <div className="absolute inset-0 flex items-center z-20">
                  <div className="container mx-auto px-4">
                    <div className="max-w-lg">
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-serif drop-shadow-lg"
                      >
                        {item.alt}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow"
                      >
                        {item.subtitle}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <Button
                          size="lg"
                          className="bg-white text-[#6B4F36] hover:bg-[#BFA18A] hover:text-white transition-colors rounded-full px-8 shadow"
                        >
                          立即選購
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 輪播控制按鈕 */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-200"
              aria-label="上一張"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-200"
              aria-label="下一張"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* 輪播指示器 */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`前往第 ${index + 1} 張圖片`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 品牌特色區 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl transition-transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#F5E9DF] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#6B4F36"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 6V12L16 14"
                      stroke="#6B4F36"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                </svg>
                </div>
                <h3 className="text-xl font-bold text-[#6B4F36] mb-2">快速出貨</h3>
                <p className="text-[#6B4F36]/70">下單後24小時內出貨，讓您盡快收到心愛商品</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl transition-transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#F5E9DF] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      stroke="#6B4F36"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                </svg>
                </div>
                <h3 className="text-xl font-bold text-[#6B4F36] mb-2">精選品質</h3>
                <p className="text-[#6B4F36]/70">每件商品皆經過嚴格品質把關，確保最佳品質</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl transition-transform hover:-translate-y-2 duration-300">
                <div className="w-16 h-16 rounded-full bg-[#F5E9DF] flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="#6B4F36"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 6l-10 7L2 6"
                      stroke="#6B4F36"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                </svg>
                </div>
                <h3 className="text-xl font-bold text-[#6B4F36] mb-2">貼心客服</h3>
                <p className="text-[#6B4F36]/70">專業客服團隊，隨時為您解答各種疑問</p>
              </div>
            </div>
          </div>
        </section>

        {/* 熱門商品區 */}
        {products.length > 0 && (
          <section className="py-16 bg-[#FDF7F2]">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-[#6B4F36] font-serif relative">
                  熱門商品
                  <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#BFA18A] rounded-full"></span>
                </h2>
                <Link
                  href="/search"
                  className="text-[#BFA18A] hover:text-[#6B4F36] transition-colors font-medium flex items-center"
                >
                  查看全部 <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.slice(0, 5).map((product) => (
                  <Link href={`/product/${product.id}`} key={product.id} className="group">
                    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg?height=300&width=300"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 z-10">
                          <button className="bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full text-[#BFA18A] hover:text-[#6B4F36] transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="sr-only">加入收藏</span>
                          </button>
                        </div>
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
                        <p className="text-[#BFA18A] font-bold">NT$ {product.price}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 最新上架區 */}
        {products.filter((p) => p.isNew).length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-[#6B4F36] font-serif relative">
                  最新上架
                  <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#BFA18A] rounded-full"></span>
                </h2>
                <Link
                  href="/search?sort=newest"
                  className="text-[#BFA18A] hover:text-[#6B4F36] transition-colors font-medium flex items-center"
                >
                  查看全部 <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products
                  .filter((p) => p.isNew)
                  .slice(0, 5)
                  .map((product) => (
                    <Link href={`/product/${product.id}`} key={product.id} className="group">
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-white rounded-2xl">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg?height=300&width=300"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-3 right-3 z-10">
                            <button className="bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full text-[#BFA18A] hover:text-[#6B4F36] transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="sr-only">加入收藏</span>
                            </button>
                          </div>
                          <div className="absolute top-3 left-3 z-10">
                            <Badge className="bg-[#BFA18A] hover:bg-[#BFA18A] text-white">新品</Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-[#6B4F36] mb-1 truncate group-hover:text-[#BFA18A] transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-[#BFA18A] font-bold">NT$ {product.price}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Instagram 區塊 */}
        <section className="py-16 bg-[#FDF7F2]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#6B4F36] font-serif inline-block relative">
                Instagram
                <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-[#BFA18A] rounded-full"></span>
              </h2>
              <p className="mt-4 text-[#6B4F36]/70">關注我們的 Instagram 獲取更多穿搭靈感</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {instagramPosts.map((post, idx) => (
                <Link
                  href={post.url}
                  target="_blank"
                  key={idx}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={post.image}
                    alt={`Instagram 貼文 ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#6B4F36]/0 group-hover:bg-[#6B4F36]/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Instagram className="text-white w-8 h-8" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href="https://www.instagram.com/nadu.tw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  variant="outline"
                  className="rounded-full border-[#BFA18A] text-[#BFA18A] hover:bg-[#BFA18A] hover:text-white"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  關注我們
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* 關於我們 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold text-[#6B4F36] font-serif inline-block relative">
                關於 nadu.
                <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-[#BFA18A] rounded-full"></span>
              </h2>
              <div className="mt-8 space-y-4 text-[#6B4F36]/80">
                <p>
                nadu.
                成立於2022年，專注於為台灣消費者帶來韓國、日本最新流行的時尚飾品。我們精心挑選每一件商品，確保品質與設計兼具。無論是日常穿搭還是特殊場合，nadu.
                都能為您提供最適合的配飾選擇。
              </p>
                <p>
                我們定期更新商品，緊跟國際時尚潮流，讓您不出國也能擁有最新款式。感謝您對 nadu.
                的支持與信任，我們將持續為您提供優質的服務與商品。
              </p>
              </div>
            </div>
          </div>
        </section>

        {/* 社群連結 */}
        <section className="py-10 bg-[#F5E9DF]">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://www.instagram.com/nadu.tw"
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                target="_blank"
              >
                <svg
                  className="text-[#E1306C]"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-medium">Instagram</span>
              </Link>
              <Link
                href="https://line.me/R/ti/p/@960wotkp?ts=08282016&oat_content=url"
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                target="_blank"
              >
                <svg
                  className="text-[#06C755]"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.365 9.89c.50 0 .906.41.906.91s-.406.91-.906.91H17.87v1.55h1.494c.5 0 .906.41.906.91s-.406.91-.906.91H16.97a.91.91 0 01-.906-.91V9.89c0-.5.407-.91.906-.91h2.395zm-4.443 0c.5 0 .905.41.905.91v3.37c0 .5-.405.91-.905.91s-.905-.41-.905-.91v-3.37c0-.5.405-.91.905-.91zm-3.298 0c.5 0 .905.41.905.91v1.86l1.494-2.353c.12-.223.35-.365.602-.398.253-.033.503.052.682.232.18.18.264.43.23.682-.031.252-.173.483-.396.603l-1.156 1.055 1.442 1.788c.138.215.177.48.109.728-.069.247-.238.454-.468.57-.23.115-.5.135-.745.054-.245-.08-.44-.267-.536-.513l-1.258-2.072v1.305c0 .5-.406.91-.906.91s-.905-.41-.905-.91V9.89c0-.5.405-.91.905-.91h.001zm-3.113.288a.91.91 0 00-.79.455l-1.8 3.143a.905.905 0 001.579.898l.333-.58h1.355l.334.58a.91.91 0 001.186.344.91.91 0 00.392-.553.91.91 0 00-.79-1.35l-1.8-3.143a.908.908 0 00-.79-.455.908.908 0 00-.791.454l.79.455-.789-.455.001.001zm.012 2.57l.394-.683.394.683h-.788zM24 10.63C24 4.765 18.614.002 12 .002S0 4.765 0 10.63c0 5.261 4.667 9.671 10.975 10.505.429.092 1.01.285 1.158.651.132.33.087.84.043 1.173l-.187 1.117c-.057.335-.268 1.31 1.15.715 1.417-.596 7.646-4.508 10.429-7.725h.002C23.565 17.067 24 13.985 24 10.63z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-medium">LINE官方帳號</span>
              </Link>
              <Link
                href="https://line.me/ti/g2/Ohp3jXp_ibf3YT2JycPKJ0PfLMODGR3RcPxh_w?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                target="_blank"
              >
                <svg
                  className="text-[#06C755]"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.365 9.89c.50 0 .906.41.906.91s-.406.91-.906.91H17.87v1.55h1.494c.5 0 .906.41.906.91s-.406.91-.906.91H16.97a.91.91 0 01-.906-.91V9.89c0-.5.407-.91.906-.91h2.395zm-4.443 0c.5 0 .905.41.905.91v3.37c0 .5-.405.91-.905.91s-.905-.41-.905-.91v-3.37c0-.5.405-.91.905-.91zm-3.298 0c.5 0 .905.41.905.91v1.86l1.494-2.353c.12-.223.35-.365.602-.398.253-.033.503.052.682.232.18.18.264.43.23.682-.031.252-.173.483-.396.603l-1.156 1.055 1.442 1.788c.138.215.177.48.109.728-.069.247-.238.454-.468.57-.23.115-.5.135-.745.054-.245-.08-.44-.267-.536-.513l-1.258-2.072v1.305c0 .5-.406.91-.906.91s-.905-.41-.905-.91V9.89c0-.5.405-.91.905-.91h.001zm-3.113.288a.91.91 0 00-.79.455l-1.8 3.143a.905.905 0 001.579.898l.333-.58h1.355l.334.58a.91.91 0 001.186.344.91.91 0 00.392-.553.91.91 0 00-.79-1.35l-1.8-3.143a.908.908 0 00-.79-.455.908.908 0 00-.791.454l.79.455-.789-.455.001.001zm.012 2.57l.394-.683.394.683h-.788zM24 10.63C24 4.765 18.614.002 12 .002S0 4.765 0 10.63c0 5.261 4.667 9.671 10.975 10.505.429.092 1.01.285 1.158.651.132.33.087.84.043 1.173l-.187 1.117c-.057.335-.268 1.31 1.15.715 1.417-.596 7.646-4.508 10.429-7.725h.002C23.565 17.067 24 13.985 24 10.63z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-medium">LINE社群</span>
              </Link>
              <Link
                href="https://shopee.tw/nadu.tw"
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                target="_blank"
              >
                <svg
                  className="text-[#EE4D2D]"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 0C8.741 0 6.087 2.654 6.087 5.913c0 .261 .213 .474 h10.878c.261 0 .474-.213 .474-.474C17.913 2.654 15.259 0 12 0zm.113 1.425a4.318 4.318 0 014.252 3.51H7.847a4.318 4.318 0 014.266-3.51zM4.191 7.365C1.88 7.365 0 9.245 0 11.557v7.061c0 2.311 1.88 4.191 4.191 4.191h15.618c2.311 0 4.191-1.88 4.191-4.191v-7.061c0-2.311-1.88-4.191-4.191-4.191H4.191zm.474 1.422h14.67c1.527 0 2.77 1.242 2.77 2.77v7.061c0 1.527-1.242 2.77-2.77 2.77H4.665a2.774 2.774 0 01-2.77-2.77v-7.061c0-1.527 1.242-2.77 2.77-2.77zm3.309 2.196c-1.574 0-2.87 1.296-2.87 2.87s1.296 2.87 2.87 2.87c1.574 0 2.87-1.296 2.87-2.87s-1.296-2.87-2.87-2.87zm7.826 0c-1.574 0-2.87 1.296-2.87 2.87s1.296 2.87 2.87 2.87 2.87-1.296 2.87-2.87-1.296-2.87-2.87-2.87zm-7.826 1.422c.806 0 1.448.642 1.448 1.448 0 .806-.642 1.448-1.448 1.448a1.426 1.426 0 01-1.448-1.448c0-.806.642-1.448 1.448-1.448zm7.826 0c.806 0 1.448.642 1.448 1.448 0 .806-.642 1.448-1.448 1.448a1.426 1.426 0 01-1.448-1.448c0-.806.642-1.448 1.448-1.448z"
                    fill="currentColor"
                  />
                </svg>
                <span className="font-medium">蝦皮商城</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 頁尾 */}
      <footer className="bg-[#6B4F36] text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center mb-8">
            <div className="relative w-16 h-16 overflow-hidden rounded-full border-2 border-[#BFA18A]">
              <Image src="/images/nadu-logo.jpeg" alt="nadu." fill className="object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-xl">關於我們</h3>
              <p className="text-sm text-white/80">
                nadu. 致力於為您提供精選的韓國、日本時尚飾品，讓您的穿搭更具個人風格。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-xl">客戶服務</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="text-white/80 hover:text-white transition-colors hover:underline">
                    常見問題
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-white/80 hover:text-white transition-colors hover:underline">
                    配送政策
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-white/80 hover:text-white transition-colors hover:underline">
                    退換貨政策
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-xl">付款方式</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-white/80">信用卡付款</li>
                <li className="text-white/80">ATM轉帳</li>
                <li className="text-white/80">超商付款</li>
                <li className="text-white/80">LINE Pay</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70">
            &copy; {new Date().getFullYear()} nadu. 保留所有權利。
          </div>
        </div>
      </footer>
    </div>
  )
}
