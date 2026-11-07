'use client';

import { useState, type SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'aws-amplify/auth';
import { AuthScreen } from '../components/auth-screen';
import { useAuthFlow } from '../components/auth-provider';
import { LoginForm } from './login-form';

export default function Page() {
  const router = useRouter();
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
      // C05: ここでsignIn({ username: email, password })を呼びます。
      // isSignedInがtrueなら/homeへ進みます。
      // falseならnextStepをsetNextStep(nextStep)で保存し、この場で分岐します。
      // CONTINUE_SIGN_IN_WITH_TOTP_SETUP → /mfa/setup
      // CONFIRM_SIGN_IN_WITH_TOTP_CODE → /mfa
      // CONFIRM_SIGN_UP → /verify
      // 必要なimport: signIn（aws-amplify/auth）、useRouter（next/navigation）。
      // useRouter()はPageの先頭で呼びます。共通の認証関数は作りません。
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      setPassword('');
      if (isSignedIn) {
        router.replace('/home');
      } else {
        setNextStep(nextStep);
        switch (nextStep.signInStep) {
          case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':
            router.replace('/mfa/setup');
            break;
          case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
            router.replace('/mfa');
            break;
          case 'CONFIRM_SIGN_UP':
            router.replace('/verify');
            break;
          default:
            throw new Error(`未対応のログインステップです: ${nextStep.signInStep}`);
        }
      }
      // [COGNITO C05 END]
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
