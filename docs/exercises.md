# Cognito認証の問題集

`main`は穴埋め用、`myStudy`は現在の実装例です。UI・入力状態・フォームのpropsは用意済みです。
Cognitoの課題は`// [COGNITO Cxx START]`と`// [COGNITO Cxx END]`の間に実装してください。
`main`の`throw new Error('TODO ...')`は未実装を知らせる仮置きです。実装時に置き換えます。

## 課題

| 順番・ID | 場所 | 実装すること | 完了条件 |
| --- | --- | --- | --- |
| 1 / C01 | `lib/amplify.ts` | 環境変数からAmplify Authの初期設定 | ブラウザでUser Poolが利用できる |
| 2 / C02 | `lib/auth-flow.ts` | 認証結果から遷移先を決める | `npm run test:auth`の遷移テストが通る |
| 3 / C03 | `app/components/auth-provider.tsx` | MFA方式の選択と認証結果の引き継ぎ | 必要な場合TOTPを選び、秘密鍵をメモリだけで次の画面へ渡せる |
| 4 / C04 | `app/signup/page.tsx` | 新規登録と次の画面への遷移 | メールが届き、メールアドレスを引き継いで確認画面へ進む |
| 5 / C06 | `app/verify/page.tsx` | 登録確認・自動サインイン | 登録確認失敗と自動ログイン失敗を分けて表示できる |
| 6 / C07 | `app/verify/page.tsx` | 確認コードの再送信 | メール形式を確認して再送し、古い入力コードをクリアする |
| 7 / C05 | `app/login/page.tsx` | 通常ログイン | 結果に応じてホーム・MFA・初回設定・登録確認へ進む |
| 8 / C09 | `app/mfa/setup/page.tsx` | TOTP登録情報の取り出しと初回設定の確認 | QRコードを認証アプリへ登録し、生成されたコードで設定が完了する |
| 9 / C08 | `app/mfa/page.tsx` | 登録済みMFAコードの確認 | 成功後にホームへ進み、エラー時はやり直せる |
| 10 / C10 | `app/home/home-session.tsx` | セッション確認とユーザー表示 | セッションなしならログインへ、ログイン済みなら名前かメールを表示 |
| 11 / C11 | ホームと`app/components/session-notice.tsx` | サインアウト | 認証状態と進行中のチャレンジをクリアし、再ログインできる |
| 12 / C12 | `app/components/session-notice.tsx` | 既存のログイン状態を確認 | 別アカウントで試す前に明示的にサインアウトできる |
| 13 / C13 | `lib/auth-flow.ts` | Cognitoエラーの表示 | 期限切れ・既存セッション・自動ログイン失敗を区別できる |

C09では、受け取った`nextStep`に応じて設定情報を取り出し、既存のQR表示・手動キー欄に渡してください。
認証アプリの共有秘密鍵やパスワードはログ・URL・アプリの永続ストレージに保存しません。
ホームのブラウザ側の確認と、将来のAPIで行うサーバー側の認可は別のものです。

## Lambdaの発展課題

`// [LAMBDA Lxx START]`〜`END`は空欄です。まずCognito版を完成させてから、必要な処理だけLambda経由へ置き換えてください。

| ID | 処理 | 場所 |
| --- | --- | --- |
| L01 | 新規登録 | signup |
| L02 | ログイン | login |
| L03 | 登録確認 | verify |
| L04 | 確認コード再送 | verify |
| L05 | MFA確認 | mfa |
| L06 | TOTP初回設定の確認 | mfa/setup |

エンドポイント、リクエスト・レスポンス、エラー処理、MFAチャレンジセッションの引き継ぎは自分で設計してください。
Cognito直接呼び出しとLambda呼び出しを同時に実行しないようにします。
このリポジトリにはLambdaの解答・バックエンド実装は含まれていません。

## チェック方法

```bash
npm run lint
npm run test:auth
npx next build --webpack
```

`main`の認証分岐・エラー処理のテストは最初は失敗します。スキップせず、実装して通してください。
これらはローカルの判定ロジックのテストです。実際のCognitoへの接続は、次の順番で確認します。

- 新規登録 → メール確認 → 自動ログイン → 必要ならTOTP初回設定 → ホーム
- サインアウト → 通常ログイン → 登録済みMFA → ホーム
- コード間違い・期限切れ・再送・確認済みユーザーの再確認・既存セッションのエラー
- 設定画面の再読み込みで共有状態が消えたとき、ログインから再開できること

参考: [サインアップ](https://docs.amplify.aws/nextjs/frontend/auth/sign-up/)・[ログインとMFA](https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/)
