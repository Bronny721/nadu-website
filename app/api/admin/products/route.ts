import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { created_at: 'desc' }
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const data = await request.json()
  const product = await prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
      stock: data.stock,
      isNew: data.isNew,
      image: data.image,
    }
  })
  return NextResponse.json(product, { status: 201 })
} 