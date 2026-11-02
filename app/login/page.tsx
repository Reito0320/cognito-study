'use client';

import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { LoginForm } from './login-form';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setMessage('');
    if (!email.trim() || !password) {
      setError('メールアドレスとパスワードを入力してください。');
      return;
    }
    setIsSubmitting(true);
    try {
      // 接続時はAmplify Auth方式またはLambda方式を選んで実装してください。
      // Amplify Auth（事前にAmplify.configureが必要）:
      // const { isSignedIn, nextStep } = await signIn({ username: email.trim(), password });
      // if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
      //   router.push('/mfa'); // signIn後のチャレンジをconfirmSignInで継続
      //   return;
      // }
      // if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
      //   router.push('/verify'); // 登録したメールアドレスを入力して確認
      //   return;
      // }
      // if (isSignedIn) { setMessage('ログインしました。'); return; }
      // その他のnextStep（SMS、MFA設定など）は別途対応してください。
      // throw new Error('このログイン手順にはまだ対応していません。');
      //
      // Lambda（API Gateway等の公開エンドポイント）:
      // const response = await fetch('YOUR_LOGIN_ENDPOINT', {
      //   method: 'POST', headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: email.trim(), password }),
      // });
      // if (!response.ok) throw new Error('Login failed');
      // レスポンス仕様に合わせて、MFAチャレンジのセッションやログイン結果を処理します。
      // LambdaとAmplifyのチャレンジセッションは混在させず、同じ方式で完了させてください。

      setMessage(
        '入力内容を確認しました。認証APIは未接続のため、ログインは行っていません。',
      );
    } catch {
      setError(
        'ログインできませんでした。入力内容を確認して、もう一度お試しください。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen screen="login">
      <LoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        isSubmitting={isSubmitting}
        error={error}
        message={message}
      />
    </AuthScreen>
  );
}
