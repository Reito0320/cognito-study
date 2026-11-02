'use client';

import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { useAuthFlow } from '../components/auth-provider';
import { authErrorMessage } from '@/lib/auth-flow';
import { LoginForm } from './login-form';

export default function Page() {
  const { email, setEmail, clearChallenge } = useAuthFlow();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      clearChallenge();
      // [COGNITO C05 START]
      // TODO C05: メールアドレスとパスワードを使ったログインを実装してください。
      throw new Error('TODO C05: メールアドレスとパスワードを使ったログインは未実装です。');
      // [COGNITO C05 END]
      // [LAMBDA L02 START]
      // TODO: Lambda経由で実装する場合の処理をここに記述（Cognito直接呼び出しとの二重実行はしない）。
      // [LAMBDA L02 END]
    } catch (error) {
      setError(authErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="login"><LoginForm email={email} password={password}
    onEmailChange={setEmail} onPasswordChange={setPassword} onSubmit={handleLogin}
    isSubmitting={isSubmitting} error={error} message="" /></AuthScreen>;
}
