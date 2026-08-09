# KSW-METRO

首爾、釜山地鐵中文速查工具。協助旅客定位附近車站、搜尋站名、規劃兩站之間的路線，並快速查看站內無障礙設施與洗手間資訊。

**網站：** [ksw-metro.github.io](https://ksw-metro.github.io/)

## 可以做什麼

- 搜尋首爾與釜山地鐵站：支援中文、韓文、英文拼音與站號。
- 規劃起點到終點的搭乘路線與轉乘方式。
- 使用定位尋找目前附近的地鐵站。
- 依首爾、釜山分區瀏覽路線與完整車站清單。
- 從車站卡片直接以 Naver Map 查詢無障礙設施或洗手間位置。
- 回報站名、翻譯或資料問題；管理者可在後台處理回報。

## 使用網址

| 頁面 | 網址 | 用途 |
| --- | --- | --- |
| 查詢首頁 | [https://ksw-metro.github.io/](https://ksw-metro.github.io/) | 搜尋車站、規劃路線、查看搭車資訊 |
| 管理後台 | [https://ksw-metro.github.io/admin.html](https://ksw-metro.github.io/admin.html) | 管理者登入並處理使用者回報 |

## 技術架構

- **前端與託管：** HTML、CSS、JavaScript、GitHub Pages
- **資料與登入：** Supabase Auth、PostgreSQL 與 Row Level Security
- **地圖查詢：** Naver Map

GitHub Pages 僅提供靜態網頁；問題回報與管理者登入由 Supabase 處理，因此帳號密碼與資料庫管理權限不會放進此 repository。

## 本機執行

需要 Node.js 18 或更新版本。

```bash
npm start
```

開啟 [http://localhost:5173](http://localhost:5173) 即可查看首頁；管理頁為 [http://localhost:5173/admin.html](http://localhost:5173/admin.html)。

## 專案結構

```text
index.html            查詢首頁與地鐵資料
admin.html            管理者登入與回報處理頁
supabase-config.js    Supabase 專案網址與 publishable key
supabase-client.js    Supabase 前端連線邏輯
supabase/schema.sql   資料表、權限與管理者設定 SQL
server.js             本機開發伺服器
```

## Supabase 設定

若要建立新的 Supabase 專案：

1. 在 Supabase SQL Editor 執行 [`supabase/schema.sql`](supabase/schema.sql)。
2. 在 Supabase Auth 建立管理者 email 與密碼。
3. 執行 `schema.sql` 最後提供的管理者授權 `insert` 範例，將 email 換成該管理者帳號。
4. 將 Supabase Project URL 與 **publishable key** 填入 `supabase-config.js`。

請勿將 `service_role` key、資料庫密碼或其他私密金鑰提交到 GitHub。`publishable key` 可安全放在前端；資料存取權限應由資料庫的 Row Level Security 控制。

## 部署

GitHub Pages 目前從 `main` 分支的根目錄部署，公開網址為 [https://ksw-metro.github.io/](https://ksw-metro.github.io/)。

```bash
git add .
git commit -m "Describe your change"
git push origin main
```
