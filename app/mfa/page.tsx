'use client';

import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { CodeForm } from '../components/code-form';
import { useAuthFlow } from '../components/auth-provider';
import { authErrorMessage } from '@/lib/auth-flow';

export default function Page() {
  const { nextStep } = useAuthFlow();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const step = nextStep?.signInStep;
  const isTotp = step === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE';
  const canConfirm = isTotp || step === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' || step === 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE';
  const label = isTotp ? '認証アプリのコード' : step === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' ? 'SMSで届いたコード' : 'メールで届いたコード';

  async function handleMfa(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !canConfirm) return;
    setError('');
    setIsSubmitting(true);
    try {
      // [COGNITO C08 START]
      // TODO C08: MFAコードの確認と認証結果に応じた画面遷移を実装してください。
      throw new Error('TODO C08: MFAコードの確認と認証結果に応じた画面遷移は未実装です。');
      // [COGNITO C08 END]
      // [LAMBDA L05 START]
      // TODO: Lambda経由で実装する場合の処理をここに記述（Cognito直接呼び出しとの二重実行はしない）。
      // [LAMBDA L05 END]
    } catch (error) {
      setError(authErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="mfa" description={isTotp ? '登録済みの認証アプリに表示されたコードを入力してください。' : 'ログインを続けるため、届いた認証コードを入力してください。'}>
    <CodeForm code={code} onCodeChange={setCode} onSubmit={handleMfa} label={label} action="認証する"
      hint={isTotp ? 'コードが切り替わった場合は、最新のコードを入力してください。' : '今回のログインで届いたコードを入力してください。'}
      isSubmitting={isSubmitting} disabled={!canConfirm} error={error}
      message={canConfirm ? '' : '認証手順が見つかりません。ログイン画面からやり直してください。'} />
  </AuthScreen>;
}
