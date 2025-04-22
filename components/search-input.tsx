"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)

  // 模擬搜尋建議
  const suggestions = ["戒指", "耳環", "項鍊", "手鍊", "包包", "925銀", "韓國飾品", "日本飾品"].filter(
    (item) => query && item.includes(query),
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
    }
  }

  // 點擊建議項目
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    setShowSuggestions(false)
  }

  // 點擊外部關閉建議
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex w-full">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="搜尋商品..."
            className="rounded-r-none pl-8 w-full"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (e.target.value.trim()) {
                setShowSuggestions(true)
              } else {
                setShowSuggestions(false)
              }
            }}
            onFocus={() => {
              if (query.trim()) setShowSuggestions(true)
            }}
          />
        </div>
        <Button type="submit" variant="outline" size="icon" className="rounded-l-none border-l-0">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 w-full bg-white shadow-lg rounded-md mt-1 border overflow-hidden"
        >
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center">
                  <Search className="h-3 w-3 mr-2 text-muted-foreground" />
                  {suggestion}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
