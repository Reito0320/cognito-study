import type { ReactNode, SubmitEvent } from 'react';

type Props = {
  qrCode: ReactNode;
  setupKey: string;
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  error: string;
  isSubmitting: boolean;
};

// Cognitoから受け取るQRコード・キーは、ページ側から渡します。
export function SetupForm({ qrCode, setupKey, code, onCodeChange, onSubmit, error, isSubmitting }: Props) {
  return <form method="post" onSubmit={onSubmit} className="my-7 space-y-7">
    <section aria-labelledby="install-app">
      <div className="mb-2 flex items-center gap-2.5"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cognito-50 text-sm font-semibold text-cognito-800">1</span><h3 id="install-app" className="text-base font-semibold">認証アプリを用意する</h3></div>
      <p className="text-sm leading-6 text-slate-500">Google AuthenticatorやMicrosoft Authenticatorなど、TOTPに対応したアプリを開いてください。</p>
    </section>
    <section aria-labelledby="register-device">
      <div className="mb-3 flex items-center gap-2.5"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cognito-50 text-sm font-semibold text-cognito-800">2</span><h3 id="register-device" className="text-base font-semibold">QRコードを読み取る</h3></div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
        <div className="mx-auto grid size-52 place-items-center rounded-lg border border-slate-200 bg-white p-3">
          {qrCode}
        </div>
        <p className="mt-3 text-sm leading-5 text-slate-500">認証アプリでアカウントを追加して読み取ってください。</p>
      </div>
      <details className="mt-3 rounded-lg border border-slate-200 px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-cognito-800">QRコードを読み取れない場合</summary>
        <p className="mt-3 text-sm leading-6 text-slate-500">認証アプリで「セットアップキーを入力」などを選択し、次のキーを登録してください。種類は「時間ベース」を選びます。</p>
        <div className="mt-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-3"><span className="mb-1 block text-xs text-slate-500">セットアップキー</span><code className="block break-all select-all text-sm leading-6 text-slate-700">{setupKey}</code></div>
      </details>
    </section>
    <section aria-labelledby="confirm-device">
      <div className="mb-3 flex items-center gap-2.5"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-cognito-50 text-sm font-semibold text-cognito-800">3</span><h3 id="confirm-device" className="text-base font-semibold">登録を確認する</h3></div>
      <div className="field"><label htmlFor="setup-code">認証アプリの6桁のコード</label><input className="code-input" id="setup-code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} placeholder="000000" value={code} onChange={(event) => onCodeChange(event.target.value)} aria-describedby="setup-code-hint" required /><p id="setup-code-hint" className="field-hint">メールのコードではなく、認証アプリに表示されたコードを入力してください。</p></div>
    </section>
    {error && <p role="alert" className="form-error">{error}</p>}
    <button className="primary-button w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? '確認中…' : '設定を完了する'}<span aria-hidden="true">→</span></button>
  </form>;
}
