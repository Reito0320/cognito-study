'use client';

import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../../components/auth-screen';
import { SetupForm } from './setup-form';

export default function MfaSetupPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [COGNITO C09-DATA START]
  // TODO C09: useAuthFlowからnextStepを受け取ります。
  // nextStep?.signInStepがCONTINUE_SIGN_IN_WITH_TOTP_SETUPなら
  // nextStep.totpSetupDetailsを取り出します。
  // getSetupUri('Cognito Study')をQRCodeSVG（qrcode.react）へ渡します。
  // URIはQRコードにしてqrCodeへ、共有秘密鍵はsetupKeyへ渡します。
  // [COGNITO C09-DATA END]

  async function handleSetup(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      // [COGNITO C09 START]
      // TODO C09: confirmSignIn({ challengeResponse: code })を呼びます。
      // isSignedInがtrueならsetNextStep(null)を実行して/homeへ進みます。
      // confirmSignInとuseRouterをimportし、Pageの先頭でrouterを用意します。
      throw new Error('TODO C09: TOTP初回設定の確認は未実装です。');
      // [COGNITO C09 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証処理に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="mfa" title="認証アプリを設定" description="初回のみ、認証アプリをアカウントに登録します。3つのステップで設定しましょう。">
    <SetupForm code={code} onCodeChange={setCode} onSubmit={handleSetup} error={error} isSubmitting={isSubmitting}
      qrCode={<p className="text-center text-sm leading-6 text-slate-400">QRコード表示エリア<br />TODO C09</p>}
      setupKey="未実装（C09で設定）" />
  </AuthScreen>;
}
