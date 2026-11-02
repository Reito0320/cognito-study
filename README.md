This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 認証ハンズオンの実装箇所

各 `page.tsx` が入力状態・検証・送信処理を持ち、フォームには値と関数を props で渡します。

| URL | 処理を記述するファイル | Amplify Auth の例 |
| --- | --- | --- |
| `/`・`/login` | `app/login/page.tsx` | `signIn` |
| `/signup` | `app/signup/page.tsx` | `signUp` |
| `/verify` | `app/verify/page.tsx` | `confirmSignUp`・`resendSignUpCode` |
| `/mfa` | `app/mfa/page.tsx` | `confirmSignIn`（TOTPコード） |

現在は入力チェックと未接続メッセージの表示まで動きます。登録、ログイン、コード送信、認証、認証後の画面遷移は実行しません。
メール認証画面では登録メールアドレスを入力します。MFAのセットアップ・SMS認証・ログイン後のページは含んでいません。

各送信処理に Lambda の `fetch` と Amplify Auth のサンプルをコメントで残しています。
接続する際は方式を選び、エンドポイントやレスポンス処理を実装してください。
Lambda 方式の MFA では、ログイン時に返されたチャレンジセッションを引き継ぐ処理も必要です。
Amplify 方式では `signIn` → `confirmSignIn` の流れを使い、Lambda方式のチャレンジと混ぜずに完了させます。

Amplify を使う場合は依存パッケージとクライアント側の初期設定を用意します。手動で User Pool を設定する場合の例です（未接続のためコメント化しています）。

```ts
// import { Amplify } from 'aws-amplify';
// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: 'YOUR_USER_POOL_ID',
//       userPoolClientId: 'YOUR_USER_POOL_CLIENT_ID',
//     },
//   },
// });
```

接続後は、サンプル内の未接続メッセージを実際の成功処理に置き換えてください。
`nextStep` に応じた画面遷移・追加チャレンジ処理や、Cognitoに設定したパスワードポリシーとの整合も実装します。

参考: [Amplify のサインアップ](https://docs.amplify.aws/react/frontend/auth/sign-up/)・[サインイン](https://docs.amplify.aws/nextjs/frontend/auth/sign-in/)
