"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/lib/types"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
  slug: string
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  addItem: (product: Product, quantity?: number, variant?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on initial render
  useEffect(() => {
    console.log("useEffect: 嘗試從 localStorage 讀取購物車")
    try {
      const savedCart = localStorage.getItem("cart")
      console.log("useEffect: 從 localStorage 讀取到:", savedCart)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        console.log("useEffect: 解析後的購物車數據:", parsedCart)
        setItems(parsedCart)
      } else {
        console.log("useEffect: localStorage 中沒有購物車數據")
      }
    } catch (error) {
      console.error("useEffect: Failed to load cart from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes, ONLY after initial load
  useEffect(() => {
    if (isLoaded) {
      console.log("useEffect: 購物車 items 狀態變化，嘗試儲存到 localStorage:", items)
      try {
        localStorage.setItem("cart", JSON.stringify(items))
      } catch (error) {
        console.error("useEffect: Failed to save cart to localStorage:", error)
      }
    }
  }, [items, isLoaded])

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  const addItem = (product: Product, quantity = 1, variant = "標準款式") => {
    console.log("addItem 函式被呼叫，要加入的商品:", { product, quantity, variant })

    try {
      setItems((prevItems) => {
        console.log("addItem - 當前購物車 items:", prevItems)
        const existingItemIndex = prevItems.findIndex((item) => String(item.id) === String(product.id) && item.variant === variant)

        if (existingItemIndex > -1) {
          // Item exists, update quantity
          const updatedItems = [...prevItems]
          updatedItems[existingItemIndex].quantity += quantity
          console.log("addItem - 商品已存在，更新數量後的 items:", updatedItems)
          return updatedItems
        } else {
          // Add new item
          const newItem = {
            id: String(product.id),
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            variant,
            slug: product.slug,
          }
          console.log("addItem - 商品不存在，新增商品:", newItem)
          console.log("addItem - 新增商品後的 items:", [...prevItems, newItem])
          return [
            ...prevItems,
            newItem,
          ]
        }
      })
    } catch (error) {
      console.error("addItem 函式執行錯誤:", error)
    }
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
