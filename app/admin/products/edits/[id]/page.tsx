"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
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

export default function EditProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams() as { id: string }
  const id = params.id
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    isNew: true,
    origin: "",
    material: "",
    imageUrls: [""],
  })

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRes = await fetch(`/api/admin/products/${id}`)
        if (!productRes.ok) {
          toast({
            title: "找不到商品",
            description: "此商品不存在或已被刪除",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
        const product = await productRes.json()
        if (product) {
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
            category: product.category,
            stock: product.stock ? product.stock.toString() : "",
            isNew: product.isNew || false,
            origin: product.origin || "",
            material: product.material || "",
            imageUrls: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [""]),
          })
          if (product.images && product.images.length > 0) {
            setImages(product.images)
          } else if (product.image) {
            setImages([product.image])
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "載入失敗",
          description: "無法載入商品資料",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, toast])

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

      // Create preview URLs for the images
      const newImageUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImageUrls])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
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

      // Create a slug from the product name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")

      const productData = {
        id: id,
        name: formData.name,
        slug,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : undefined,
        category: formData.category,
        stock: formData.stock ? Number.parseInt(formData.stock) : undefined,
        isNew: formData.isNew,
        origin: formData.origin,
        material: formData.material,
        image: imageUrls[0] || undefined,
        images: imageUrls,
      }

      await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      toast({
        title: "商品已更新",
        description: "商品資料已成功更新",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "更新失敗",
        description: "無法更新商品，請稍後再試",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
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
        <h1 className="text-3xl font-bold">編輯商品</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">商品名稱 *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="輸入商品名稱"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">商品描述 *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="輸入商品描述"
                rows={8}
                required
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

            <div className="flex items-center space-x-2">
              <Switch
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) => handleSwitchChange("isNew", checked)}
              />
              <Label htmlFor="isNew">標記為新品</Label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="origin">產地</Label>
              <Input
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="例如：韓國、日本"
              />
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
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/products">取消</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "儲存中..." : "儲存變更"}
          </Button>
        </div>
      </form>
    </div>
  )
}
