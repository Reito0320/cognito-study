'use client';

import { useState, type SubmitEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { confirmSignIn } from 'aws-amplify/auth';
import { QRCodeSVG } from 'qrcode.react';
import { AuthScreen } from '../../components/auth-screen';
import { useAuthFlow } from '../../components/auth-provider';
import { SetupForm } from './setup-form';

export default function MfaSetupPage() {
  const router = useRouter();
  const { nextStep, setNextStep } = useAuthFlow();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [COGNITO C09-DATA START]
  // C09: useAuthFlowからnextStepを受け取ります。
  // nextStep?.signInStepがCONTINUE_SIGN_IN_WITH_TOTP_SETUPなら
  // nextStep.totpSetupDetailsを取り出します。
  // getSetupUri('Cognito Study')をQRCodeSVG（qrcode.react）へ渡します。
  // URIはQRコードにしてqrCodeへ、共有秘密鍵はsetupKeyへ渡します。
  const setupDetails = nextStep?.signInStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP'
    ? nextStep.totpSetupDetails
    : null;
  // [COGNITO C09-DATA END]

  async function handleSetup(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !setupDetails) return;
    setError('');
    setIsSubmitting(true);
    try {
      // [COGNITO C09 START]
      // C09: confirmSignIn({ challengeResponse: code })を呼びます。
      // isSignedInがtrueならsetNextStep(null)を実行して/homeへ進みます。
      // confirmSignInとuseRouterをimportし、Pageの先頭でrouterを用意します。
      const { isSignedIn, nextStep } = await confirmSignIn({ challengeResponse: code });
      if (isSignedIn) {
        setCode('');
        setNextStep(null);
        router.replace('/home');
      } else {
        setNextStep(nextStep);
        throw new Error(`追加の認証が必要です: ${nextStep.signInStep}`);
      }
      // [COGNITO C09 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証処理に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="mfa" title="認証アプリを設定" description="初回のみ、認証アプリをアカウントに登録します。3つのステップで設定しましょう。">
    {setupDetails ? <SetupForm code={code} onCodeChange={setCode} onSubmit={handleSetup} error={error} isSubmitting={isSubmitting}
      qrCode={<QRCodeSVG value={setupDetails.getSetupUri('Cognito Study').toString()} size={180} title="認証アプリ登録用QRコード" />}
      setupKey={setupDetails.sharedSecret} />
      : <p className="field-hint" role="status">設定情報がありません。<Link href="/login">ログインからやり直してください。</Link></p>}
  </AuthScreen>;
}
