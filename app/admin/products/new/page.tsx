"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, X, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { categories } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    isNew: true,
    brand: "",
    material: "",
    imageUrls: [""],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...newFiles])

      // 創建圖片預覽 URL
      const newImageUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImageUrls])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleImageUrlChange = (idx: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, i) => i === idx ? value : url)
    }))
  }

  const addImageUrlField = () => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ""]
    }))
  }

  const removeImageUrlField = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 合併所有網址與本地圖片
      const urlList = formData.imageUrls.map(url => url.trim()).filter(url => url.length > 0)
      const imageUrls = [...urlList, ...images]

      // 從商品名稱創建 slug
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      const productData = {
        name: formData.name,
        slug,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        stock: formData.stock ? Number.parseInt(formData.stock) : undefined,
        isNew: formData.isNew,
        brand: formData.brand,
        material: formData.material,
        image: imageUrls[0] || undefined,
        images: imageUrls,
        tags: tags,
      }

      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      toast({
        title: "商品已建立",
        description: "商品已成功新增到您的商店",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "建立失敗",
        description: "無法建立商品，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回商品列表
          </Link>
        </Button>
        <h1 className="text-4xl font-extrabold">新增商品</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold">商品名稱 *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="輸入商品名稱"
                required
                className="focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold">商品描述 *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="輸入商品描述"
                rows={8}
                required
                className="focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">售價 (NT$) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">原價 (NT$)</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">商品分類 *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">庫存數量</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="無限"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">品牌</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="輸入品牌名稱"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) => handleSwitchChange("isNew", checked)}
              />
              <Label htmlFor="isNew">標記為新品</Label>
            </div>

            <div className="space-y-2">
              <Label>商品圖片網址</Label>
              {formData.imageUrls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    type="url"
                    placeholder="請貼上圖片網址"
                    value={url}
                    onChange={e => handleImageUrlChange(idx, e.target.value)}
                  />
                  {formData.imageUrls.length > 1 && (
                    <Button type="button" size="icon" variant="ghost" onClick={() => removeImageUrlField(idx)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  {idx === formData.imageUrls.length - 1 && (
                    <Button type="button" size="icon" variant="outline" onClick={addImageUrlField}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <Label>商品圖片</Label>
              <div className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 shadow-inner">
                <div className="grid grid-cols-2 gap-4 mb-4 w-full">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg shadow border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-red-500 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="w-full cursor-pointer">
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="h-8 w-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">點擊或拖曳圖片至此處上傳</p>
                    <p className="text-xs text-gray-400 mt-1">支援 JPG, PNG, WEBP 格式</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">材質</Label>
              <Input
                id="material"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="例如：925純銀、羊皮"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">標籤</Label>
              <div className="flex">
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="輸入標籤後按 Enter 或點擊添加"
                  className="flex-1"
                />
                <Button type="button" onClick={addTag} variant="outline" className="ml-2">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-xs rounded-full hover:bg-gray-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="rounded-lg px-8 py-2 font-bold text-base bg-primary text-white hover:brightness-110 active:scale-95 transition">
            {isSubmitting ? "新增中..." : "新增商品"}
          </Button>
        </div>
      </form>
    </div>
  )
}
