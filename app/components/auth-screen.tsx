import Link from 'next/link';
import type { ReactNode } from 'react';

const screens = {
  login: {
    label: 'ログイン',
    title: 'おかえりなさい',
    description: 'メールアドレスとパスワードを入力してください。',
    action: 'ログイン',
  },
  signup: {
    label: '新規登録',
    title: 'アカウントを作成',
    description: 'メールアドレスとパスワードを登録してください。',
    action: 'アカウントを作成',
  },
  verify: {
    label: '認証コード',
    title: 'メールアドレスを確認',
    description:
      '登録したメールアドレスに届いた6桁の認証コードを入力してください。',
    action: 'メールアドレスを確認',
  },
  mfa: {
    label: 'MFA認証',
    title: 'もう一度、本人確認',
    description: '認証アプリに表示されている6桁のコードを入力してください。',
    action: '認証する',
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

export function AuthScreen({ screen, children }: { screen: Screen; children?: ReactNode }) {
  const content = screens[screen];
  const isCode = screen === 'verify' || screen === 'mfa';
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
          <h2 id="auth-title">{content.title}</h2>
          <p className="card-description">{content.description}</p>
          {/* ページ固有のフォームがある場合は、そちらを表示します。 */}
          {children ?? <div className="auth-fields">
            {!isCode ? (
              <>
                <div className="field">
                  <label htmlFor="email">メールアドレス</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>
                <div className="field">
                  <label htmlFor="password">パスワード</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={
                      screen === 'signup' ? 'new-password' : 'current-password'
                    }
                    placeholder={
                      screen === 'signup'
                        ? 'パスワードを設定'
                        : 'パスワードを入力'
                    }
                  />
                  {screen === 'signup' && (
                    <p className="field-hint">
                      8文字以上のパスワードを入力してください。
                    </p>
                  )}
                </div>
                {screen === 'signup' && (
                  <div className="field">
                    <label htmlFor="confirm-password">パスワード（確認）</label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="もう一度パスワードを入力"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="field">
                <label htmlFor="code">
                  {screen === 'mfa' ? '認証アプリのコード' : '認証コード'}
                </label>
                <input
                  className="code-input"
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  placeholder="000000"
                  aria-describedby="code-hint"
                />
                <p className="field-hint" id="code-hint">
                  {screen === 'mfa'
                    ? 'コードの有効期限が切れた場合は、次のコードを入力してください。'
                    : 'メールが見つからない場合は、迷惑メールフォルダもご確認ください。'}
                </p>
              </div>
            )}
            <button className="primary-button" type="button">
              {content.action}
              <span aria-hidden="true">→</span>
            </button>
          </div>}
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
            {screen === 'verify' && (
              <p>
                コードが届きませんか？{' '}
                <button type="button" className="text-button">
                  コードを再送信
                </button>
              </p>
            )}
            {screen === 'mfa' && <Link href="/login">← ログインに戻る</Link>}
          </div>
        </section>
        <p className="preview-note">
          <span aria-hidden="true" />
          学習用UIプレビュー · 認証処理は未接続です
        </p>
      </main>
      <footer className="site-footer">
        <span>Cognito Study</span>
        <span>小さく作って、しくみを理解する。</span>
      </footer>
    </div>
  );
}
