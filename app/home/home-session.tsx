'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAuthSession, signOut } from 'aws-amplify/auth';
import { useAuthFlow } from '../components/auth-provider';

export function HomeSession({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setNextStep } = useAuthFlow();
  const [userInfo, setUserInfo] = useState('セッションを確認中…');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [COGNITO C10 START]
  // C10: セッションを確認し、IDトークンのメールアドレスを表示します。
  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const { tokens } = await fetchAuthSession();
        if (!active) return;
        if (tokens?.idToken) {
          setUserInfo(String(tokens.idToken.payload.email ?? 'ユーザー'));
        } else {
          router.replace('/login');
        }
      } catch (error) {
        if (active) setError(error instanceof Error ? error.message : 'セッションの確認に失敗しました。');
      }
    }
    void loadSession();
    return () => { active = false; };
  }, [router]);
  // [COGNITO C10 END]

  async function handleSignOut() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('');
    try {
      // [COGNITO C11 START]
      // C11: signOut({ global: true })でサインアウトし、共有状態を消して/loginへ移動してください。
      await signOut({ global: true });
      setNextStep(null);
      setUserInfo('サインアウトしました。');
      router.replace('/login');
      // [COGNITO C11 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : 'サインアウトに失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cognito-100 bg-cognito-50 px-6 py-3 text-sm text-cognito-900">
      <p>{userInfo}</p>
      <button type="button" onClick={handleSignOut} disabled={isSubmitting} className="underline disabled:opacity-50">サインアウト</button>
      {error && <p role="alert" className="form-error w-full">{error}</p>}
    </div>
    {children}
  </>;
}
