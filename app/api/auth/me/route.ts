import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: '無效的 token' },
        { status: 401 }
      );
    }

    const { valid, user } = await AuthService.verifyToken(token);

    if (!valid || !user) {
      return NextResponse.json(
        { success: false, message: '無效的 token' },
        { status: 401 }
      );
    }

    // 移除密碼字段
    const { password, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    console.error('獲取用戶信息錯誤:', error);
    return NextResponse.json(
      { success: false, message: '獲取用戶信息時發生錯誤' },
      { status: 500 }
    );
  }
} 