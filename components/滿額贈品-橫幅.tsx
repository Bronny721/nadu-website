import Link from "next/link"
import { useState } from "react"
import { ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function 滿額贈品橫幅() {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <>
      <div className="bg-coffee-light py-4 border-t border-coffee/10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-md overflow-hidden flex items-center justify-center hidden sm:flex cursor-pointer"
              onClick={() => setImageOpen(true)}
            >
              <img 
                src="/images/滿額贈.jpeg" 
                alt="精美收納袋" 
                className="object-cover w-full h-full hover:scale-105 transition-transform"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-coffee font-medium mb-1">購物滿 $599 即贈送精美收納袋</p>
              <p className="text-sm text-coffee-light">限量手工布質收納袋，完美收納您的精美飾品</p>
            </div>
          </div>
          <Link href="/" className="text-sm text-coffee flex items-center hover:underline font-medium">
            立即選購
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* 圖片放大顯示模態框 */}
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="relative">
            <img 
              src="/images/滿額贈.jpeg" 
              alt="精美收納袋" 
              className="w-full h-auto object-contain"
            />
            <DialogClose className="absolute top-2 right-2">
              <Button variant="outline" size="icon" className="rounded-full bg-white/70 hover:bg-white/90">
                ✕
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
