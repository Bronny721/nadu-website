import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
// import { getServerSession } from 'next-auth'; // 移除 getServerSession 匯入
import { AuthService } from '@/lib/auth'; // 正確匯入 AuthService 類別
import { User } from '@/lib/types'; // 假設 User 類型在這裡定義
import { serialize } from 'cookie'; // 引入 cookie 庫用於解析
import { parse } from 'cookie';

// import { authOptions } from '@/lib/auth'; // 不再需要 authOptions 來獲取 session

// 定義訂單項目和配送信息的類型，與前端 OrdersPage 中的定義一致
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

interface ShippingAddress {
  [key: string]: any; // 允許任意屬性，如果需要更精確可以細化
}

export async function GET(req: Request) {
  // console.log('[API/account/orders] GET 請求收到'); // 移除診斷日誌

  try {
    // console.log('[API/account/orders] 環境變數 NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '已設定' : '未設定'); // 移除診斷日誌
    // console.log('[API/account/orders] 環境變數 NEXTAUTH_URL:', process.env.NEXTAUTH_URL); // 移除診斷日誌

    let token = null;

    // 優先嘗試從 Authorization Header 獲取 Token
    const authHeader = req.headers.get('Authorization');
    // console.log('[API/account/orders] 完整的 Authorization Header:', authHeader); // 移除診斷日誌

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      // console.log('[API/account/orders] 從 Authorization Header 提取到 Token (部分):', token.substring(0, 10) + '...'); // 移除診斷日誌
    } // else { console.log('[API/account/orders] Authorization Header 不存在或格式不正確'); } // 移除診斷日誌

    // 如果沒有從 Header 獲取到 Token，則嘗試從 Cookie 中獲取
    if (!token) {
        const cookieHeader = req.headers.get('Cookie');
        // console.log('[API/account/orders] 完整的 Cookie Header:', cookieHeader); // 移除診斷日誌

        if (cookieHeader) {
            const cookies = parse(cookieHeader);
            token = cookies.token;
            // console.log('[API/account/orders] 從 Cookie 中獲取到 Token (部分):', token ? token.substring(0, 10) + '...' : '未找到'); // 移除診斷日誌
        } // else { console.log('[API/account/orders] Cookie Header 不存在'); } // 移除診斷日誌
    }

    // 如果仍然沒有獲取到 Token，則返回未授權錯誤
    if (!token) {
        console.log('[API/account/orders] 未找到任何認證 Token (Header 或 Cookie)'); // 保留這個錯誤日誌
        return NextResponse.json({ error: '未提供認證 Token' }, { status: 401 });
    }

    let userPayload: User; // 明確使用者酬載的型別
    try {
      // console.log('[API/account/orders] 呼叫 AuthService.verifyToken...'); // 移除診斷日誌
      const verificationResult = await AuthService.verifyToken(token);
      // console.log('[API/account/orders] AuthService.verifyToken 結果:', verificationResult); // 移除診斷日誌

      if (!verificationResult.valid || !verificationResult.user) {
          console.log('[API/account/orders] Token 驗證失敗或無效的使用者'); // 保留這個錯誤日誌
          return NextResponse.json({ error: '無效或過期的認證 Token' }, { status: 401 });
      }

      userPayload = verificationResult.user; // 從驗證結果中獲取使用者對象
      // console.log('[API/account/orders] Token 驗證成功，使用者:', userPayload); // 移除診斷日誌

      // 檢查使用者對象是否包含必要的 ID
      if (!userPayload.id) {
          console.log('[API/account/orders] Token 驗證成功但使用者對象缺少 ID'); // 保留這個錯誤日誌
          return NextResponse.json({ error: '無效的使用者資料 (缺少 ID)' }, { status: 401 });
      }

    } catch (error) {
      console.error('[API/account/orders] Token 驗證過程中發生錯誤:', error); // 保留這個錯誤日誌
      // 將 Token 驗證過程中的錯誤視為內部認證服務問題
      return NextResponse.json({ error: '認證服務內部錯誤' }, { status: 500 });
    }

    // 如果 Token 驗證成功，從 Payload 中獲取使用者 ID
    const userId = Number(userPayload.id);
    // console.log('[API/account/orders] 獲取到使用者 ID:', userId); // 移除診斷日誌

    try {
      // console.log(`[API/account/orders] 查詢使用者 ${userId} 的訂單...`); // 移除診斷日誌
      const orders = await prisma.userOrder.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          created_at: 'desc', // 依照建立時間降冪排列
        },
      });
      // console.log('[API/account/orders] 查詢到訂單數量:', orders.length); // 移除診斷日誌

      // 解析 JSON 字串並格式化訂單數據
      const formattedOrders = orders.map(order => {
        let items: OrderItem[] = []; // 明確型別
        let shippingAddress: ShippingAddress = {}; // 明確型別
        try {
          items = order.items ? JSON.parse(order.items) : [];
        } catch (e) {
          console.error(`[API/account/orders] 解析訂單 ${order.id} 的 items 時發生錯誤:`, e); // 保留這個錯誤日誌
          items = [];
        }
        try {
          shippingAddress = order.shippingInfo ? JSON.parse(order.shippingInfo) : {};
        } catch (e) {
          console.error(`[API/account/orders] 解析訂單 ${order.id} 的 shippingInfo 時發生錯誤:`, e); // 保留這個錯誤日誌
          shippingAddress = {};
        }

        return {
          id: order.id,
          status: order.status,
          date: order.created_at, // 使用 created_at，前端可以自行格式化
          total: order.total,
          items: items,
          shippingAddress: shippingAddress,
        };
      });
      // console.log('[API/account/orders] 格式化訂單完成'); // 移除診斷日誌

      // 回傳訂單列表
      return NextResponse.json(formattedOrders);

    } catch (dbError: any) {
      console.error('[API/account/orders] 查詢或處理訂單數據時發生資料庫錯誤:', dbError); // 保留這個錯誤日誌
      console.error('[API/account/orders] 資料庫錯誤詳情:', {
          name: dbError?.name,
          message: dbError?.message,
          stack: dbError?.stack
      }); // 保留這個錯誤日誌
      return NextResponse.json({ error: '無法獲取訂單列表 (資料庫錯誤)' }, { status: 500 });
    }

  } catch (outerError: any) {
      console.error('[API/account/orders] 整個 GET handler 發生未預期錯誤:', outerError); // 保留這個錯誤日誌
      console.error('[API/account/orders] 未預期錯誤詳情:', {
          name: outerError?.name,
          message: outerError?.message,
          stack: outerError?.stack
      }); // 保留這個錯誤日誌
      return NextResponse.json({ error: '伺服器內部未預期錯誤' }, { status: 500 });
  }
} 