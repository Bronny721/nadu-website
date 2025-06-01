import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(resolvedParams.id) }
  })
  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 })
  }

  console.log("從資料庫獲取的商品資料:", product);

  return NextResponse.json(product)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const data = await req.json()
  const product = await prisma.product.update({
    where: { id: Number(resolvedParams.id) },
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
      stock: data.stock,
      isNew: data.isNew,
      image: data.image,
      images: data.images as any,
    }
  })
  return NextResponse.json(product)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params;
  await prisma.product.delete({
    where: { id: Number(resolvedParams.id) }
  })
  return NextResponse.json({ success: true })
}