'use client';

import { useState } from 'react';

export function LambdaExercise() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRequest() {
    setIsSubmitting(true);
    setMessage('');
    setError('');
    try {
      // [LAMBDA L09 START]
      // TODO L09: Amplify Auth編が終わってから取り組みます。
      // fetchAuthSessionをimportして呼び、tokens.accessTokenを取り出します。
      // トークンがなければ、ログインし直す案内をエラーで表示します。
      // process.env.NEXT_PUBLIC_STUDY_API_URLへfetchでGETを送ります。
      // headersにAuthorization: `Bearer ${accessToken.toString()}`を指定します。
      // response.okがfalseならエラーにし、成功ならresponse.json()を読みます。
      // setMessage(data.message)でLambdaからのメッセージを表示します。
      // L10ではdata.userIdも表示に追加します。
      throw new Error('TODO L09: Lambdaへのリクエストを実装してください。');
      // [LAMBDA L09 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : 'APIを呼び出せませんでした。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <section className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8">
    <h2 className="text-lg font-semibold">認証の次は、Lambdaを呼んでみよう</h2>
    <p className="my-3 text-sm text-slate-500">Amplify Auth編ができたら、問題集の第2部へ進んでください。</p>
    <button type="button" onClick={handleRequest} disabled={isSubmitting} className="text-button">
      {isSubmitting ? '呼び出し中…' : 'Lambdaを呼ぶ'}
    </button>
    {message && <p role="status" className="mt-3 text-sm">{message}</p>}
    {error && <p role="alert" className="form-error">{error}</p>}
  </section>;
}
