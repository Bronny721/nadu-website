import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { created_at: 'desc' }
  })
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const data = await request.json()
  const order = await prisma.order.create({
    data: {
      customer_name: data.customer_name,
      customer_id: data.customer_id,
      date: data.date,
      total: data.total,
      status: data.status,
      trackingNumber: data.trackingNumber ?? null,
    }
  })
  return NextResponse.json(order, { status: 201 })
} 