import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { AuthService } from '@/lib/auth'; // 假設你有一個認證服務來驗證 Token

export async function GET(req: Request) {
  try {
    // 1. 驗證使用者身份並檢查是否為管理員
    let token = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      console.log('[API/admin/users] 未提供認證 Token');
      return NextResponse.json({ error: '未提供認證 Token' }, { status: 401 });
    }

    let userPayload;
    try {
      const verificationResult = await AuthService.verifyToken(token);

      if (!verificationResult.valid || !verificationResult.user) {
        console.log('[API/admin/users] Token 驗證失敗或無效的使用者');
        return NextResponse.json({ error: '無效或過期的認證 Token' }, { status: 401 });
      }

      userPayload = verificationResult.user;

      // 檢查使用者角色，只允許 admin 和 store_owner 訪問
      if (userPayload.role !== 'admin' && userPayload.role !== 'store_owner') {
        console.log('[API/admin/users] 非管理員或店主嘗試訪問');
        return NextResponse.json({ error: '無權訪問' }, { status: 403 });
      }

    } catch (error) {
      console.error('[API/admin/users] Token 驗證過程中發生錯誤:', error);
      return NextResponse.json({ error: '認證服務內部錯誤' }, { status: 500 });
    }

    // 2. 獲取所有用戶的詳細列表，並包含訂單數量
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            created_at: true, // 獲取註冊日期
            _count: { // 計算訂單數量
                select: { orders: true },
            },
        },
    });

    // 格式化數據以便前端使用
    const formattedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        registeredAt: user.created_at.toLocaleDateString(), // 格式化日期
        orderCount: user._count.orders, // 提取訂單數量
    }));

    // 3. 返回用戶列表
    return NextResponse.json(formattedUsers);

  } catch (error: any) {
    console.error('[API/admin/users] 獲取用戶列表時發生錯誤:', error);
    return NextResponse.json({ error: '無法獲取用戶列表' }, { status: 500 });
  }
}

// 如果需要，可以在這裡添加 POST, PUT, DELETE 等方法來管理用戶 