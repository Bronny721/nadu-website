import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db';
import { User, RegisterFormData, LoginFormData, AuthResponse, UserRole } from './types';
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function toUserRole(role: string): UserRole {
  if (role === 'admin' || role === 'user' || role === 'store_owner') return role;
  return 'user';
}

function fixUserRole(user: any): User {
  return { ...user, role: toUserRole(user.role) };
}

export class AuthService {
  static async register(data: RegisterFormData): Promise<AuthResponse> {
    try {
      console.log('[register] process.env.JWT_SECRET:', process.env.JWT_SECRET);
      console.log('[register] JWT_SECRET:', JWT_SECRET);
      console.log('開始註冊流程，用戶郵箱:', data.email);
      
      // 檢查郵箱是否已存在
      const existingUser = await db.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        console.log('郵箱已存在:', data.email);
        return { success: false, message: '此郵箱已被註冊' };
      }

      // 加密密碼
      console.log('正在加密密碼...');
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // 插入新用戶
      console.log('正在插入新用戶數據...');
      const newUserRaw = await db.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          role: 'user',
        },
      });
      const newUser = fixUserRole(newUserRaw);

      console.log('新用戶創建成功:', { id: newUser.id, email: newUser.email });

      // 生成 JWT
      const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
      console.log('[register] 產生 token:', token);

      return {
        success: true,
        message: '註冊成功',
        user: newUser,
        token
      };
    } catch (error: any) {
      console.error('註冊錯誤:', error);
      console.error('錯誤詳情:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack
      });
      return { success: false, message: '註冊過程中發生錯誤' };
    }
  }

  static async login(data: LoginFormData): Promise<AuthResponse & { isPasswordCorrect?: boolean, user?: any }> {
    try {
      console.log('[login] process.env.JWT_SECRET:', process.env.JWT_SECRET);
      console.log('[login] JWT_SECRET:', JWT_SECRET);
      // 查找用戶
      const userRaw = await db.user.findUnique({ where: { email: data.email } });
      if (!userRaw) {
        return { success: false, message: "帳號不存在" };
      }
      const user = fixUserRole(userRaw);

      // 驗證密碼
      const isValid = await bcrypt.compare(data.password, user.password);
      if (!isValid) {
        return { success: false, user, isPasswordCorrect: false, message: "密碼錯誤" };
      }

      // 生成 JWT
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      console.log('[login] 產生 token:', token);

      return {
        success: true,
        message: '登入成功',
        user,
        token,
        isPasswordCorrect: true
      };
    } catch (error) {
      console.error('登入錯誤:', error);
      return { success: false, message: '登入過程中發生錯誤' };
    }
  }

  static async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
    try {
      console.log('[verifyToken] process.env.JWT_SECRET:', process.env.JWT_SECRET);
      console.log('[verifyToken] JWT_SECRET:', JWT_SECRET);
      console.log('[verifyToken] 收到 token:', token);
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
      console.log('[verifyToken] 解碼結果:', decoded);
      const userRaw = await db.user.findUnique({ where: { id: decoded.id } });
      console.log('[verifyToken] 查到的 user:', userRaw);
      if (!userRaw) return { valid: false };
      const user = fixUserRole(userRaw);
      return { valid: true, user };
    } catch (error) {
      console.error('[verifyToken] token 驗證失敗:', error);
      return { valid: false };
    }
  }

  static async getUserById(id: number): Promise<User | null> {
    try {
      const userRaw = await db.user.findUnique({ where: { id } });
      if (!userRaw) return null;
      return fixUserRole(userRaw);
    } catch (error) {
      console.error('獲取用戶錯誤:', error);
      return null;
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 這裡可以呼叫 AuthService.login 或你自己的驗證邏輯
        if (!credentials) return null
        const result = await AuthService.login({
          email: credentials.email,
          password: credentials.password
        })
        if (result.success && result.user) {
          return result.user
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token && token.sub) {
        (session.user as any).id = token.sub
      }
      return session
    }
  },
  // 其他 next-auth 設定
} 