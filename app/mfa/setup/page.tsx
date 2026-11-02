'use client';

import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../../components/auth-screen';
import { authErrorMessage } from '@/lib/auth-flow';
import { SetupForm } from './setup-form';

export default function MfaSetupPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [COGNITO C09-DATA START]
  // TODO C09: 初回設定のnextStepから設定用URIと共有秘密鍵を取り出してください。
  // URIはQRコードにしてqrCodeへ、共有秘密鍵はsetupKeyへ渡します。
  // [COGNITO C09-DATA END]

  async function handleSetup(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      // [COGNITO C09 START]
      // TODO C09: アプリに表示されたコードで設定を確認し、次の画面へ進めてください。
      throw new Error('TODO C09: TOTP初回設定の確認は未実装です。');
      // [COGNITO C09 END]
      // [LAMBDA L06 START]
      // TODO: Lambda経由の処理を実装する場合の空欄です。
      // [LAMBDA L06 END]
    } catch (error) {
      setError(authErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="mfa" title="認証アプリを設定" description="初回のみ、認証アプリをアカウントに登録します。3つのステップで設定しましょう。">
    <SetupForm code={code} onCodeChange={setCode} onSubmit={handleSetup} error={error} isSubmitting={isSubmitting}
      qrCode={<p className="text-center text-xs leading-6 text-slate-400">QRコード表示エリア<br />TODO C09</p>}
      setupKey="未実装（C09で設定）" />
  </AuthScreen>;
}
