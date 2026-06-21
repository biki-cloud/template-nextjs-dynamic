# template-nextjs-dynamic

**Next.js + Cloudflare D1 + Drizzle ORM + Supabase Auth + Cloudflare Pages** の汎用動的サイトテンプレートです。

ログイン機能（Magic Link / Google OAuth）とデータベース（Cloudflare D1）が最初から組み込まれており、会員制サービスやSaaSのベースとして利用できます。

---

## 🧱 技術スタック

| 用途 | ツール |
|------|--------|
| フレームワーク | Next.js 14 (App Router) |
| データベース | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM |
| 認証 | Supabase Auth (Magic Link / Google OAuth) |
| ホスティング | Cloudflare Pages |
| スタイリング | Tailwind CSS v3 |
| パッケージマネージャ | pnpm |

---

## 🚀 新規プロジェクトの作り方

このリポジトリはGitHubテンプレートとして設定されています。

```bash
gh repo create biki-cloud/my-new-app --template biki-cloud/template-nextjs-dynamic --private
```

---

## ⚙️ セットアップ手順

### 1. 環境変数ファイルを作成

```bash
cp .env.example .env.development
cp .env.example .env.production
cp wrangler.toml.example wrangler.toml.development
cp wrangler.toml.example wrangler.toml.production
```

### 2. 各ファイルを編集して必要な値を設定

`.env.development` / `.env.production` に以下を設定：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

`wrangler.toml.development` / `wrangler.toml.production` のDB名を設定：

```toml
name = "my-app"        # ← アプリ名に変更
...
[[d1_databases]]
binding = "DB"
database_name = "my-app-db"   # ← DB名に変更
database_id = "xxxxxxxx"      # ← CloudflareダッシュボードのDB IDに変更
```

### 3. 依存関係のインストール

```bash
pnpm install
```

### 4. DBマイグレーション

```bash
# ローカル開発用DB
pnpm db:migrate:dev

# 本番DB
pnpm db:migrate:prod
```

### 5. 開発サーバー起動

```bash
pnpm dev
```

---

## 📁 主要ディレクトリ構成

```
src/
├── app/
│   ├── layout.tsx          # メタデータ（アプリ名・説明を変更する）
│   ├── page.tsx            # ルート（/home にリダイレクト）
│   ├── home/page.tsx       # ホーム画面（ログイン後のメイン画面）
│   ├── auth/page.tsx       # ログイン画面（Magic Link / Google）
│   └── api/                # APIルート
├── server/
│   └── db/
│       ├── schema.ts       # DBスキーマ（テーブル定義を変更する）
│       └── index.ts        # DB接続
└── lib/
    └── supabase.ts         # Supabaseクライアント
```

---

## 🔧 カスタマイズする主な箇所

| ファイル | 変更内容 |
|----------|----------|
| `src/app/layout.tsx` | アプリ名・メタデータ |
| `src/server/db/schema.ts` | DBテーブル定義 |
| `src/app/home/page.tsx` | メイン画面のUI・ロジック |
| `wrangler.toml.*` | CloudflareのD1 DB名・ID |
| `.env.*` | SupabaseのURLとAPIキー |

---

## 🌐 デプロイ

```bash
pnpm pages:deploy
```
