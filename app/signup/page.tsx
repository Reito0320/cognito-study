'use client';

import '@/lib/amplify';
import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { SignupForm } from './signup-form';
import { signUp } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSignup(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setMessage('');

    if (!email.trim() || password.length < 8) {
      setError('メールアドレスと8文字以上のパスワードを入力してください。');
      return;
    }

    if (password !== confirmPassword)
      return setError('確認用パスワードが一致していません。');

    setIsSubmitting(true);
    try {
      const { isSignUpComplete, nextStep } = await signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes: { email: email.trim() },
          autoSignIn: true,
        },
      });
      // nextStep.signUpStepがCONFIRM_SIGN_UPなら、登録メールを引き継いで/verifyへ遷移します。
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') router.push('/verify');
      // isSignUpCompleteがtrueならログイン画面を案内するなど、戻り値に応じて処理します。
      else if (isSignUpComplete) router.push('/login');

      // TODO: Lambdaを呼び出すエンドポイントとリクエスト仕様に合わせて実装してください。
      // const response = await fetch('YOUR_SIGNUP_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: email.trim(), password }),
      // });
      // if (!response.ok) {
      //   throw new Error('アカウントを作成できませんでした。');
      // }
      // 成功したら、必要な情報を引き継いで認証コード入力画面へ遷移します。
      // 確認用パスワードは送信しません。パスワードは保存・ログ出力しないでください。

      setMessage(
        '入力内容を確認しました。認証APIは未接続のため、登録は行っていません。',
      );
    } catch {
      setError('アカウントを作成できませんでした。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen screen="signup">
      <SignupForm
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleSignup}
        isSubmitting={isSubmitting}
        error={error}
        message={message}
      />
    </AuthScreen>
  );
}
