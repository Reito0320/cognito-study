import type { SubmitEvent } from 'react';

type Props = {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  error: string;
  message: string;
};

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isSubmitting,
  error,
  message,
}: Props) {
  return (
    <form method="post" className="auth-fields" onSubmit={onSubmit} aria-busy={isSubmitting}>
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
          autoComplete="current-password"
          placeholder="パスワードを入力"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
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
        {isSubmitting ? 'ログイン中…' : 'ログイン'}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
