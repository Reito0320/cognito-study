import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import styles from './page.module.css';

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

// 学習用の静的ページ。セッション検証・アクセス制御は別途実装します。
export default function HomePage() {
  return <div className={styles.shell}>
    <header className={styles.header}>
      <div className={styles.brand}><span className={styles.brandMark}><Icon kind="shield" /></span>Cognito<span>Study</span></div>
      <div className={styles.headerRight}><span className={styles.headerLabel}>LEARNING WORKSPACE</span><span className={styles.avatar}>CS</span></div>
    </header>
    <main className={styles.main}>
      <div className={styles.breadcrumb}>ワークスペース <span>/</span> 認証フローのまとめ</div>
      <section className={styles.hero} aria-labelledby="page-title">
        <div><span className={styles.heroLabel}>YOUR AUTHENTICATION JOURNEY</span><h1 id="page-title">認証の流れを、ひとつの地図に。</h1><p>登録からログイン完了まで。実装したフローと、次に進む条件を振り返りましょう。</p><div className={styles.heroTags}><span>Amazon Cognito</span><span>Amplify Auth</span><span>ハンズオンノート</span></div></div>
        <div className={styles.heroDiagram} aria-hidden="true"><span className={styles.diagramRing}><Icon kind="shield" /></span><div><span /><span /><span /></div><small>IDENTITY · VERIFIED</small></div>
      </section>

      <section className={styles.section} aria-labelledby="flow-title">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>THE BIG PICTURE</span><h2 id="flow-title">認証の4ステップ</h2></div><span className={styles.sectionHint}>登録 → 本人確認 → ログイン</span></div>
        <ol className={styles.steps}>{steps.map((step, index) => <li className={styles.step} key={step.api}>
          <div className={styles.cardTop}><span className={styles.stepIcon}><Icon kind={step.icon} /></span><span className={styles.stepNumber}>STEP 0{index + 1}</span></div>
          <h3>{step.title}</h3><code className={styles.api}>{step.api}()</code><p>{step.text}</p>
          <div className={styles.stepFooter}><code>{step.result}</code><span>{step.label}<span aria-hidden="true"> ↗</span></span></div>
        </li>)}</ol>
        <p className={styles.flowNote}><span aria-hidden="true">↳</span> MFAは設定とログイン結果に応じて必要になります。全員が4ステップを通るわけではありません。</p>
      </section>

      <section className={styles.section} aria-labelledby="paths-title">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>CHOOSE YOUR PATH</span><h2 id="paths-title">登録確認のあと、どう進む？</h2></div></div>
        <div className={styles.paths}>
          <article className={styles.pathCard}><div className={styles.pathHeader}><span className={styles.pathBadge}>01 / STANDARD</span><Icon kind="key" /></div><h3>ログイン画面から進む</h3><p>自動サインインを使わない場合。登録確認のあと、メールアドレスとパスワードを入力します。</p><div className={styles.route}><code>confirmSignUp</code><span>→</span><code>signIn</code></div><div className={styles.pathCondition}>登録確認の結果 <code>DONE</code></div></article>
          <article className={`${styles.pathCard} ${styles.autoPath}`}><div className={styles.pathHeader}><span className={styles.pathBadge}>02 / AUTOMATIC</span><span aria-hidden="true">↗</span></div><h3>自動サインインで進む</h3><p>signUp時にautoSignInを有効化。登録確認後に、パスワードを再入力せずログインを続けます。</p><div className={styles.route}><code>confirmSignUp</code><span>→</span><code>autoSignIn</code></div><div className={styles.pathCondition}>登録確認の結果 <code>COMPLETE_AUTO_SIGN_IN</code></div></article>
        </div>
        <div className={styles.inlineNote}><Icon kind="shield" /><p><strong>自動サインインでも、MFAは別のステップ。</strong> どちらのルートもisSignedInとnextStepでログイン状態を判断します。</p></div>
      </section>

      <div className={styles.bottomGrid}>
        <section className={styles.referenceCard} aria-labelledby="states-title"><div className={styles.referenceHeading}><span className={styles.eyebrow}>QUICK REFERENCE</span><h2 id="states-title">nextStep 早見表</h2><p>迷ったら、返り値を見て次の処理を決める。</p></div>
          <details className={styles.details} open><summary><span>登録フロー</span><code>signUpStep</code></summary><dl>{signupStates.map(([value, text]) => <div key={value}><dt><code>{value}</code></dt><dd>{text}</dd></div>)}</dl></details>
          <details className={styles.details} open><summary><span>ログインフロー</span><code>signInStep</code></summary><dl>{signinStates.map(([value, text]) => <div key={value}><dt><code>{value}</code></dt><dd>{text}</dd></div>)}</dl></details>
          <p className={styles.referenceNote}>代表的な分岐を掲載しています。コードの不一致・期限切れなどの例外はcatchで処理します。</p>
        </section>
        <aside className={styles.sideColumn}>
          <section className={styles.takeaway}><span className={styles.eyebrow}>KEEP IN MIND</span><h2>似ているけれど、<br />役割は別。</h2><div><code>confirmSignUp</code><p>新規登録したメールアドレスの確認。</p></div><div><code>confirmSignIn</code><p>MFAなど、ログインの追加手順の確認。</p></div></section>
          <section className={styles.docs}><span className={styles.eyebrow}>GO A LITTLE DEEPER</span><h2>公式ドキュメント</h2><a href="https://docs.amplify.aws/nextjs/frontend/auth/sign-up/" target="_blank" rel="noreferrer">会員登録と自動サインイン <span>↗</span></a><a href="https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/" target="_blank" rel="noreferrer">ログインとMFA <span>↗</span></a></section>
        </aside>
      </div>
      <p className={styles.staticNote}>学習用の静的なまとめです。この画面の表示は、実際のセッション検証結果を表すものではありません。</p>
    </main>
    <footer className={styles.footer}><span>Cognito Study</span><span>小さく作って、しくみを理解する。</span></footer>
  </div>;
}
