import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  // 取得登入使用者
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: '未授權' }, { status: 401 })
  }

  console.log('session.user:', session.user);

  // 查詢 UserOrder
  const order = await prisma.userOrder.findFirst({
    where: {
      id: Number(params.id),
      userId: Number(session.user.id),
    }
  })

  if (!order) {
    return NextResponse.json({ error: '查無訂單資料' }, { status: 404 })
  }

  // 若 items、shippingInfo 是 JSON 字串，這裡解析
  let items = []
  let shippingAddress = {}
  try {
    items = order.items ? JSON.parse(order.items) : []
  } catch {
    items = []
  }
  try {
    shippingAddress = order.shippingInfo ? JSON.parse(order.shippingInfo) : {}
  } catch {
    shippingAddress = {}
  }

  // 回傳前端需要的格式
  return NextResponse.json({
    id: order.id,
    status: order.status,
    date: order.created_at, // 你可根據需求調整
    total: order.total,
    items,
    shippingAddress,
    // 其他欄位可依需求補上
  })
} 