import type { SubmitEvent } from 'react';

// page.tsxから読み込むため、親のClient Componentの一部として動作します。
type Props = {
  email: string;
  password: string;
  confirmPassword: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  error: string;
  message: string;
};

export function SignupForm({
  email,
  password,
  confirmPassword,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isSubmitting,
  error,
  message,
}: Props) {
  return (
    <form method="post" className="auth-fields" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="パスワードを設定"
          value={password}
          minLength={8}
          onChange={(event) => onPasswordChange(event.target.value)}
          aria-describedby="password-hint"
          required
        />
        <p className="field-hint" id="password-hint">
          8文字以上のパスワードを入力してください。
        </p>
      </div>
      <div className="field">
        <label htmlFor="confirm-password">パスワード（確認）</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="もう一度パスワードを入力"
          value={confirmPassword}
          minLength={8}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          required
        />
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="field-hint" role="status">
          {message}
        </p>
      )}
      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? '登録中…' : 'アカウントを作成'}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
