# nadu-website-main

## 專案簡介
本專案為一個以 Next.js + Prisma + Tailwind CSS 為主的現代化電商網站，支援用戶註冊、登入、商品瀏覽、購物車、訂單管理、後台管理等功能。資料庫採用 SQLite，並以 Prisma 作為 ORM 工具。

---

```
.
├── app/                        # Next.js 應用主目錄，所有頁面、API 路由、前後台功能都在這
│   ├── api/                    # API 路由，處理後端請求（如用戶、商品、訂單等 API）
│   ├── admin/                  # 後台管理頁面（僅管理員可進入）
│   ├── account/                # 用戶帳號相關頁面（如個人資料、訂單查詢）
│   ├── cart/                   # 購物車頁面
│   ├── category/               # 商品分類頁面
│   ├── checkout/               # 結帳流程頁面
│   ├── favorites/              # 收藏清單頁面
│   ├── login/                  # 登入頁面
│   ├── product/                # 商品詳細頁面
│   ├── search/                 # 搜尋頁面
│   ├── page.tsx                # 首頁（Next.js 預設進入點）
│   ├── layout.tsx              # 全域佈局（如 header/footer）
│   └── loading.tsx             # 全域 loading 畫面
├── components/                 # 可重用的 React 元件
│   ├── ui/                     # UI 原子元件（按鈕、輸入框等）
│   ├── product-card.tsx        # 商品卡片元件
│   ├── review-form.tsx         # 商品評論表單
│   ├── site-header.tsx         # 網站頂部導覽列
│   ├── cart-dropdown.tsx       # 購物車下拉選單
│   ├── search-input.tsx        # 搜尋輸入框
│   ├── line-qr-dialog.tsx      # Line QR 彈窗
│   └── ...                     # 其他元件
├── hooks/                      # 自訂 React hooks（如 useAuth、useToast 等）
│   ├── useAuth.ts              # 驗證用 hook
│   ├── use-mobile.tsx          # 行動裝置判斷 hook
│   └── use-toast.ts            # Toast 訊息 hook
├── lib/                        # 工具與服務（如認證、資料庫、共用函式）
│   ├── auth.ts                 # 認證與權限相關邏輯
│   ├── db.ts                   # Prisma 資料庫連線
│   ├── data.ts                 # 靜態資料或假資料
│   ├── types.ts                # 共用型別
│   └── utils.ts                # 共用工具函式
├── prisma/                     # Prisma ORM 設定與資料庫 schema
│   ├── schema.prisma           # Prisma 資料庫 schema 定義
│   ├── nadu.db                 # SQLite 資料庫檔案
│   └── migrations/             # 資料庫遷移紀錄
├── public/                     # 靜態資源（圖片、影片、icon 等）
│   ├── images/                 # 圖片資源
│   ├── videos/                 # 影片資源
│   ├── placeholder-logo.png    # 預設 logo
│   └── ...                     # 其他靜態檔案
├── styles/                     # 全域 CSS 樣式
│   └── globals.css             # 全域樣式檔
├── types/                      # TypeScript 型別定義
│   ├── next-auth.d.ts          # next-auth 型別擴充
│   └── env.d.ts                # 環境變數型別
├── middleware.ts               # Next.js 中介層，負責權限驗證與路由保護
├── package.json                # 專案依賴、scripts、專案資訊
├── tailwind.config.ts          # Tailwind CSS 設定檔
├── tsconfig.json               # TypeScript 設定檔
├── postcss.config.mjs          # PostCSS 設定檔
├── next.config.mjs             # Next.js 設定檔
├── .gitignore                  # Git 忽略清單
└── README.md                   # 專案說明文件
```

---

### 各目錄/檔案用途補充

- **app/api/**：所有 API 路由都放這裡，前端可直接呼叫 `/api/xxx`，例如用戶註冊、登入、商品查詢、下單等。
- **app/admin/**：後台管理介面，僅限有管理員權限的用戶進入，通常包含商品管理、訂單管理、用戶管理等功能頁面。
- **app/account/**：用戶個人中心，包含個人資料編輯、訂單查詢、密碼變更等。
- **app/cart/**：購物車頁面，顯示用戶已加入的商品，可進行數量調整、刪除、前往結帳。
- **app/category/**：商品分類頁面，依據不同分類顯示商品清單。
- **app/checkout/**：結帳流程頁面，填寫收件資訊、選擇付款方式、確認訂單。
- **app/favorites/**：收藏清單頁面，顯示用戶收藏的商品。
- **app/login/**：登入頁面，支援帳號密碼登入。
- **app/product/**：商品詳細頁面，顯示單一商品資訊、評論、加入購物車等功能。
- **app/search/**：搜尋頁面，支援關鍵字搜尋商品。
- **app/page.tsx**：網站首頁，通常顯示主打商品、活動、橫幅等。
- **app/layout.tsx**：全域佈局，包含 header、footer、全站樣式。
- **app/loading.tsx**：全域 loading 畫面，提升使用者體驗。
- **components/ui/**：最基礎的 UI 元件，方便全站統一風格，例如按鈕、輸入框、Modal 等。
- **components/product-card.tsx**：商品卡片元件，商品列表常用。
- **components/review-form.tsx**：商品評論表單，供用戶撰寫評論。
- **components/site-header.tsx**：網站頂部導覽列，含 logo、主選單、登入狀態等。
- **components/cart-dropdown.tsx**：購物車下拉選單，快速檢視購物車內容。
- **components/search-input.tsx**：搜尋輸入框，支援自動完成等功能。
- **components/line-qr-dialog.tsx**：Line QR 彈窗，行銷或客服用。
- **hooks/useAuth.ts**：用戶登入狀態、權限驗證 hook。
- **hooks/use-mobile.tsx**：偵測是否為行動裝置，做響應式調整。
- **hooks/use-toast.ts**：全站 toast 訊息 hook。
- **lib/auth.ts**：所有登入、註冊、JWT 驗證、權限判斷邏輯。
- **lib/db.ts**：Prisma 資料庫連線設定。
- **lib/data.ts**：靜態資料或假資料，方便開發測試。
- **lib/types.ts**：共用型別定義。
- **lib/utils.ts**：共用工具函式。
- **prisma/schema.prisma**：定義所有資料表、欄位、關聯，修改後要 `npx prisma migrate dev`。
- **prisma/nadu.db**：預設 SQLite 資料庫檔案。
- **prisma/migrations/**：資料庫遷移紀錄，每次 schema 變動都會產生一個資料夾。
- **public/**：放置不需經過 Webpack 處理的靜態檔案，網址直接 `/images/xxx.png`。
- **public/images/**：網站用圖片。
- **public/videos/**：網站用影片。
- **public/placeholder-logo.png**：預設 logo。
- **styles/globals.css**：全站共用 CSS，Tailwind 基礎設定也會在這。
- **types/next-auth.d.ts**：next-auth 型別擴充。
- **types/env.d.ts**：環境變數型別。
- **middleware.ts**：自訂權限控管，保護特定路徑，未授權會自動導向登入或首頁。
- **package.json**：記錄所有 npm 套件、啟動/建置指令、專案名稱等。
- **tailwind.config.ts**：Tailwind CSS 設定檔。
- **tsconfig.json**：TypeScript 設定檔。
- **postcss.config.mjs**：PostCSS 設定檔。
- **next.config.mjs**：Next.js 設定檔。
- **.gitignore**：Git 忽略清單。
- **README.md**：專案說明文件。

---

## 安裝與啟動

### 1. 安裝套件
> **請務必使用 `--legacy-peer-deps` 參數安裝，避免相依性衝突！**

```bash
npm install --legacy-peer-deps
# 或
yarn install --legacy-peer-deps
# 或
pnpm install --legacy-peer-deps
```

### 2. 設定環境變數
請在專案根目錄建立 `.env` 檔案，內容範例：
```
DATABASE_URL="file:./prisma/nadu.db"
JWT_SECRET="your-secret-key"
```

### 3. 資料庫遷移與 Prisma 操作

#### 初始化 Prisma
```bash
npx prisma generate
```

#### 建立/更新資料庫
```bash
npx prisma migrate dev --name init
```

#### 開啟 Prisma Studio（可視化管理 DB）
```bash
npx prisma studio
```

#### 更新 Prisma Client（schema 有變動時）
```bash
npx prisma generate
```

---

## 專案啟動

### 開發模式
```bash
npm run dev
```

### 正式建置
```bash
npm run build
npm start
```

---

## 使用者權限說明

- **一般用戶（user）**：可註冊、登入、瀏覽商品、下單、查詢個人訂單。
- **管理員（store_owner, vendor）**：可進入 `/admin` 後台，管理商品、訂單、用戶等。
- **權限控管**：  
  - 受保護路徑（如 `/dashboard`, `/profile`, `/admin`）需登入才可存取。
  - `/admin` 僅限 `store_owner` 或 `vendor` 角色進入，否則會自動導回首頁。
  - 權限驗證採用 JWT，token 會存於 cookie。

---

## 常用語法教學

### Prisma 相關
- **開啟 Prisma Studio**  
  `npx prisma studio`
- **執行資料庫遷移**  
  `npx prisma migrate dev --name <migration-name>`
- **更新 Prisma Client**  
  `npx prisma generate`
- **修改 schema 後記得重新 migrate/generate！**

### Next.js
- **開發模式**  
  `npm run dev`
- **建置專案**  
  `npm run build`
- **啟動正式伺服器**  
  `npm start`

### Tailwind CSS
- 設定檔於 `tailwind.config.ts`，可自訂主題、斷點等。

---

## 重要套件一覽

- `next`：React 應用框架
- `prisma` / `@prisma/client`：ORM 與 DB 操作
- `next-auth`：用戶認證
- `tailwindcss`：CSS 框架
- `@radix-ui/*`：UI 元件
- `bcryptjs`：密碼加密
- `jsonwebtoken` / `jose`：JWT 處理
- 其他請參考 `package.json`

---

## 其他注意事項

- **如遇到安裝衝突，請務必加上 `--legacy-peer-deps`。**
- **資料庫預設為 SQLite，若需更換請修改 `.env` 及 `prisma/schema.prisma`。**
- **如需擴充權限，請調整 `middleware.ts` 及 `lib/auth.ts`。**
- **開發時建議安裝 VSCode 並搭配 Prisma、Tailwind、ESLint 等插件。**


