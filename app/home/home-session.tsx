'use client';

import { useState, type ReactNode } from 'react';

export function HomeSession({ children }: { children: ReactNode }) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [COGNITO C10 START]
  // TODO C10: セッションを確認し、ログイン済みならユーザー情報を表示してください。
  // 未ログインならログイン画面へ移動します。現時点ではUI確認用にそのまま表示します。
  // [COGNITO C10 END]

  async function handleSignOut() {
    setIsSubmitting(true);
    setError('');
    try {
      // [COGNITO C11 START]
      // TODO C11: サインアウトし、共有状態を消してログイン画面へ移動してください。
      throw new Error('TODO C11: サインアウトは未実装です。');
      // [COGNITO C11 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : 'サインアウトを実装してください。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cognito-100 bg-cognito-50 px-6 py-3 text-sm text-cognito-900">
      <p>学習用プレビュー · セッション確認は未実装です</p>
      <button type="button" onClick={handleSignOut} disabled={isSubmitting} className="underline disabled:opacity-50">サインアウト</button>
      {error && <p role="alert" className="form-error w-full">{error}</p>}
    </div>
    {children}
  </>;
}
