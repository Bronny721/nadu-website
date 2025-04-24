# Nadu 網站專案

這是一個使用 Next.js 15 和 React 19 開發的現代化網站專案，採用了最新的網頁開發技術和工具。

## 技術棧

- Next.js 15.2.4
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod 表單驗證
- 其他現代化 UI 組件

## 開始使用

### 系統要求

- Node.js 18.0.0 或更高版本
- npm 或 pnpm（推薦使用 pnpm）

### 安裝步驟

1. 克隆專案到本地：
```bash
git clone https://github.com/yourusername/nadu-website.git
cd nadu-website
```

2. 安裝依賴：
使用 npm：
```bash
npm install
```
或使用 pnpm（推薦）：
```bash
pnpm install
```

3. 啟動開發服務器：
```bash
npm run dev
# 或
pnpm dev
```

4. 開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 可用的命令

- `npm run dev` 或 `pnpm dev` - 啟動開發服務器
- `npm run build` 或 `pnpm build` - 建構生產版本
- `npm run start` 或 `pnpm start` - 啟動生產服務器
- `npm run lint` 或 `pnpm lint` - 執行程式碼檢查

## 專案結構

```
nadu-website/
├── app/             # Next.js 應用程式主要目錄
├── components/      # React 組件
├── hooks/          # 自定義 React Hooks
├── lib/            # 工具函數和共用邏輯
├── public/         # 靜態資源
└── styles/         # 樣式文件
```

## 開發指南

- 本專案使用 TypeScript 進行開發，請確保所有新的程式碼都包含適當的類型定義
- 使用 Tailwind CSS 進行樣式設計
- 遵循 ESLint 規則進行程式碼風格統一
- 組件開發使用 Radix UI 作為基礎 UI 庫

## 生產環境部署

建構生產版本：
```bash
npm run build
# 或
pnpm build
```

啟動生產服務器：
```bash
npm run start
# 或
pnpm start
```

## 貢獻指南

1. Fork 本專案
2. 創建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 授權

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解更多詳情。 