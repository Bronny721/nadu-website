"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface WishlistContextType {
  items: string[]
  isInWishlist: (id: string) => boolean
  addToWishlist: (id: string) => void
  removeFromWishlist: (id: string) => void
  toggleWishlist: (id: string) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([])

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        setItems(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error)
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(items))
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error)
    }
  }, [items])

  const isInWishlist = (id: string) => items.includes(id)

  const addToWishlist = (id: string) => {
    if (!isInWishlist(id)) {
      setItems((prev) => [...prev, id])
    }
  }

  const removeFromWishlist = (id: string) => {
    setItems((prev) => prev.filter((itemId) => itemId !== id))
  }

  const toggleWishlist = (id: string) => {
    if (isInWishlist(id)) {
      removeFromWishlist(id)
    } else {
      addToWishlist(id)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
