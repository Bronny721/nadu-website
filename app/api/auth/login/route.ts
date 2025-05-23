import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { LoginFormData } from '@/lib/types';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as LoginFormData;
    
    // 驗證必填字段
    if (!data.email || !data.password) {
      return NextResponse.json(
        { success: false, message: '郵箱和密碼都是必填的' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ success: false, message: '帳號不存在' }, { status: 400 });
    }
    const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ success: false, message: '密碼錯誤' }, { status: 400 });
    }

    // 產生 JWT 並設置到 cookie
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      token
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60
    });
    return response;
  } catch (error) {
    console.error('登錄錯誤:', error);
    return NextResponse.json(
      { success: false, message: '登錄過程中發生錯誤' },
      { status: 500 }
    );
  }
} 