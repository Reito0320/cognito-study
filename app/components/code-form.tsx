import type { Ref, SubmitEvent } from 'react';

type Props = {
  email?: string;
  emailInputRef?: Ref<HTMLInputElement>;
  onEmailChange?: (value: string) => void;
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  label: string;
  hint: string;
  action: string;
  isSubmitting: boolean;
  disabled?: boolean;
  error: string;
  message: string;
};

export function CodeForm({ emailInputRef, email, onEmailChange, code, onCodeChange, onSubmit, label, hint, action, isSubmitting, disabled, error, message }: Props) {
  return <form className="auth-fields" onSubmit={onSubmit} aria-busy={isSubmitting}>
    {onEmailChange && <div className="field">
      <label htmlFor="email">登録したメールアドレス</label>
      <input ref={emailInputRef} id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
        value={email ?? ''} onChange={(event) => onEmailChange(event.target.value)} required />
    </div>}
    <div className="field">
      <label htmlFor="code">{label}</label>
      <input className="code-input" id="code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code"
        maxLength={6} pattern="[0-9]{6}" placeholder="000000" value={code}
        onChange={(event) => onCodeChange(event.target.value)} aria-describedby="code-hint" required />
      <p className="field-hint" id="code-hint">{hint}</p>
    </div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {message && <p className="field-hint" role="status">{message}</p>}
    <button className="primary-button" type="submit" disabled={isSubmitting || disabled}>
      {isSubmitting ? '確認中…' : action}<span aria-hidden="true">→</span>
    </button>
  </form>;
}
