import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // 清除 token cookie
  response.cookies.delete('token');
  
  return response;
} 