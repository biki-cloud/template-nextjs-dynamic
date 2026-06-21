'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            {/* ⚠️ アプリ名を変更してください */}
            アプリ名
          </h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-500">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/auth')}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
              >
                ログイン
              </button>
            )}
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        {user ? (
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-2 text-lg font-semibold text-gray-800">ようこそ 👋</h2>
              <p className="text-gray-600">
                ログイン中: <span className="font-medium text-blue-600">{user.email}</span>
              </p>
            </div>

            {/* ダッシュボードのコンテンツをここに追加 */}
            {/* 例: アイテム一覧、統計、設定など */}
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-400">
                ここにメインコンテンツを実装してください
              </p>
              <p className="mt-2 text-sm text-gray-400">
                src/app/home/page.tsx を編集
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              {/* ⚠️ アプリの説明に変更してください */}
              アプリの説明をここに書きましょう
            </h2>
            <p className="mb-8 text-gray-500">
              ログインするとすべての機能が使えます。
            </p>
            <button
              onClick={() => router.push('/auth')}
              className="rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700"
            >
              ログイン / 新規登録
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
