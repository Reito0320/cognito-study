'use client';

import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { useAuthFlow } from '../components/auth-provider';
import { LoginForm } from './login-form';

export default function Page() {
  const { email, setEmail, setNextStep } = useAuthFlow();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      setNextStep(null);
      // [COGNITO C05 START]
      // TODO C05: ここでsignIn({ username: email, password })を呼びます。
      // isSignedInがtrueなら/homeへ進みます。
      // falseならnextStepをsetNextStep(nextStep)で保存し、この場で分岐します。
      // CONTINUE_SIGN_IN_WITH_TOTP_SETUP → /mfa/setup
      // CONFIRM_SIGN_IN_WITH_TOTP_CODE → /mfa
      // CONFIRM_SIGN_UP → /verify
      // 必要なimport: signIn（aws-amplify/auth）、useRouter（next/navigation）。
      // useRouter()はPageの先頭で呼びます。共通の認証関数は作りません。
      throw new Error('TODO C05: メールアドレスとパスワードを使ったログインは未実装です。');
      // [COGNITO C05 END]
      // [LAMBDA L02 START]
      // TODO: Lambda経由で実装する場合の処理をここに記述（Cognito直接呼び出しとの二重実行はしない）。
      // [LAMBDA L02 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証処理に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="login"><LoginForm email={email} password={password}
    onEmailChange={setEmail} onPasswordChange={setPassword} onSubmit={handleLogin}
    isSubmitting={isSubmitting} error={error} message="" /></AuthScreen>;
}
