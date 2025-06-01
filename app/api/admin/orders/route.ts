import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { AuthService } from '@/lib/auth'; // 引入認證服務

// 新增驗證管理員的 Middleware 函數 (可選，但推薦)
async function isAdmin(req: Request): Promise<{ valid: boolean, user?: any }> {
  let token = null;
  const authHeader = req.headers.get('Authorization');
  // 也檢查 Cookie 中的 token，以應對不同的認證方式
  if (!token) {
    const cookieHeader = req.headers.get('Cookie');
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = value;
            return acc;
        }, {} as any);
        // 假設 Token 儲存在名為 'token' 的 Cookie 中
        token = cookies['token'];
    }
  }

  if (!token) return { valid: false };

  try {
    const verificationResult = await AuthService.verifyToken(token);
    if (!verificationResult.valid || !verificationResult.user) return { valid: false };

    const userPayload = verificationResult.user;
    // 檢查使用者角色，只允許 admin 和 store_owner 訪問
    if (userPayload.role === 'admin' || userPayload.role === 'store_owner') {
      return { valid: true, user: userPayload };
    } else {
      return { valid: false };
    }
  } catch (error) {
    console.error("Error verifying admin token:", error);
    return { valid: false };
  }
}

export async function GET(req: Request) {
  try {
    // 驗證管理員身份
    const authResult = await isAdmin(req);
    if (!authResult.valid) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    // 從 UserOrder 表中獲取訂單數據
    const orders = await prisma.userOrder.findMany({
      orderBy: { created_at: 'desc' },
      include: { // 包含相關的 User 信息
          user: {
              select: {
                  name: true,
                  email: true,
                  phone: true,
              }
          }
      }
    });

    // 格式化數據以便前端使用 (可選，但推薦)
    const formattedOrders = orders.map(order => ({
        id: order.id,
        customer_name: order.user?.name || "未知", 
        customer_id: order.userId, // 使用 userId
        date: order.created_at.toLocaleDateString(), // 使用 created_at 作為日期
        total: order.total ?? 0, // 使用 total 且提供默認值
        status: order.status, 
        // 添加其他需要的字段
    }));

    return NextResponse.json(formattedOrders);

  } catch (error: any) {
    console.error('獲取訂單列表時發生錯誤:', error);
    return NextResponse.json({ error: '無法獲取訂單列表' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // 可選：在這裡添加創建訂單的 API 端點，但通常訂單是在結帳時創建的
  return NextResponse.json({ message: "POST method not implemented for admin orders" }, { status: 405 });
}

// 其他方法 (PUT, DELETE) 如果需要，也可以在這裡添加 