// 商品假資料與相關函數已移除，請串接後端或資料庫取得商品資料。

import type { Category, Product } from "./types"

export const categories: Category[] = [
  { id: 'bag', name: '包包 Bag', slug: 'bag' },
  { id: 'chain-bracelet', name: '手鍊 Chain bracelet', slug: 'chain-bracelet' },
  { id: 'ring', name: '戒指 Ring', slug: 'ring' },
  { id: 'earrings', name: '耳環 Earrings', slug: 'earrings' },
  { id: 'necklace', name: '項鍊 Necklace', slug: 'necklace' },
  { id: 'other', name: '其他 Other', slug: 'other' },
  // ... 其他原有分類（如有）
]
export const featuredProducts: Product[] = []
