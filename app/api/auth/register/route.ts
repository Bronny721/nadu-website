import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { RegisterFormData } from '@/lib/types';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as RegisterFormData;
    
    // 驗證必填字段
    if (!data.email || !data.password || !data.name || !data.phone) {
      return NextResponse.json(
        { success: false, message: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 驗證電子郵件格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, message: '無效的電子郵件格式' },
        { status: 400 }
      );
    }

    // 驗證手機號格式（台灣手機號）
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json(
        { success: false, message: '無效的手機號格式' },
        { status: 400 }
      );
    }

    // 驗證密碼長度
    if (data.password.length < 8) {
      return NextResponse.json(
        { success: false, message: '密碼長度必須至少為8個字符' },
        { status: 400 }
      );
    }

    // 驗證姓名長度
    if (data.name.length > 8) {
      return NextResponse.json(
        { success: false, message: '姓名長度不能超過8個字符' },
        { status: 400 }
      );
    }

    // 檢查 email 是否已存在
    const exist = await prisma.user.findUnique({ where: { email: data.email } });
    if (exist) {
      return NextResponse.json({ success: false, message: '該電子郵件已被註冊' }, { status: 400 });
    }

    // 密碼 hash
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        role: 'user',
      }
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role } });
  } catch (error) {
    console.error('註冊錯誤:', error);
    return NextResponse.json(
      { success: false, message: '註冊過程中發生錯誤' },
      { status: 500 }
    );
  }
} 