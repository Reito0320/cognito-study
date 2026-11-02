'use client';

import '@/lib/amplify';
import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { CodeForm } from '../components/code-form';
import { autoSignIn, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  async function handleVerify(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || isResending) return;
    setError('');
    setMessage('');
    if (!email.trim() || !/^[0-9]{6}$/.test(code)) {
      setError('登録したメールアドレスと6桁の数字のコードを入力してください。');
      return;
    }
    setIsSubmitting(true);
    try {
      // 接続時はどちらか一方の方式を選んでください。
      // Amplify Auth:
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email.trim(),
        confirmationCode: code,
      });

      if (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
        // autoSignin設定をしているかどうかの確認
        const result = await autoSignIn();
        console.log(result);
        if (result.isSignedIn) {
          router.push('/home');
        } else if (
          result.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE'
        ) {
          router.push('/mfa');
        }
      } else if (nextStep.signUpStep === 'DONE') {
        router.push('login');
      }
      // isSignUpCompleteとnextStepを確認し、ログイン画面への遷移などを実装します。
      // if (isSignUpComplete) return router.push('/login');

      setMessage('入力内容を確認しました。');
    } catch {
      setError(
        'メール認証できませんでした。コードと有効期限を確認してください。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (isSubmitting || isResending) return;
    setError('');
    setMessage('');
    // 再送信ボタンでも、コード入力を要求せずにメール形式を検証します。
    const emailInput = document.getElementById(
      'email',
    ) as HTMLInputElement | null;
    if (!emailInput?.reportValidity()) return;
    setIsResending(true);
    try {
      // Amplify Auth:
      await resendSignUpCode({ username: email.trim() });

      setMessage(`認証コードを ${email.trim()} 宛に再送しました。`);
    } catch {
      setError(
        'コードを再送信できませんでした。時間をおいてもう一度お試しください。',
      );
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthScreen
      screen="verify"
      footer={
        <p>
          コードが届きませんか？{' '}
          <button
            type="button"
            className="text-button"
            onClick={handleResend}
            disabled={isSubmitting || isResending}
          >
            {isResending ? '再送信中…' : 'コードを再送信'}
          </button>
        </p>
      }
    >
      <CodeForm
        email={email}
        onEmailChange={setEmail}
        code={code}
        onCodeChange={setCode}
        onSubmit={handleVerify}
        label="認証コード"
        action="メールアドレスを確認"
        hint="メールが見つからない場合は、迷惑メールフォルダもご確認ください。"
        isSubmitting={isSubmitting}
        disabled={isResending}
        error={error}
        message={message}
      />
    </AuthScreen>
  );
}
