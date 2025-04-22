"use client"

import { useState } from "react"
import { Star, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/context/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface ReviewFormProps {
  productId: string
  productName: string
  onReviewSubmit?: (review: {
    name: string;
    rating: number;
    comment: string;
    date: string;
  }) => void
}

export function ReviewForm({ productId, productName, onReviewSubmit }: ReviewFormProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const { toast } = useToast()

  const handleOpenDialog = () => {
    if (!user) {
      toast({
        title: "請先登入",
        description: "您需要登入才能評價商品",
        variant: "destructive",
      })
      return
    }
    setOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    // Create review object with user's name
    const newReview = {
      name: user.name || "用戶",
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    }

    // In a real app, you would send this to your backend
    console.log("Submitting review:", newReview)
    
    // Call the callback if provided
    if (onReviewSubmit) {
      onReviewSubmit(newReview)
    }

    // Show success message
    toast({
      title: "評價已提交",
      description: "感謝您的寶貴意見！",
    })

    // Reset form and close dialog
    setRating(5)
    setComment("")
    setOpen(false)
  }

  return (
    <>
      <Button onClick={handleOpenDialog}>撰寫評價</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>評價商品</DialogTitle>
            <DialogDescription>
              為「{productName}」寫下您的使用體驗和建議
            </DialogDescription>
          </DialogHeader>
          
          {!user ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>請先登入</AlertTitle>
              <AlertDescription>
                您需要登入才能評價商品
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">以「{user.name}」評分</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">
                  評論內容 (選填)
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="請分享您對商品的看法..."
                  rows={4}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button type="submit">提交評價</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 