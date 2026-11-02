# Cognito Study — 認証ハンズオン問題集

UIは用意済みです。Cognito・Lambdaの処理を自分で実装して、登録からログイン・MFAまでの流れを学びます。

- `main`: 認証処理が空欄の問題集。ここから自分の作業ブランチを作って取り組みます。
- `myStudy`: 現在のCognito実装を保存した参考ブランチ。Lambdaは未実装です。

課題の場所・実装順・完了条件は [問題集](docs/exercises.md) を参照してください。

## 起動

```bash
npm install
npm run dev
```

未実装のままでも起動・ビルドできます。AWSへの接続や認証リクエストは行いません。
フォームの送信はTODOメッセージを表示し、成功したふりをしません。
`/home`と`/mfa/setup`もUIプレビューとして直接表示できます。

## 実装する場所

```ts
// [COGNITO Cxx START]
// TODO: ここに認証処理を書きます。
// [COGNITO Cxx END]
```

Cognito課題の空欄を実装してください。`throw new Error('TODO ...')`は仮置きなので、実装時に置き換えます。
`[LAMBDA Lxx START]`〜`END`は発展課題の空欄です。まずCognito版を完成させ、必要な箇所だけLambda経由へ置き換えます。
このリポジトリにLambdaのバックエンド実装は含まれません。

各ページに入力状態・入力チェック・送信ハンドラーがあります。React Contextは画面間のメールアドレスと進行中の認証手順を共有するための土台です。

| 画面 | 学習すること |
| --- | --- |
| `/`・`/login` | 通常ログインと次の認証手順 |
| `/signup` | 新規登録とユーザー属性 |
| `/verify` | 登録確認・再送信・自動サインイン |
| `/mfa/setup` | TOTP初回設定のQRコード・キー表示と確認 |
| `/mfa` | 登録済みMFAのコード確認 |
| `/home` | セッション確認・ユーザー表示・サインアウト |

## AWSへ接続する前の準備

`.env.example`を参考に`.env.local`へUser Pool IDとApp Client IDを設定します。
既存の`.env`がある場合はその設定も使用できます。環境変数はC01を実装するまで使われません。

Cognito側はメールアドレスでのサインイン、コードでの登録確認、クライアントシークレットなしのブラウザ用App Clientを設定します。
TOTPの初回設定を学ぶときは、認証アプリによるMFAを有効にして必須にしてください。
MFAが任意で未登録の場合、ログイン時に初回設定チャレンジが返らない場合があります。

課題の対象はメール登録確認・パスワードログイン・自動サインイン・TOTPです。
SMS・メールコードの入力UIもありますが、パスワードリセット、強制パスワード変更、外部IdPは別課題です。

## 確認

```bash
npm run lint
npx next build --webpack
npm run test:auth
```

**未実装の`main`ではLint・ビルドは通り、`test:auth`の9件は失敗します。**
認証結果の遷移分岐（C02）とエラー処理（C13）を実装し、テストが通ることを確認してください。
このテストはローカルの判定処理だけを検証します。Cognito APIの接続は、[問題集のチェック手順](docs/exercises.md#チェック方法)で確認します。
テストにはNode.js 22.6以降が必要です。

## 実装例を確認する

```bash
# 自分の変更をコミットしてから切り替える
git switch myStudy

# 問題集に戻る
git switch main
```

ブランチ間の差分でも、課題と実装例を比較できます。

```bash
git diff main..myStudy -- app/login/page.tsx
```

参考: [Amplifyのサインアップ](https://docs.amplify.aws/nextjs/frontend/auth/sign-up/)・[ログインとMFA](https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/)
