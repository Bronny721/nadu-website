import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) }
  })
  if (!product) {
    return NextResponse.json({ error: "商品不存在" }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const product = await prisma.product.update({
    where: { id: Number(params.id) },
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
  await prisma.product.delete({
    where: { id: Number(params.id) }
  })
  return NextResponse.json({ success: true })
}