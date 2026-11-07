'use client';

import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { CodeForm } from '../components/code-form';

export default function Page() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleMfa(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      // [COGNITO C08 START]
      // TODO C08: confirmSignIn({ challengeResponse: code })を呼びます。
      // isSignedInがtrueなら/homeへ進みます。
      // useAuthFlowからsetNextStepを受け取り、setNextStep(null)で共有値を消します。
      // confirmSignInとuseRouterをimportし、Pageの先頭でrouterを用意します。
      throw new Error('TODO C08: MFAコードの確認と認証結果に応じた画面遷移は未実装です。');
      // [COGNITO C08 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証処理に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="mfa" description="登録済みの認証アプリに表示されたコードを入力してください。">
    <CodeForm code={code} onCodeChange={setCode} onSubmit={handleMfa}
      label="認証アプリのコード" action="認証する"
      hint="認証アプリの最新の6桁コードを入力してください。"
      isSubmitting={isSubmitting} error={error} message="" />
  </AuthScreen>;
}
