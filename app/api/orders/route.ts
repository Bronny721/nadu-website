import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { User } from '@/lib/types';

// 定義預期的訂單創建請求體類型
interface CreateOrderRequestBody {
  items: Array<{ id: string; name: string; price: number; quantity: number; image?: string; variant?: string; slug: string }>;
  total: number;
  shippingInfo: Record<string, any>; // 或者更詳細的配送資訊類型
}

export async function POST(req: Request) {
  try {
    // 1. 驗證使用者身份 (與 /api/account/orders 類似)
    let token = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      // 如果 Authorization Header 中沒有 Token，也可以檢查 Cookie (可選，取決於前端如何發送)
      // const cookieHeader = req.headers.get('Cookie');
      // if (cookieHeader) {
      //   const cookies = parse(cookieHeader);
      //   token = cookies.token; // 假設 token 儲存在名為 'token' 的 cookie 中
      // }

      if (!token) {
        console.log('[API/orders] 未提供認證 Token');
        return NextResponse.json({ error: '未提供認證 Token' }, { status: 401 });
      }
    }

    let userPayload: User;
    try {
      const verificationResult = await AuthService.verifyToken(token);

      if (!verificationResult.valid || !verificationResult.user) {
        console.log('[API/orders] Token 驗證失敗或無效的使用者');
        return NextResponse.json({ error: '無效或過期的認證 Token' }, { status: 401 });
      }

      userPayload = verificationResult.user;

      if (!userPayload.id) {
        console.log('[API/orders] Token 驗證成功但使用者對象缺少 ID');
        return NextResponse.json({ error: '無效的使用者資料 (缺少 ID)' }, { status: 401 });
      }

    } catch (error) {
      console.error('[API/orders] Token 驗證過程中發生錯誤:', error);
      return NextResponse.json({ error: '認證服務內部錯誤' }, { status: 500 });
    }

    const userId = Number(userPayload.id);

    // 2. 從請求體中獲取訂單數據
    let body: CreateOrderRequestBody;
    try {
        body = await req.json();
        // 基本的數據驗證
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0 || typeof body.total !== 'number' || !body.shippingInfo) {
            console.log('[API/orders] 請求體數據格式不正確或缺少必要欄位', body);
            return NextResponse.json({ error: '請求數據無效' }, { status: 400 });
        }

    } catch (error) {
        console.error('[API/orders] 解析請求體時發生錯誤:', error);
        return NextResponse.json({ error: '無效的請求格式' }, { status: 400 });
    }

    // 3. 將訂單數據存入資料庫
    try {
      const newOrder = await prisma.userOrder.create({
        data: {
          userId: userId,
          items: JSON.stringify(body.items), // 將商品陣列轉換為 JSON 字串儲存
          shippingInfo: JSON.stringify(body.shippingInfo), // 將配送資訊轉換為 JSON 字串儲存
          total: body.total,
          status: 'Pending', // 預設訂單狀態為 Pending (待處理)
          // created_at 會自動設定為目前時間
        },
      });

      console.log('[API/orders] 成功創建訂單:', newOrder.id);

      // 4. 返回成功響應
      return NextResponse.json({ success: true, order: newOrder }, { status: 201 }); // 返回 201 Created 狀態碼

    } catch (dbError: any) {
      console.error('[API/orders] 儲存訂單到資料庫時發生錯誤:', dbError);
      console.error('[API/orders] 資料庫錯誤詳情:', {
          name: dbError?.name,
          message: dbError?.message,
          stack: dbError?.stack
      });
      return NextResponse.json({ error: '無法創建訂單 (資料庫錯誤)' }, { status: 500 });
    }

  } catch (outerError: any) {
      console.error('[API/orders] 整個 POST handler 發生未預期錯誤:', outerError);
      console.error('[API/orders] 未預期錯誤詳情:', {
          name: outerError?.name,
          message: outerError?.message,
          stack: outerError?.stack
      });
      return NextResponse.json({ error: '伺服器內部未預期錯誤' }, { status: 500 });
  }
}

// 如果需要處理其他 HTTP 方法，可以在這裡添加對應的 export function
// export async function GET(req: Request) { ... }
// export async function PUT(req: Request) { ... }
// export async function DELETE(req: Request) { ... } 