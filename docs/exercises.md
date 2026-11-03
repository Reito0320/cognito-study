# Cognito認証の問題集

UIとフォームの状態管理は用意済みです。`[COGNITO Cxx START]`〜`END`の間のTODOを実装してください。仮置きの`throw new Error('TODO ...')`は自分の処理に置き換えます。

認証SDKの呼び出し・結果の分岐・画面遷移は、その画面のハンドラー内に直接書きます。`continueSignIn`や遷移先判定の共通関数は作りません。エラーは各画面のcatchで`error.message`を表示します。最初からエラー名別の分類や最適化をする必要はありません。

## 基本課題

| 順番・ID | 場所 | 実装すること・完了条件 |
| --- | --- | --- |
| 1 / C01 | `lib/amplify.ts` | 環境変数からAmplify.configureで接続先を設定する |
| 2 / C04 | `app/signup/page.tsx` | signUpへemail・password・email属性を渡す。CONFIRM_SIGN_UPなら/verify、DONEなら/loginへ進む |
| 3 / C06 | `app/verify/page.tsx` | confirmSignUpへメールとコードを渡し、成功したら/loginへ進む |
| 4 / C07 | `app/verify/page.tsx` | resendSignUpCodeでコードを再送し、入力欄を空にする |
| 5 / C05 | `app/login/page.tsx` | signInを呼び、isSignedInなら/home。nextStepに応じて/verify・/mfa/setup・/mfaへ直接分岐する |
| 6 / C09 | `app/mfa/setup/page.tsx` | nextStep.totpSetupDetailsからQRとキーを表示する。confirmSignInへコードを渡し、isSignedInなら/homeへ進む |
| 7 / C08 | `app/mfa/page.tsx` | confirmSignInへ認証アプリのコードを渡し、isSignedInなら/homeへ進む |
| 8 / C10 | `app/home/home-session.tsx` | fetchAuthSessionでログイン状態とメールを確認する。未ログインなら/loginへ進む |
| 9 / C11 | `app/home/home-session.tsx` | signOutを呼び、setNextStep(null)で共有値を消して/loginへ戻る |

C02（遷移先の共通化）、C03（認証フローの共通化）、C13（エラー分類）は基本課題から外しました。既存の課題IDは残しています。

### ページ間で渡す値

`useAuthFlow`はメールアドレスと`nextStep`を渡すだけの土台です。ここに認証処理を書きません。loginで`setNextStep(nextStep)`を呼び、設定画面で受け取ります。ログイン完了やサインアウト時は、その場で`setNextStep(null)`を呼びます。

SDK・routerのimportと`useRouter()`の準備も各ページで行います。SDKは`aws-amplify/auth`、routerは`next/navigation`からimportします。HooksはPageの先頭で呼びます。QR表示にはインストール済みの`qrcode.react`の`QRCodeSVG`を使えます。

C09-DATAのコメントには設定情報を取り出す処理を書き、既存フォームの`qrCode`と`setupKey`に渡します。設定情報がない場合はログインから再開する案内を表示してください。共有秘密鍵はURL・ログ・永続ストレージに保存しません。

## 前提と確認順序

Cognitoはメールアドレスでのログイン、コードによる登録確認、クライアントシークレットなしのApp Client、TOTPのみの必須MFAで設定します。基本課題では自動サインインを指定しません。

1. 新規登録 → メール確認 → ログイン → TOTP初回設定 → ホーム
2. サインアウト → ログイン → 認証アプリのコード確認 → ホーム
3. 誤ったコードでエラーが表示され、正しいコードでやり直せること
4. 登録確認コードの再送信後、最新のコードで確認できること
5. MFA設定画面の再読み込みで共有値が消えた場合、ログインから再開できること

```bash
npm run lint
npx next build --webpack
```

空欄のままでもUIプレビューとビルドができます。共通関数用の`test:auth`は廃止しました。課題の動作は上の手順でCognitoに接続して確認します。ホームのカードに基本課題の参考コードがあります。

## 発展課題

基本フローを完了してから、必要なものに取り組みます。

- C12：既存ユーザーの表示（`app/components/session-notice.tsx`）
- 自動サインイン：signUpでautoSignInを有効にし、confirmSignUpのCOMPLETE_AUTO_SIGN_IN後にautoSignInを呼ぶ。その結果の分岐もverify内に書く
- MFA方式の選択、SMS・メールによるMFA、エラー名別の案内
- `[LAMBDA Lxx START]`〜`END`：該当処理をLambda経由へ置き換える。L01=登録、L02=ログイン、L03=登録確認、L04=再送、L05=MFA確認、L06=TOTP設定確認。Cognito直接呼び出しとの二重実行はしない

Lambdaのバックエンド実装は含まれません。パスワードリセット・外部IdP・APIのサーバー側認可も別課題です。

参考：[サインアップ](https://docs.amplify.aws/nextjs/frontend/auth/sign-up/)・[ログインとMFA](https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/)
