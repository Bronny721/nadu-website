import type { Product, Category, CartItem } from "./types"

export const categories: Category[] = [
  {
    id: "1",
    name: "包包",
    slug: "bag",
    image: "/images/包包類別圖.webp",
  },
  {
    id: "2",
    name: "手鍊",
    slug: "bracelet",
    image: "/images/手鍊類別圖.webp",
  },
  {
    id: "3",
    name: "戒指",
    slug: "ring",
    image: "/images/戒指類別圖.webp",
  },
  {
    id: "4",
    name: "耳環",
    slug: "earrings",
    image: "/images/耳環類別圖.webp",
  },
  {
    id: "5",
    name: "項鍊",
    slug: "necklace",
    image: "/images/項鍊類別圖.webp",
  },
  {
    id: "6",
    name: "其他",
    slug: "other",
    image: "/images/其他.webp",
  },
]

// 添加商品數據
export const featuredProducts: Product[] = [
  {
    id: "p3",
    name: "nadu.｜現貨 🇰🇷 bucks & leather 皺褶感小羊皮肩背包 側背包 / 黑",
    slug: "bucks-leather-wrinkled-lambskin-shoulder-bag-black",
    description: `材質：羊皮

顏色：黑色

尺寸：底約12.5*25cm｜高約16cm｜可調整背帶扣至最短43.5cm、最長105cm

*手工測量會有0.5-1cm誤差*

Made in Korea.



✦出貨時間✦

-賣場內皆為現貨商品，約1-3天出貨



✦賣場須知✦

-商品皆為實品拍攝，不同光源、螢幕顯示所呈現顏色可能略有色差，一切以實物為主。

-商品出貨前都會檢查，開箱請全程錄影保障自身權益。

-商品描述內皆有提供詳細產品資訊，如有疑問歡迎聯繫客服詢問。



✦關於皮革✦

包包皆為真皮皮革製成，天然皮革上的摺痕、黑點或些微顏色不均皆屬正常現象，非屬瑕疵範圍。

真皮包會經由日常使用，造就包包的另外一種質感與樣貌，皮革經由使用會自然增加光澤，也會變得更加柔軟舒適。



✦關於保養✦

-可定期使用乾淨柔軟的布擦拭皮革去除表面灰塵。

-真皮皮革避免直接接觸酒精。

-避免放置於下光下曝曬，或過度潮濕的環境。



▲有任何疑問歡迎詢問，請確認好再下單唷！

Instagram｜nadu.tw`,
    price: 3560,
    image: "/images/皺褶感小羊皮肩背包1.webp",
    category: "包包",
    isNew: true,
    origin: "韓國",
    material: "羊皮",
    images: [
      "/images/皺褶感小羊皮肩背包1.webp",
      "/images/皺褶感小羊皮肩背包2.webp",
      "/images/皺褶感小羊皮肩背包3.webp",
      "/images/皺褶感小羊皮肩背包4.webp"
    ],
  },
  {
    id: "p2",
    name: "nadu｜現貨 🇰🇷你的多重宇宙 鏤空開口戒指 925 silver",
    slug: "multiverse-hollow-ring-925-silver",
    description: `材質：925 純銀

尺寸：可調式

Made in Korea.



✦出貨時間✦

-賣場內皆為現貨商品，約1-3天出貨



✦賣場須知✦

-商品皆為實品拍攝，不同光源、螢幕顯示所呈現顏色可能略有色差，一切以實物為主。

-商品出貨前都會檢查，開箱請全程錄影保障自身權益。

-商品描述內皆有提供詳細產品資訊，如有疑問歡迎聯繫客服詢問。



✦關於保養✦

-純銀久了會有自然氧化現象，可使用拭銀布擦拭。

-避免直接接觸香水、保養品、泳池水、溫泉…等。

-925純銀建議經常配戴，因人體油脂可使產生自然光澤。

-未佩戴時請收納於夾鏈袋或飾品盒隔絕空氣，且避免陽光直射。



▲有任何疑問歡迎詢問，請確認好再下單唷！

Instagram｜nadu.tw`,
    price: 730,
    image: "/images/鏤空開口戒指 925 silver 1.webp",
    category: "戒指",
    isNew: true,
    origin: "韓國",
    material: "925純銀",
    images: [
      "/images/鏤空開口戒指 925 silver 1.webp",
      "/images/鏤空開口戒指 925 silver 2.webp",
      "/images/鏤空開口戒指 925 silver 3.webp",
      "/images/鏤空開口戒指 925 silver 4.webp",
      "/images/鏤空開口戒指 925 silver 5.webp"
    ],
  },
  {
    id: "p1",
    name: "🇰🇷極簡主義 日常中榜耳針式耳環925 silver",
    slug: "minimalist-earrings-925-silver",
    description: `材質：925 純銀

尺寸：內徑約1.2cm(小) / 內徑約1.4cm(大)

Made in Korea.



✦出貨時間✦

-賣場內皆為現貨商品，約1-3天出貨



✦賣場須知✦

-商品皆為實品拍攝，不同光源、螢幕顯示所呈現顏色可能略有色差，一切以實物為主。

-商品出貨前都會檢查，開箱請全程錄影保障自身權益。

-商品描述內皆有提供詳細產品資訊，如有疑問歡迎聯繫客服詢問。



✦關於保養✦

-純銀久了會有自然氧化現象，可使用拭銀布擦拭。

-避免直接接觸香水、保養品、泳池水、溫泉…等。

-925純銀建議經常配戴，因人體油脂可使產生自然光澤。

-未佩戴時請收納於夾鏈袋或飾品盒隔絕空氣，且避免陽光直射。



▲有任何疑問歡迎詢問，請確認好再下單唷！

Instagram｜nadu.tw`,
    price: 399,
    image: "/images/商品-極簡主義耳環1.webp",
    category: "耳環",
    isNew: true,
    origin: "韓國",
    material: "925純銀",
    images: ["/images/商品-極簡主義耳環1.webp", "/images/商品-極簡主義耳環2.webp"],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return featuredProducts.find((product) => product.slug === slug)
}

export function getRelatedProducts(slug: string): Product[] {
  const currentProduct = getProductBySlug(slug)
  if (!currentProduct) return []

  return featuredProducts
    .filter((product) => product.slug !== slug && product.category === currentProduct.category)
    .slice(0, 4)
}

export function getCartItems(): CartItem[] {
  return []
}
