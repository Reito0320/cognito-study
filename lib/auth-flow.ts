
// 通常ログイン、自動ログイン、MFAの結果を同じルールで扱います。
// [COGNITO C02 START]
export function getSignInRoute(): string {
  // TODO C02: SignInOutputを引数に受け取り、次の画面のパスを返してください。
  throw new Error('TODO C02: 認証結果に応じた遷移先を実装してください。');
}
// [COGNITO C02 END]
// [COGNITO C13 START]
export function authErrorMessage(error: unknown): string {
  // TODO C13: Cognitoのエラー名に応じて、次に取る操作を案内してください。
  // 以下はフォームでTODOを表示するための汎用処理です。
  return error instanceof Error ? error.message : '認証処理を実装してください。';
}
// [COGNITO C13 END]