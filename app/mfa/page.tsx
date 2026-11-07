'use client';

import { useState, type SubmitEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { confirmSignIn } from 'aws-amplify/auth';
import { AuthScreen } from '../components/auth-screen';
import { CodeForm } from '../components/code-form';
import { useAuthFlow } from '../components/auth-provider';

export default function Page() {
  const router = useRouter();
  const { nextStep, setNextStep } = useAuthFlow();
  const hasChallenge = nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleMfa(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !hasChallenge) return;
    setError('');
    setIsSubmitting(true);
    try {
      // [COGNITO C08 START]
      // C08: confirmSignIn({ challengeResponse: code })を呼びます。
      // isSignedInがtrueなら/homeへ進みます。
      // useAuthFlowからsetNextStepを受け取り、setNextStep(null)で共有値を消します。
      // confirmSignInとuseRouterをimportし、Pageの先頭でrouterを用意します。
      const { isSignedIn, nextStep } = await confirmSignIn({ challengeResponse: code });
      if (isSignedIn) {
        setCode('');
        setNextStep(null);
        router.replace('/home');
      } else {
        setNextStep(nextStep);
        throw new Error(`追加の認証が必要です: ${nextStep.signInStep}`);
      }
      // [COGNITO C08 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証処理に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="mfa" description="登録済みの認証アプリに表示されたコードを入力してください。">
    {!hasChallenge && <p className="field-hint" role="status">認証情報がありません。<Link href="/login">ログインからやり直してください。</Link></p>}
    <CodeForm code={code} onCodeChange={setCode} onSubmit={handleMfa} disabled={!hasChallenge}
      label="認証アプリのコード" action="認証する"
      hint="認証アプリの最新の6桁コードを入力してください。"
      isSubmitting={isSubmitting} error={error} message="" />
  </AuthScreen>;
}
