"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Product } from "@/lib/types"
// 引入 User 類型以便在 AuthContext 中使用
// import { User } from "./auth-context"; // 移除這行，User 介面已在下方定義

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
  slug: string
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  totalPrice: number
  addItem: (product: Product, quantity?: number, variant?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ... existing code ...
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean; // 表示認證狀態是否正在載入中
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string; message?: string }>;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 新增載入狀態

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('[AuthContext] 嘗試從 Local Storage 載入 token...');

    if (token) {
      console.log('[AuthContext] 找到 token，嘗試驗證...');
      // 呼叫後端 API 驗證 token
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            console.log('[AuthContext] token 驗證成功，獲取使用者資料:', data.user);
            setUser(data.user); // 設定使用者狀態

            // --- 新增測試：在 token 驗證成功後，立即呼叫訂單 API ---
            // try {
            //     console.log('[AuthContext] 嘗試在驗證成功後立即呼叫訂單 API...');
            //     const ordersTestRes = await fetch("/api/account/orders", {
            //         credentials: "include",
            //     });

            //     if (ordersTestRes.ok) {
            //         const ordersTestData = await ordersTestRes.json();
            //         console.log('[AuthContext] 立即呼叫訂單 API 成功，獲取數據:', ordersTestData);
            //     } else {
            //         const errorData = await ordersTestRes.json();
            //         console.error('[AuthContext] 立即呼叫訂單 API 失敗，狀態碼:', ordersTestRes.status, "錯誤信息:", errorData);
            //     }
            // } catch (testError) {
            //     console.error('[AuthContext] 立即呼叫訂單 API 時發生錯誤:', testError);
            // }
            // --- 測試結束 ---

          } else {
            console.log('[AuthContext] token 驗證失敗，清除 Local Storage');
            localStorage.removeItem('token'); // Token 無效，清除它
            setUser(null); // 清除使用者狀態
          }
        })
        .catch(error => {
          console.error('[AuthContext] token 驗證 API 呼叫失敗:', error);
          localStorage.removeItem('token'); // API 呼叫失敗，清除 Token
          setUser(null); // 清除使用者狀態
          // 這裡可以選擇性地設定一個錯誤狀態，並向使用者顯示錯誤訊息
        })
        .finally(() => {
          setIsLoading(false); // 驗證完成，設定載入狀態為 false
        });
    } else {
      console.log('[AuthContext] 未找到 token，設定載入狀態為 false');
      setIsLoading(false); // 沒有 token，直接設定載入狀態為 false
    }
  }, []); // 空依賴陣列表示只在元件掛載時執行一次

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("login response", data);
      if (res.ok) {
        // 假設後端登入成功時回傳 token 和 user 資訊
        if (data.token && data.user) {
           localStorage.setItem("token", data.token); // 儲存 token
           localStorage.setItem("user", JSON.stringify(data.user)); // 儲存使用者資訊
           console.log("使用者資訊和 token 已儲存到 Local Storage:", data.user);
           setUser(data.user);
           return { success: true, role: data.user.role };
        } else {
           // 後端登入成功但沒有回傳 token 或 user，這可能是問題，設定為失敗
            console.error("Login successful but missing token or user data from API");
            return { success: false, message: "登入成功但數據不完整" };
        }

      }
      return { success: false, message: data.message };
    } catch (error) {
      console.error("登入錯誤:", error);
      return { success: false, message: "登入過程中發生錯誤" };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      })

      if (!res.ok) {
        throw new Error("註冊失敗")
      }

      const data = await res.json()
      return data.success
    } catch (error) {
      console.error("註冊錯誤:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("[AuthContext] 正在登出...");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // 可以選擇性地呼叫後端登出 API 來使伺服器端的 Session 失效
    // fetch("/api/auth/logout", { method: "POST" }).catch(console.error);
    console.log("[AuthContext] 使用者資訊和 token 已從 Local Storage 移除");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
