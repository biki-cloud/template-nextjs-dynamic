// DBスキーマの定義
// 新しいテーブルを追加する場合はここに追加してください
// Drizzle ORM ドキュメント: https://orm.drizzle.team/docs/sql-schema-declaration

import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// ユーザープロフィールテーブル（例）
// Supabase Authのuser.idに紐付けて使用します
export const profileTable = sqliteTable('profile', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull().unique(), // Supabase Auth の user.id
  displayName: text('displayName'),
  createdAt: text('createdAt').notNull().default('CURRENT_TIMESTAMP'),
});

// アイテムテーブル（例：TODO / 投稿 / 商品など用途に応じて変更）
export const itemTable = sqliteTable('item', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('userId').notNull(),            // 作成者のSupabase user.id
  title: text('title').notNull(),
  body: text('body'),
  createdAt: text('createdAt').notNull().default('CURRENT_TIMESTAMP'),
});
