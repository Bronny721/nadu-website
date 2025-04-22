import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram, ShoppingBag } from "lucide-react"
import ProductCard from "@/components/product-card"
import { SiteHeader } from "@/components/site-header"
import { featuredProducts, categories } from "@/lib/data"
import { LineQRDialog } from "@/components/line-qr-dialog"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="py-16 bg-coffee-light">
          <div className="container flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-coffee">精選時尚飾品代購</h1>
              <p className="text-lg text-coffee-light">
                nadu. 為您精選韓國、日本最新流行飾品，讓您的穿搭更具個人風格
              </p>
              <div className="flex gap-4">
                <Button className="btn-coffee" size="lg" asChild>
                  <Link href="/search">瀏覽商品</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <img src="/images/nadu-logo.png" alt="nadu." className="w-64 h-64 object-contain" />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-coffee-medium">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-center text-coffee">商品分類</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group flex flex-col items-center"
                >
                  <div className="relative overflow-hidden rounded-full w-24 h-24 mb-2 border-2 border-coffee">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-center font-medium text-coffee">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Links - Styled like pills */}
        <section className="py-10 bg-white">
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
              <Link href="https://line.me/ti/g2/Ohp3jXp_ibf3YT2JycPKJ0PfLMODGR3RcPxh_w?utm_source=invitation&utm_medium=link_copy&utm_campaign=default" className="flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow" target="_blank">
                <svg className="text-[#06C755]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.365 9.89c.50 0 .906.41.906.91s-.406.91-.906.91H17.87v1.55h1.494c.5 0 .906.41.906.91s-.406.91-.906.91H16.97a.91.91 0 01-.906-.91V9.89c0-.5.407-.91.906-.91h2.395zm-4.443 0c.5 0 .905.41.905.91v3.37c0 .5-.405.91-.905.91s-.905-.41-.905-.91v-3.37c0-.5.405-.91.905-.91zm-3.298 0c.5 0 .905.41.905.91v1.86l1.494-2.353c.12-.223.35-.365.602-.398.253-.033.503.052.682.232.18.18.264.43.23.682-.031.252-.173.483-.396.603l-1.156 1.055 1.442 1.788c.138.215.177.48.109.728-.069.247-.238.454-.468.57-.23.115-.5.135-.745.054-.245-.08-.44-.267-.536-.513l-1.258-2.072v1.305c0 .5-.406.91-.906.91s-.905-.41-.905-.91V9.89c0-.5.405-.91.905-.91h.001zm-3.113.288a.91.91 0 00-.79.455l-1.8 3.143a.905.905 0 001.579.898l.333-.58h1.355l.334.58a.91.91 0 001.186.344.91.91 0 00.392-.553.91.91 0 00-.79-1.35l-1.8-3.143a.908.908 0 00-.79-.455.908.908 0 00-.791.454l.79.455-.789-.455.001.001zm.012 2.57l.394-.683.394.683h-.788zM24 10.63C24 4.765 18.614.002 12 .002S0 4.765 0 10.63c0 5.261 4.667 9.671 10.975 10.505.429.092 1.01.285 1.158.651.132.33.087.84.043 1.173l-.187 1.117c-.057.335-.268 1.31 1.15.715 1.417-.596 7.646-4.508 10.429-7.725h.002C23.565 17.067 24 13.985 24 10.63z" fill="currentColor"/>
                </svg>
                <span>LINE社群</span>
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

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="py-16 bg-coffee-light">
            <div className="container">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-coffee">熱門商品</h2>
                <Link href="/search" className="text-coffee hover:underline">
                  查看全部 &gt;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {featuredProducts.slice(0, 5).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 最新上架 */}
        {featuredProducts.filter((p) => p.isNew).length > 0 && (
          <section className="py-16 bg-white">
            <div className="container">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-coffee">最新上架</h2>
                <Link href="/search?sort=newest" className="text-coffee hover:underline">
                  查看全部 &gt;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {featuredProducts
                  .filter((p) => p.isNew)
                  .slice(0, 5)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* 關於我們 */}
        <section className="py-16 bg-coffee-medium">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-2xl font-bold mb-4 text-coffee">關於 nadu.</h2>
              <p className="text-coffee-light">
                nadu.
                成立於2022年，專注於為台灣消費者帶來韓國、日本最新流行的時尚飾品。我們精心挑選每一件商品，確保品質與設計兼具。無論是日常穿搭還是特殊場合，nadu.
                都能為您提供最適合的配飾選擇。
              </p>
              <p className="text-coffee-light">
                我們定期更新商品，緊跟國際時尚潮流，讓您不出國也能擁有最新款式。感謝您對 nadu.
                的支持與信任，我們將持續為您提供優質的服務與商品。
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 bg-coffee-dark text-white">
        <div className="container">
          <div className="flex justify-center mb-8">
            <img src="/images/nadu-logo.png" alt="nadu." className="h-16 w-16" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">關於我們</h3>
              <p className="text-sm opacity-80">
                nadu. 致力於為您提供精選的韓國、日本時尚飾品，讓您的穿搭更具個人風格。
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">客戶服務</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="hover:underline opacity-80 hover:opacity-100">
                    常見問題
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:underline opacity-80 hover:opacity-100">
                    配送政策
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:underline opacity-80 hover:opacity-100">
                    退換貨政策
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">付款方式</h3>
              <ul className="space-y-2 text-sm">
                <li className="opacity-80">信用卡付款</li>
                <li className="opacity-80">ATM轉帳</li>
                <li className="opacity-80">超商付款</li>
                <li className="opacity-80">LINE Pay</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-70">
            &copy; {new Date().getFullYear()} nadu. 保留所有權利。
          </div>
        </div>
      </footer>
    </div>
  )
}
