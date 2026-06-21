# template-nextjs-dynamic ハンズオン

このテンプレートは、ログイン・データ保存・管理画面・SaaSの試作に使う動的サイトスターターです。

## できあがるもの

- Next.js App Routerのアプリ
- Supabase AuthによるMagic Link / Googleログイン
- Cloudflare D1のSQLiteデータベース
- Drizzle ORMによる型付きDB操作
- `item` テーブルを使った最小APIサンプル
- Cloudflare Pagesへの公開

## 1. テンプレートからリポジトリを作る

```bash
gh repo create biki-cloud/my-new-app --template biki-cloud/template-nextjs-dynamic --private
git clone https://github.com/biki-cloud/my-new-app.git
cd my-new-app
```

`my-new-app` は作りたいサービス名に置き換えてください。

## 2. 依存関係を入れる

```bash
pnpm install
```

このテンプレートは `pnpm` 前提です。

## 3. 設定ファイルを作る

```bash
cp .env.example .env.development
cp .env.example .env.production
cp wrangler.toml.example wrangler.toml.development
cp wrangler.toml.example wrangler.toml.production
```

`pnpm dev` や `pnpm pages:deploy` は、必要な設定ファイルを `.env` / `wrangler.toml` にコピーしてから実行する設計です。

## 4. Supabase Authを作る

Supabaseで新規プロジェクトを作成し、以下を取得します。

| 値 | 場所 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings > API > anon public |

`.env.development` と `.env.production` に入れます。

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

`.env.example` にはビルド確認用のダミー値が入っています。ログインを実際に動かす前に、必ず自分のSupabaseプロジェクトの値へ置き換えてください。

Magic Linkだけ使う場合はこれで動きます。Googleログインを使う場合は、SupabaseのAuthentication ProvidersでGoogle providerを有効化し、Google Cloud側のOAuth設定も追加します。

認証後のリダイレクトURL:

```text
http://localhost:3000/auth/callback
https://your-domain.example/auth/callback
```

## 5. Cloudflare D1を作る

開発用と本番用を分けるのが安全です。

```bash
pnpm exec wrangler d1 create my-new-app-dev-db
pnpm exec wrangler d1 create my-new-app-prod-db
```

出力された `database_id` を `wrangler.toml.development` と `wrangler.toml.production` に入れます。

```toml
name = "my-new-app"

[[d1_databases]]
binding = "DB"
database_name = "my-new-app-dev-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
preview_database_id = "DB"
migrations_dir = "migrations"
```

本番用ファイルでは `database_name` と `database_id` を本番DBにします。

## 6. DBマイグレーションを適用する

ローカル開発用:

```bash
pnpm db:migrate:dev
```

本番DB:

```bash
pnpm db:migrate:prod
```

初期状態では以下の2テーブルが作られます。

| テーブル | 用途 |
| --- | --- |
| `profile` | Supabase AuthのユーザーIDに紐づくプロフィール |
| `item` | TODO、投稿、商品、案件などに転用できる最小サンプル |

## 7. 開発サーバーを起動する

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` を開きます。

確認するポイント:

- `/auth` でMagic Linkを送れる
- 認証後に `/home` へ移動する
- `/api` が `{ ok: true }` を返す
- `/api/items?userId=任意のID` がJSONを返す

## 8. 最初に変更するファイル

| ファイル | 変更内容 |
| --- | --- |
| `src/app/layout.tsx` | アプリ名、説明、OGP、PWA名 |
| `public/manifest.json` | PWA表示名 |
| `src/app/home/page.tsx` | ログイン後のメイン画面 |
| `src/server/db/schema.ts` | DBテーブル定義 |
| `src/server/functions/items.ts` | DB操作 |
| `src/app/api/items/route.ts` | API |

まずは `item` を自分のサービスの中心データに置き換えるのが一番早いです。

例:

- TODOアプリなら `item` のまま使う
- 掲示板なら `post`
- 予約管理なら `reservation`
- 顧客管理なら `client`
- 商品管理なら `product`

## 9. スキーマを変更する流れ

`src/server/db/schema.ts` を編集します。

```ts
export const itemTable = sqliteTable('item', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  body: text('body'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
```

変更後、migrationを生成します。

```bash
pnpm db:generate
```

ローカルに適用します。

```bash
pnpm db:migrate:dev
```

本番に反映する前に、必ずローカルで画面とAPIを確認します。

## 10. Cloudflare Pagesへデプロイする

```bash
pnpm pages:deploy
```

Cloudflareの環境変数にもSupabaseの値を設定します。

| 変数 | 値 |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |

D1 bindingは `wrangler.toml.production` の `binding = "DB"` と同じ名前にします。

## 11. 納品前・公開前チェック

```bash
pnpm build
pnpm pages:build
```

確認項目:

- buildが成功する
- ログイン・ログアウトできる
- 認証後のリダイレクトURLが本番ドメインに対応している
- D1 migrationが本番DBに適用済み
- `/api` と主要APIがCloudflare上で動く
- `.env.production` に秘密情報を入れてコミットしていない

## 使用プラットフォームについて

静的サイトはCloudflare Pagesで問題ありません。

Next.jsの動的サイトは、このテンプレートでは既存構成に合わせて Cloudflare Pages + `@cloudflare/next-on-pages` を使っています。一方、Cloudflareの現在のNext.jsガイドでは `@opennextjs/cloudflare` とWorkers構成が案内されています。新規の本格SaaSでは、将来的にWorkers + OpenNext構成へ寄せる余地があります。

当面は、このテンプレートを小規模な認証付きアプリや検証用SaaSのスターターとして使い、案件化・長期運用が見えた段階でWorkers + OpenNextへの移行を検討するのが現実的です。

## よくある詰まりどころ

### `.env` がないと言われる

`pnpm dev` は `setup:dev` を実行して `.env.development` を `.env` にコピーします。先に `.env.development` を作ってください。

### D1のDB名とbinding名が分からない

コードでは `binding = "DB"` を使います。`database_name` はCloudflare上のDB名、`database_id` はDB作成時に発行されるUUIDです。

### ローカルDBを直接見たい

```bash
pnpm db:studio:dev
```

ローカルD1のSQLiteファイルをDrizzle Studioで開きます。

### Googleログインだけ動かない

Supabase側のGoogle provider設定、Google Cloud側のOAuth redirect URI、本番ドメインのリダイレクト許可を確認してください。Magic Linkが動くなら、Supabase接続自体はできています。
