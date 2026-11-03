'use client';

import Link from 'next/link';
import { useState, type SubmitEvent } from 'react';
import { AuthScreen } from '../components/auth-screen';
import { CodeForm } from '../components/code-form';
import { useAuthFlow } from '../components/auth-provider';

export default function Page() {
  const { email, setEmail } = useAuthFlow();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleVerify(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || isResending) return;
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      // [COGNITO C06 START]
      // TODO C06: ここでconfirmSignUp({ username: email, confirmationCode: code })を呼びます。
      // 成功したら/loginへ進みます。登録確認はログインとは別の処理です。
      // confirmSignUpとuseRouterをimportし、Pageの先頭でrouterを用意します。
      throw new Error('TODO C06: 登録コード確認は未実装です。');
      // [COGNITO C06 END]
      // [LAMBDA L03 START]
      // TODO: Lambda経由の登録確認処理を実装する場合の空欄です。
      // [LAMBDA L03 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証処理に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (isSubmitting || isResending) return;
    setError('');
    setMessage('');
    setIsResending(true);
    try {
      // [COGNITO C07 START]
      // TODO C07: resendSignUpCode({ username: email })を呼びます。
      // 成功したらsetCode('')とsetMessage('認証コードを再送信しました。')を実行します。
      throw new Error('TODO C07: 登録確認コードの再送信は未実装です。');
      // [COGNITO C07 END]
      // [LAMBDA L04 START]
      // TODO: Lambda経由で実装する場合の処理をここに記述（Cognito直接呼び出しとの二重実行はしない）。
      // [LAMBDA L04 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証処理に失敗しました。');
    } finally {
      setIsResending(false);
    }
  }

  return <AuthScreen screen="verify" footer={<div className="space-y-3">
    <p>コードが届きませんか？ <button type="button" className="text-button" onClick={handleResend} disabled={isSubmitting || isResending}>{isResending ? '再送信中…' : 'コードを再送信'}</button></p>
    <p><Link href="/login">登録確認が済んでいる方はログインへ →</Link></p>
  </div>}>
    <CodeForm email={email} onEmailChange={setEmail} code={code} onCodeChange={setCode}
      onSubmit={handleVerify} label="認証コード" action="メールアドレスを確認"
      hint="登録時のメールアドレスと、最新のメールに届いたコードを入力してください。"
      isSubmitting={isSubmitting} disabled={isResending} error={error} message={message} />
  </AuthScreen>;
}
