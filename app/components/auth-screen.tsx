import Link from 'next/link';
import type { ReactNode } from 'react';
import { SessionNotice } from './session-notice';

const screens = {
  login: {
    label: 'ログイン',
    title: 'おかえりなさい',
    description: 'メールアドレスとパスワードを入力してください。',
  },
  signup: {
    label: '新規登録',
    title: 'アカウントを作成',
    description: 'メールアドレスとパスワードを登録してください。',
  },
  verify: {
    label: '認証コード',
    title: 'メールアドレスを確認',
    description:
      '登録したメールアドレスに届いた6桁の認証コードを入力してください。',
  },
  mfa: {
    label: 'MFA認証',
    title: 'もう一度、本人確認',
    description: '認証アプリに表示されている6桁のコードを入力してください。',
  },
};
type Screen = keyof typeof screens;

function LockIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="5" y="10" width="14" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </svg>
  );
}

export function AuthScreen({ screen, children, footer, title, description }: { screen: Screen; children: ReactNode; footer?: ReactNode; title?: string; description?: string }) {
  const content = screens[screen];
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <LockIcon />
          </span>
          Cognito <span className="brand-light">Study</span>
        </Link>
        <span className="header-caption">AUTHENTICATION LAB</span>
      </header>
      <main className="main-content">
        <div className="intro">
          <span className="eyebrow">LEARN BY BUILDING</span>
          <h1>認証のしくみを、ひとつずつ。</h1>
          <p>Amazon Cognitoで学ぶ、認証・認可のハンズオン。</p>
        </div>
        <nav className="screen-nav" aria-label="認証画面">
          {(Object.keys(screens) as Screen[]).map((key, index) => (
            <Link
              key={key}
              href={`/${key}`}
              className={screen === key ? 'screen-link active' : 'screen-link'}
              aria-current={screen === key ? 'page' : undefined}
            >
              <span className="step-number">0{index + 1}</span>
              {screens[key].label}
            </Link>
          ))}
        </nav>
        <section className="auth-card" aria-labelledby="auth-title">
          <div className="card-icon">
            <LockIcon />
          </div>
          <h2 id="auth-title">{title ?? content.title}</h2>
          <p className="card-description">{description ?? content.description}</p>
          <SessionNotice />
          {children}
          <div className="card-bottom">
            {screen === 'login' && (
              <p>
                アカウントをお持ちでない方は{' '}
                <Link href="/signup">新規登録</Link>
              </p>
            )}
            {screen === 'signup' && (
              <p>
                すでにアカウントをお持ちの方は{' '}
                <Link href="/login">ログイン</Link>
              </p>
            )}
            {footer}
            {screen === 'mfa' && <Link href="/login">← ログインに戻る</Link>}
          </div>
        </section>
        <p className="preview-note">
          <span aria-hidden="true" />
          Cognito認証ハンズオン · メール確認と認証アプリで本人確認
        </p>
      </main>
      <footer className="site-footer">
        <span>Cognito Study</span>
        <span>小さく作って、しくみを理解する。</span>
      </footer>
    </div>
  );
}
