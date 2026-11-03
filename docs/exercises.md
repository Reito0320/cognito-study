# 認証とLambdaの問題集

まずAmplify Authで「登録して、ログインできる」ところまで作ります。それができたら、Lambdaで「ログインした人だけが呼べるAPI」を作ります。

## はじめに

画面と入力欄は用意してあります。自分で書くのは、コメントで指定した処理です。

1. 対象のファイルを開き、`[COGNITO Cxx START]`を探します。
2. コメントを1行ずつ実際のコードにします。コメントは残して構いません。
3. 仮置きの`throw new Error('TODO ...')`を自分の処理に置き換えます。
4. ブラウザで動かして、できたら次へ進みます。

SDKは「AWSに処理をお願いするための関数」です。たとえば`signUp`は登録、`signIn`はログインをお願いします。`aws-amplify/auth`から必要な関数をimportします。

画面を移動するときは`useRouter`を`next/navigation`からimportし、Pageの先頭で`const router = useRouter()`を用意します。移動は`router.replace('/login')`のように書きます。

認証の共通関数は作らず、そのページのハンドラーに直接書いてください。エラーは用意済みのcatchで表示できます。

## 第1部：Amplify Authで認証する

### 1. Cognitoにつなぐ（C01）

**場所：`lib/amplify.ts`**

最初に「どのCognitoを使うか」を指定します。

1. `.env.example`を参考に`.env.local`へUser Pool IDとApp Client IDを書きます。
2. `Amplify`を`aws-amplify`からimportします。
3. `Amplify.configure`を呼び、`Auth.Cognito.userPoolId`と`userPoolClientId`へ環境変数の値を渡します。

**確認：** アプリを起動でき、次の課題でCognitoへ登録を送れる準備ができること。

Cognito側はメールアドレスでのログイン、メールコードによる登録確認、シークレットなしのApp Client、認証アプリ（TOTP）のみの必須MFAに設定します。TOTPは認証アプリが作る短いコードのことです。

### 2. ユーザーを登録する（C04）

**場所：`app/signup/page.tsx`の`handleSignup`**

1. `signUp`をimportします。
2. 入力済みの`email`を`username`に、`password`を`password`に渡します。
3. `options.userAttributes`にも`{ email }`を渡します。
4. 返ってきた`nextStep.signUpStep`を見ます。`CONFIRM_SIGN_UP`なら`/verify`へ、`DONE`なら`/login`へ進みます。

**確認：** 登録ボタンを押すと確認用メールが届き、確認画面へ進むこと。

ここでは自動サインインを設定しません。まずは「登録」と「ログイン」を分けて覚えます。

### 3. メールのコードを確認する（C06）

**場所：`app/verify/page.tsx`の`handleVerify`**

1. `confirmSignUp`をimportします。
2. `username`に`email`、`confirmationCode`に入力済みの`code`を渡します。
3. 成功したら`/login`へ進みます。

**確認：** 正しいコードならログイン画面へ進み、間違ったコードならエラーが表示されること。

メール確認は「このメールを受け取れる本人だ」と確認する処理です。まだログインはしていません。

### 4. コードをもう一度送る（C07）

**場所：`app/verify/page.tsx`の`handleResend`**

1. `resendSignUpCode`をimportします。
2. `username`に`email`を渡して呼びます。
3. 成功したら`setCode('')`で入力欄を空にし、`setMessage`で再送したことを表示します。

**確認：** 登録確認が終わっていないメールアドレスで再送し、新しいコードが届くこと。

### 5. ログインする（C05）

**場所：`app/login/page.tsx`の`handleLogin`**

1. `signIn`をimportします。
2. `username`に`email`、`password`に入力済みの`password`を渡します。
3. 結果の`isSignedIn`を見ます。`true`ならログイン完了なので`/home`へ進みます。
4. `false`なら、まだ追加の作業があります。`setNextStep(nextStep)`で結果を保存してから、下の表に沿って移動します。

| `nextStep.signInStep` | 意味 | 移動先 |
| --- | --- | --- |
| `CONTINUE_SIGN_IN_WITH_TOTP_SETUP` | 初めてなので認証アプリを登録する | `/mfa/setup` |
| `CONFIRM_SIGN_IN_WITH_TOTP_CODE` | 登録済みの認証アプリのコードを確認する | `/mfa` |
| `CONFIRM_SIGN_UP` | メールの確認がまだ終わっていない | `/verify` |

**確認：** 初回ログインで認証アプリの設定画面へ進むこと。まずはここまでできれば次の課題へ進めます。

`nextStep`は「次に何をすればよいか」という案内です。別の値が返ったら、その名前を画面に表示し、Cognitoの設定が前提と合っているか確認してください。

### 6. 認証アプリを登録する（C09）

**場所：`app/mfa/setup/page.tsx`**

この課題は「QRを表示する」「コードを送る」の2つに分けます。

**先にQRを表示します（C09-DATA）。**

1. `useAuthFlow`から`nextStep`を受け取ります。これは前のページで保存した値です。
2. `nextStep?.signInStep`が`CONTINUE_SIGN_IN_WITH_TOTP_SETUP`なら、`nextStep.totpSetupDetails`を取り出します。
3. `QRCodeSVG`を`qrcode.react`からimportします。`getSetupUri('Cognito Study').toString()`をその`value`に渡し、フォームの`qrCode`へ表示します。
4. `sharedSecret`をフォームの`setupKey`へ渡します。これはQRを読めない場合に手入力するキーです。

**次に、設定を確定します（handleSetup）。**

1. スマートフォンの認証アプリでQRを読み取ります。
2. アプリに表示されたコードを画面に入力します。
3. `confirmSignIn({ challengeResponse: code })`を呼びます。
4. 結果の`isSignedIn`が`true`なら、`setNextStep(null)`で共有値を消し、`/home`へ進みます。

**確認：** QRが読めて、コードの送信後にホームへ進むこと。

共有値はページを再読み込みすると消えます。値がない場合はログインからやり直す案内を表示してください。共有秘密鍵はURLやログに書かず、永続保存もしません。

### 7. 登録済みの認証アプリで確認する（C08）

**場所：`app/mfa/page.tsx`の`handleMfa`**

1. `confirmSignIn`をimportします。
2. `challengeResponse`に入力された`code`を渡します。
3. 結果の`isSignedIn`が`true`なら、`setNextStep(null)`を呼び、`/home`へ進みます。`setNextStep`は`useAuthFlow`から受け取ります。

**確認：** 後のサインアウト課題を終えたら、もう一度ログインして試します。初回設定のQRではなくコード入力画面が表示され、正しいコードでホームへ進むこと。

### 8. ログイン状態を確認する（C10）

**場所：`app/home/home-session.tsx`**

1. 表示用のメールを保存するstateを用意します。
2. `useEffect`の中で`fetchAuthSession()`を呼びます。
3. `tokens?.idToken`があれば、その`payload.email`を表示します。
4. トークンがなければ`/login`へ移動します。通信などのエラーはcatchで画面に表示します。

**確認：** ホームに自分のメールアドレスが表示されること。未ログインで直接ホームを開くとログイン画面へ戻ること。

トークンは、ログインしたことを示す文字列です。ホームでの確認は画面表示のための処理で、APIを守る仕組みは第2部で作ります。

### 9. サインアウトする（C11）

**場所：`app/home/home-session.tsx`の`handleSignOut`**

1. `signOut()`を呼びます。
2. `useAuthFlow`から受け取った`setNextStep`で`setNextStep(null)`を呼びます。
3. `/login`へ進みます。

**確認：** サインアウト後にログインし直すと、課題7のコード入力画面へ進むこと。

## 第1部の確認

次の2つが通れば、第2部へ進めます。

- 新規登録 → メール確認 → ログイン → 認証アプリの初回設定 → ホーム
- サインアウト → ログイン → 認証アプリのコード確認 → ホーム

コードの間違いでエラーが出ること、メールコードを再送できることも試してください。

```bash
npm run lint
npx next build --webpack
```

空欄のままでもUIとビルドを確認できます。実際の認証はCognitoに接続して確認します。ホームの学習カードに参考コードがあります。

## 第2部：Lambdaでログイン後のAPIを作る

目標は、ホームのボタンを押すとLambdaからメッセージと自分のユーザーIDが返ることです。登録・ログイン・MFAは第1部のAmplify Authをそのまま使います。

流れは「画面 → API Gateway → Lambda → 画面」です。API Gatewayはリクエストの入口、LambdaはAWS上で実行される処理です。初めはAWSコンソールで1つずつ設定します。自動デプロイやデータベースはまだ不要です。

### 10. Lambdaからメッセージを返す（L07）

**場所：`lambda/study-message/index.mjs`**

1. コメントの下に、`statusCode: 200`の応答を書きます。
2. `body`には`JSON.stringify({ message: 'Lambdaからこんにちは' })`を入れます。
3. AWSコンソールでNode.jsのLambdaを作り、ファイルを貼り付けます。ハンドラー名は`index.handler`です。
4. コンソールのテストで実行します。この段階ではAPIを公開する必要はありません。

**確認：** テストの結果にステータス200とメッセージが表示されること。

### 11. ログインした人だけが呼べる入口を作る（L08）

**場所：AWSコンソールのAPI Gateway（HTTP API）**

1. HTTP APIを作り、`GET /study-message`を先ほどのLambdaへ接続します。Lambda統合のペイロード形式は`2.0`にします。
2. JWTオーソライザーを作ります。これはCognitoのトークンを確かめる係です。
3. トークンの取得元は`$request.header.Authorization`、Issuerは`https://cognito-idp.<リージョン>.amazonaws.com/<User Pool ID>`、AudienceはApp Client IDにします。
4. そのオーソライザーを`GET /study-message`に設定します。ルートの認可スコープには`aws.cognito.signin.user.admin`を指定します。これは今回のパスワードログインで取得するアクセストークンのスコープを使う学習用の設定です。
5. CORSで開発画面のオリジン（通常`http://localhost:3000`）、メソッド`GET`、ヘッダー`Authorization`を許可します。
6. APIをデプロイします（自動デプロイなら設定の反映を確認）。API GatewayにLambdaを実行する権限があることも確認します。

**確認：** トークンなしでこのURLを開いても、メッセージは返らず401になること。ログイン後の成功確認は次の課題で行います。

今回のスコープは学習用です。実際のアプリで操作別の権限が必要になったら、そのAPI用のスコープを設計します。

### 12. ホームからAPIを呼ぶ（L09）

**場所：`app/home/lambda-exercise.tsx`の`handleRequest`**

ホームに練習用ボタンは用意済みです。`[LAMBDA L09 START]`〜`END`に書きます。

1. `.env.local`に`NEXT_PUBLIC_STUDY_API_URL`を追加し、課題11のルートまでのURLを書きます。例：`https://<API ID>.execute-api.<リージョン>.amazonaws.com/study-message`。ステージ名がある場合はパスに含めます。開発サーバーを再起動します。
2. `fetchAuthSession`を`aws-amplify/auth`からimportして呼びます。
3. `tokens?.accessToken`がなければ、ログインし直すようエラーを表示します。
4. `accessToken.toString()`を取り出し、`fetch`の`Authorization`ヘッダーに`Bearer <トークン>`として付けて送ります。
5. `response.ok`がfalseならエラーを表示します。成功なら`response.json()`を読み、`setMessage(data.message)`で表示します。

**確認：** ログインしてからボタンを押すと、Lambdaのメッセージが表示されること。トークンは画面やログに表示しません。

### 13. Lambdaで呼び出した人を知る（L10）

**場所：`lambda/study-message/index.mjs`**

1. L07の応答を、L10のコメントに沿って書き換えます。
2. `event.requestContext.authorizer.jwt.claims.sub`を取り出します。`sub`はCognitoのユーザーごとのIDです。
3. 返すJSONに`userId`として追加します。画面から送られたユーザーIDを使う必要はありません。
4. ホーム側のL09で、`data.userId`も`setMessage`に渡す文字列へ追加します。

**確認：** 自分のIDが表示され、別のユーザーでログインするとIDが変わること。IDトークンやトークンなしのリクエストではAPIを呼べないことも確認します。

コンソールでL10をテストするときは、上の構造のテストイベントを作って`sub`に仮の値を入れます。これは処理単体の練習です。実際のトークン検証は課題11のAPI Gateway経由で確認してください。

## さらに練習したい場合

- C12：ログイン画面にも現在のユーザーを表示する
- 自動サインイン：メール確認の後、そのままログインを続ける
- SMSやメールによるMFA、エラー名ごとの案内
- L01〜L06：既存の各ページにあるコメントを使い、登録・ログイン・コード確認自体をLambda経由へ置き換える。サーバー側の認証セッションやトークン管理も必要になるため、第2部の後の別課題とします。直接のAmplify呼び出しと二重実行しないようにします

## 参考資料

- [Amplifyの登録処理](https://docs.amplify.aws/nextjs/frontend/auth/sign-up/)
- [AmplifyのログインとMFA](https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/)
- [API GatewayのJWTオーソライザー](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)
- [HTTP APIとLambdaの接続](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html)
