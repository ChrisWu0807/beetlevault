# BeetleVault（甲蟲庫）

甲蟲玩家的專屬紀錄與展示平台。建立個人甲蟲收藏紀錄，管理品種、血統、羽化日期等詳細資訊，並可一鍵上架展示你的珍貴收藏。

## 🚀 功能特色

- **詳細紀錄**：記錄品種、血統、羽化日期、備註等完整資訊
- **照片管理**：上傳甲蟲照片，建立視覺化的收藏展示
- **一鍵上架**：輕鬆切換上架狀態，與其他玩家分享收藏
- **公開瀏覽**：搜尋、篩選其他玩家的公開收藏
- **安全認證**：自建帳號系統，保護個人資料

## 🛠 技術架構

- **前端**：Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **後端**：Next.js API Routes
- **資料庫**：MySQL + Prisma ORM
- **認證**：自建簡易帳號系統 (bcrypt + cookie session)
- **表單驗證**：React Hook Form + Zod
- **部署**：Zeabur

## 📋 系統需求

- Node.js 18+
- MySQL 8.0+
- npm/yarn/pnpm

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 環境設定

複製環境變數範例檔案：

```bash
cp env.example .env
```

編輯 `.env` 檔案，設定資料庫連線：

```env
# 本機開發用
DATABASE_URL="mysql://root:password@localhost:3306/beetlevault"
APP_BASE_URL="http://localhost:3000"
SESSION_SECRET="your-secret-key-here"
```

### 3. 資料庫設定

```bash
# 生成 Prisma Client
npm run prisma:generate

# 推送資料庫 schema
npm run db:push

# 建立種子資料（可選）
npm run db:seed
```

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 📊 種子資料

執行 `npm run db:seed` 後會建立測試帳號：

**測試帳號 1：**
- Email: `demo@beetlevault.com`
- Password: `password123`

**測試帳號 2：**
- Email: `test@example.com`
- Password: `password123`

種子資料包含 5 筆甲蟲紀錄，涵蓋常見品種如獨角仙、鍬形蟲、長戟大兜蟲等。

## 🏗 專案結構

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認證相關頁面
│   ├── (private)/         # 需要登入的頁面
│   ├── (public)/          # 公開頁面
│   └── api/               # API 路由
├── components/            # React 元件
├── lib/                   # 工具函數
└── styles/               # 樣式檔案
```

## 🔧 可用指令

```bash
# 開發
npm run dev              # 啟動開發伺服器
npm run build            # 建置生產版本
npm run start            # 啟動生產伺服器
npm run lint             # 程式碼檢查

# 資料庫
npm run db:push          # 推送 schema 到資料庫
npm run prisma:generate  # 生成 Prisma Client
npm run prisma:studio    # 開啟 Prisma Studio
npm run db:seed          # 建立種子資料
```

## 🌐 部署到 Zeabur

### 1. 準備部署

1. 將程式碼推送到 Git 倉庫
2. 在 Zeabur 建立新專案
3. 連接 Git 倉庫

### 2. 設定環境變數

在 Zeabur 專案設定中新增以下環境變數：

```env
# 資料庫連線（由 Zeabur 自動注入）
MYSQL_PORT=${DATABASE_PORT}
PASSWORD=lZAUgN25x80t6B9J7D1L43fPrIYqdRnC
MYSQL_ROOT_PASSWORD=${PASSWORD}
MYSQL_USERNAME=root
MYSQL_DATABASE=zeabur
MYSQL_HOST=${CONTAINER_HOSTNAME}
MYSQL_PASSWORD=${MYSQL_ROOT_PASSWORD}

# 應用程式設定
DATABASE_URL="mysql://${MYSQL_USERNAME}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}"
APP_BASE_URL="https://your-domain.zeabur.app"
SESSION_SECRET="your-production-secret-key"
```

### 3. 建置設定

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 4. 部署後設定

部署完成後，在 Zeabur 控制台執行資料庫遷移：

```bash
npm run db:push
npm run db:seed
```

## 📱 主要頁面

- **首頁** (`/`)：產品介紹與登入/註冊入口
- **註冊** (`/sign-up`)：建立新帳號
- **登入** (`/sign-in`)：登入現有帳號
- **我的收藏室** (`/dashboard`)：管理個人甲蟲紀錄
- **新增甲蟲** (`/beetles/new`)：建立新的甲蟲紀錄
- **編輯甲蟲** (`/beetles/[id]/edit`)：修改現有紀錄
- **公開瀏覽** (`/browse`)：瀏覽其他玩家的公開收藏
- **甲蟲詳情** (`/beetle/[id]`)：查看單筆甲蟲詳情

## 🔐 API 端點

### 認證
- `POST /api/auth/signup` - 註冊
- `POST /api/auth/login` - 登入
- `GET /api/auth/me` - 取得當前用戶
- `POST /api/auth/logout` - 登出

### 甲蟲管理（需登入）
- `GET /api/beetles` - 取得自己的甲蟲列表
- `POST /api/beetles` - 建立新甲蟲
- `GET /api/beetles/[id]` - 取得單筆甲蟲
- `PATCH /api/beetles/[id]` - 更新甲蟲
- `DELETE /api/beetles/[id]` - 刪除甲蟲

### 公開 API
- `GET /api/public/beetles` - 取得公開甲蟲列表
- `GET /api/public/beetles/[id]` - 取得公開甲蟲詳情

### 檔案上傳
- `POST /api/upload` - 上傳圖片

## 🎯 驗收條件

- ✅ 註冊/登入/登出功能正常
- ✅ 新增/編輯/刪除甲蟲紀錄
- ✅ 一鍵上架/下架功能
- ✅ 公開瀏覽與搜尋功能
- ✅ 圖片上傳與顯示
- ✅ 響應式設計
- ✅ 資料庫連線與遷移
- ✅ 部署到 Zeabur

## 🚧 後續規劃

- **血統家譜**：建立親緣關係圖
- **提醒系統**：羽化、換土時間提醒
- **金流整合**：支付與訂單系統
- **物件儲存**：圖片上傳改為 S3/R2
- **SEO 優化**：結構化資料與 OG 標籤
- **店家版**：B2B 多帳號管理

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**BeetleVault** - 讓每隻甲蟲都有專屬的數位檔案 🪲
