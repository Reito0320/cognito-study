'use client';

import '@/lib/amplify';
import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { CodeForm } from '../components/code-form';
import { confirmSignIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleMfa(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setMessage('');
    if (!/^[0-9]{6}$/.test(code))
      return setError('6桁の数字のコードを入力してください。');

    setIsSubmitting(true);
    try {
      // 接続時は、ログインページで選んだ方式を継続してください。
      // Amplify Auth（signInでTOTPチャレンジが開始されている必要があります）:
      const { isSignedIn, nextStep } = await confirmSignIn({
        challengeResponse: code,
      });
      if (!isSignedIn) {
        // nextStepに応じた追加手順を処理してください。
        throw new Error('Additional sign-in step required');
      }
      // signIn未実行・チャレンジ期限切れの場合はログインからやり直します。
      //
      // Lambda:
      // const response = await fetch('YOUR_MFA_ENDPOINT', {
      //   method: 'POST', headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     code,
      //     session: loginChallengeSession, // ログインAPIから受け取ったセッション
      //   }),
      // });
      // if (!response.ok) throw new Error('MFA failed');
      // loginChallengeSessionの受け渡し方法はAPI仕様に合わせて実装してください。

      setMessage(
        '入力内容を確認しました。認証APIは未接続のため、MFA認証は行っていません。',
      );
    } catch {
      setError(
        'MFA認証できませんでした。最新のコードを入力するか、ログインからやり直してください。',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen screen="mfa">
      <CodeForm
        code={code}
        onCodeChange={setCode}
        onSubmit={handleMfa}
        label="認証アプリのコード"
        action="認証する"
        hint="コードの有効期限が切れた場合は、次のコードを入力してください。"
        isSubmitting={isSubmitting}
        error={error}
        message={message}
      />
    </AuthScreen>
  );
}
