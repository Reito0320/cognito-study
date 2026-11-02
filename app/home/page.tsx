import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { HomeSession } from './home-session';

export const metadata: Metadata = { title: '認証フローのまとめ | Cognito Study' };

function Icon({ kind }: { kind: 'user' | 'mail' | 'key' | 'shield' }) {
  const paths: Record<typeof kind, ReactNode> = {
    user: <><circle cx="12" cy="8" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2M19 4v6m-3-3h6" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
    key: <><circle cx="8" cy="9" r="5" /><path d="m12 13 8 8m-2-2 3-3m-6 0 3-3" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

const steps = [
  { title: 'アカウント登録', api: 'signUp', icon: 'user', text: 'メールアドレスとパスワードを登録。名前などはuserAttributesに設定。', result: 'CONFIRM_SIGN_UP', label: 'メール確認へ' },
  { title: 'メール確認', api: 'confirmSignUp', icon: 'mail', text: 'メールに届いたコードを送信。Cognitoが登録先のメールアドレスを確認。', result: 'DONE', label: '登録が完了' },
  { title: 'ログイン', api: 'signIn', icon: 'key', text: '登録した情報でログイン。自動サインインの場合はautoSignInを実行。', result: 'nextStep.signInStep', label: '次の手順を確認' },
  { title: '追加認証', api: 'confirmSignIn', icon: 'shield', text: 'MFAが必要なら認証アプリのコードで確認。未設定なら先にアプリを登録。', result: 'isSignedIn: true', label: 'ホームへ' },
] as const;

const signupStates = [
  ['CONFIRM_SIGN_UP', 'メールのコードを入力し、confirmSignUpへ。'],
  ['DONE', '会員登録が完了。通常ログインへ進む。'],
  ['COMPLETE_AUTO_SIGN_IN', 'autoSignInを呼び、ログイン結果を確認。'],
];
const signinStates = [
  ['CONFIRM_SIGN_IN_WITH_TOTP_CODE', '認証アプリのコードをconfirmSignInに渡す。'],
  ['CONTINUE_SIGN_IN_WITH_TOTP_SETUP', '認証アプリを設定してからコードを確認。'],
  ['DONE', 'ログイン完了。ホーム画面へ進む。'],
];

// 課題C10の実装前は、認証状態によらずUIを表示します。
export default function HomePage() {
  return <HomeSession><div className="min-h-screen bg-slate-50 text-slate-800">
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-12">
      <div className="flex items-center gap-2 text-xl font-bold tracking-tight [&>span:last-child]:font-normal [&>span:last-child]:text-slate-400"><span className="mr-1 grid size-9 place-items-center rounded-xl bg-emerald-900 text-white"><Icon kind="shield" /></span>Cognito<span>Study</span></div>
      <div className="flex items-center gap-6"><span className="hidden text-[10px] tracking-widest text-slate-400 sm:block">LEARNING WORKSPACE</span><span className="grid size-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-xs">CS</span></div>
    </header>
    <main className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-12">
      <div className="mb-7 flex gap-3 text-xs text-slate-500 [&>span]:text-slate-300">ワークスペース <span>/</span> 認証フローのまとめ</div>
      <section className="flex items-center justify-between gap-8 overflow-hidden rounded-3xl bg-emerald-950 px-7 py-10 text-white sm:p-12 [&_h1]:my-5 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-relaxed lg:[&_h1]:text-4xl [&_p]:max-w-2xl [&_p]:text-sm [&_p]:leading-7 [&_p]:text-emerald-100/70" aria-labelledby="page-title">
        <div><span className="text-[10px] tracking-[0.2em] text-lime-200">YOUR AUTHENTICATION JOURNEY</span><h1 id="page-title">認証の流れを、ひとつの地図に。</h1><p>登録からログイン完了まで。実装したフローと、次に進む条件を振り返りましょう。</p><div className="mt-7 flex flex-wrap gap-2 [&>span]:rounded-md [&>span]:border [&>span]:border-white/15 [&>span]:px-3 [&>span]:py-1.5 [&>span]:text-[11px] [&>span]:text-emerald-100"><span>Amazon Cognito</span><span>Amplify Auth</span><span>ハンズオンノート</span></div></div>
        <div className="hidden w-40 shrink-0 flex-col items-center lg:flex [&>div]:mt-8 [&>div]:flex [&>div]:gap-3 [&>div>span]:size-1.5 [&>div>span]:rounded-full [&>div>span]:bg-lime-200 [&>small]:mt-4 [&>small]:text-[9px] [&>small]:tracking-widest [&>small]:text-emerald-200/70" aria-hidden="true"><span className="grid size-28 -rotate-6 place-items-center rounded-3xl border border-lime-200/30 bg-white/5 text-lime-200 ring-16 ring-white/5 [&>svg]:size-12"><Icon kind="shield" /></span><div><span /><span /><span /></div><small>IDENTITY · VERIFIED</small></div>
      </section>

      <section className="mt-10" aria-labelledby="flow-title">
        <div className="mb-5 flex items-end justify-between gap-4 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-semibold"><div><span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">THE BIG PICTURE</span><h2 id="flow-title">認証の4ステップ</h2></div><span className="hidden text-xs text-slate-400 sm:block">登録 → 本人確認 → ログイン</span></div>
        <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">{steps.map((step, index) => <li className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white px-6 pt-6 shadow-sm [&>h3]:mb-2 [&>h3]:text-base [&>h3]:font-semibold [&>p]:my-5 [&>p]:text-xs [&>p]:leading-7 [&>p]:text-slate-500" key={step.api}>
          <div className="mb-6 flex items-center justify-between gap-3"><span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon kind={step.icon} /></span><span className="text-[10px] tracking-wider text-slate-400">STEP 0{index + 1}</span></div>
          <h3>{step.title}</h3><code className="text-xs text-emerald-700">{step.api}()</code><p>{step.text}</p>
          <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 py-5 [&>code]:text-[10px] [&>code]:text-slate-400 [&>code]:[overflow-wrap:anywhere] [&>span]:text-xs [&>span]:text-emerald-800"><code>{step.result}</code><span>{step.label}<span aria-hidden="true"> ↗</span></span></div>
        </li>)}</ol>
        <p className="mt-4 text-xs leading-6 text-slate-400"><span aria-hidden="true">↳</span> MFAは設定とログイン結果に応じて必要になります。全員が4ステップを通るわけではありません。</p>
      </section>

      <section className="mt-10" aria-labelledby="paths-title">
        <div className="mb-5 flex items-end justify-between gap-4 [&_h2]:mt-2 [&_h2]:text-xl [&_h2]:font-semibold"><div><span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">CHOOSE YOUR PATH</span><h2 id="paths-title">登録確認のあと、どう進む？</h2></div></div>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm [&>h3]:text-xl [&>h3]:font-semibold [&>p]:mt-3 [&>p]:text-xs [&>p]:leading-7 [&>p]:text-slate-500"><div className="mb-5 flex items-center justify-between text-emerald-700"><span className="text-[10px] tracking-widest">01 / STANDARD</span><Icon kind="key" /></div><h3>ログイン画面から進む</h3><p>自動サインインを使わない場合。登録確認のあと、メールアドレスとパスワードを入力します。</p><div className="flex flex-wrap items-center gap-3 py-6 [&>code]:rounded-lg [&>code]:border [&>code]:border-slate-200 [&>code]:bg-white [&>code]:px-3 [&>code]:py-2 [&>code]:text-xs [&>span]:text-slate-400"><code>confirmSignUp</code><span>→</span><code>signIn</code></div><div className="flex flex-wrap gap-2 border-t border-slate-200/80 pt-4 text-[11px] text-slate-500 [&>code]:text-emerald-700 [&>code]:[overflow-wrap:anywhere]">登録確認の結果 <code>DONE</code></div></article>
          <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm [&>h3]:text-xl [&>h3]:font-semibold [&>p]:mt-3 [&>p]:text-xs [&>p]:leading-7 [&>p]:text-slate-500 border-emerald-200 bg-emerald-50/70"><div className="mb-5 flex items-center justify-between text-emerald-700"><span className="text-[10px] tracking-widest">02 / AUTOMATIC</span><span aria-hidden="true">↗</span></div><h3>自動サインインで進む</h3><p>signUp時にautoSignInを有効化。登録確認後に、パスワードを再入力せずログインを続けます。</p><div className="flex flex-wrap items-center gap-3 py-6 [&>code]:rounded-lg [&>code]:border [&>code]:border-slate-200 [&>code]:bg-white [&>code]:px-3 [&>code]:py-2 [&>code]:text-xs [&>span]:text-slate-400"><code>confirmSignUp</code><span>→</span><code>autoSignIn</code></div><div className="flex flex-wrap gap-2 border-t border-slate-200/80 pt-4 text-[11px] text-slate-500 [&>code]:text-emerald-700 [&>code]:[overflow-wrap:anywhere]">登録確認の結果 <code>COMPLETE_AUTO_SIGN_IN</code></div></article>
        </div>
        <div className="mt-4 flex items-start gap-3 px-1 text-emerald-800 [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0 [&>p]:text-xs [&>p]:leading-6"><Icon kind="shield" /><p><strong>自動サインインでも、MFAは別のステップ。</strong> どちらのルートもisSignedInとnextStepでログイン状態を判断します。</p></div>
      </section>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2" aria-labelledby="states-title"><div className="p-7 [&>h2]:mt-2 [&>h2]:text-xl [&>h2]:font-semibold [&>p]:mt-2 [&>p]:text-xs [&>p]:text-slate-500"><span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">QUICK REFERENCE</span><h2 id="states-title">nextStep 早見表</h2><p>迷ったら、返り値を見て次の処理を決める。</p></div>
          <details className="border-t border-slate-100 [&>summary]:cursor-pointer [&>summary]:bg-slate-50/70 [&>summary]:px-7 [&>summary]:py-4 [&>summary]:text-sm [&>summary>span]:mx-2 [&>summary>span]:font-medium [&>summary>code]:text-xs [&>summary>code]:text-slate-400 [&_dl]:divide-y [&_dl]:divide-slate-100 [&_dl]:px-7 [&_dl>div]:py-4 [&_dt]:text-[11px] [&_dt]:text-emerald-700 [&_dt]:[overflow-wrap:anywhere] [&_dd]:mt-2 [&_dd]:text-xs [&_dd]:leading-6 [&_dd]:text-slate-500" open><summary><span>登録フロー</span><code>signUpStep</code></summary><dl>{signupStates.map(([value, text]) => <div key={value}><dt><code>{value}</code></dt><dd>{text}</dd></div>)}</dl></details>
          <details className="border-t border-slate-100 [&>summary]:cursor-pointer [&>summary]:bg-slate-50/70 [&>summary]:px-7 [&>summary]:py-4 [&>summary]:text-sm [&>summary>span]:mx-2 [&>summary>span]:font-medium [&>summary>code]:text-xs [&>summary>code]:text-slate-400 [&_dl]:divide-y [&_dl]:divide-slate-100 [&_dl]:px-7 [&_dl>div]:py-4 [&_dt]:text-[11px] [&_dt]:text-emerald-700 [&_dt]:[overflow-wrap:anywhere] [&_dd]:mt-2 [&_dd]:text-xs [&_dd]:leading-6 [&_dd]:text-slate-500" open><summary><span>ログインフロー</span><code>signInStep</code></summary><dl>{signinStates.map(([value, text]) => <div key={value}><dt><code>{value}</code></dt><dd>{text}</dd></div>)}</dl></details>
          <p className="border-t border-slate-100 px-7 py-5 text-[11px] leading-6 text-slate-400">代表的な分岐を掲載しています。コードの不一致・期限切れなどの例外はcatchで処理します。</p>
        </section>
        <aside className="grid min-w-0 gap-5">
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-7 [&>h2]:my-5 [&>h2]:text-2xl [&>h2]:leading-relaxed [&>div]:border-t [&>div]:border-emerald-900/10 [&>div]:pt-4 [&>div+div]:mt-4 [&_code]:text-xs [&_code]:text-emerald-800 [&_p]:mt-2 [&_p]:text-xs [&_p]:leading-6 [&_p]:text-slate-500"><span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">KEEP IN MIND</span><h2>似ているけれど、<br />役割は別。</h2><div><code>confirmSignUp</code><p>新規登録したメールアドレスの確認。</p></div><div><code>confirmSignIn</code><p>MFAなど、ログインの追加手順の確認。</p></div></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm [&>h2]:mb-5 [&>h2]:mt-2 [&>h2]:font-semibold [&>a]:flex [&>a]:justify-between [&>a]:gap-3 [&>a]:border-t [&>a]:border-slate-100 [&>a]:py-4 [&>a]:text-xs [&>a]:text-emerald-800 [&>a:hover]:underline [&>a:last-child]:pb-0"><span className="text-[10px] font-semibold tracking-[0.18em] text-slate-400">GO A LITTLE DEEPER</span><h2>公式ドキュメント</h2><a href="https://docs.amplify.aws/nextjs/frontend/auth/sign-up/" target="_blank" rel="noreferrer">会員登録と自動サインイン <span>↗</span></a><a href="https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/" target="_blank" rel="noreferrer">ログインとMFA <span>↗</span></a></section>
        </aside>
      </div>
      <p className="mt-7 text-[11px] leading-6 text-slate-400">学習用プレビューです。セッション確認とAPIのトークン検証は、課題として実装してください。</p>
    </main>
    <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-slate-200 px-5 py-6 text-[10px] text-slate-400"><span>Cognito Study</span><span>小さく作って、しくみを理解する。</span></footer>
  </div></HomeSession>;
}
