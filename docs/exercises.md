# Cognito認証の問題集

Cognitoで新規登録、メール確認、ログイン、認証アプリによるMFA、セッションの確認、サインアウトを実装します。下の9つの課題をすべて実装し、最後の完了チェックを満たせば、この問題集は完了です。

## はじめに

画面と入力欄は用意してあります。自分で書くのは、コメントで指定した処理です。

1. 対象のファイルを開き、`[COGNITO Cxx START]`を探します。
2. コメントを1行ずつ実際のコードにします。コメントは残して構いません。
3. 仮置きの`throw new Error('TODO ...')`を自分の処理に置き換えます。
4. ブラウザで動かして、できたら次へ進みます。

この問題集では、Cognitoの認証を呼び出すライブラリとしてAmplify Authを使います。SDKは「Cognitoに処理をお願いするための関数」です。たとえば`signUp`は登録、`signIn`はログインをお願いします。`aws-amplify/auth`から必要な関数をimportします。

画面を移動するときは`useRouter`を`next/navigation`からimportし、Pageの先頭で`const router = useRouter()`を用意します。移動は`router.replace('/login')`のように書きます。

認証の共通関数は作らず、そのページのハンドラーに直接書いてください。エラーは用意済みのcatchで表示できます。

## Cognito認証を実装する

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

スマートフォンにTOTP対応の認証アプリを用意してください。`/mfa/setup`の「認証アプリを用意する」を確認して進めます。

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

### 7. 初回ログインのセッションを終了する（C11）

**場所：`app/home/home-session.tsx`の`handleSignOut`**

初回のMFA設定でホームへ進めたら、次はサインアウトを実装します。いったんセッションを終了してから、2回目以降のログインに必要なMFAを作ります。

1. `signOut`を`aws-amplify/auth`からimportします。
2. `await signOut({ global: true })`を呼び、全端末のリフレッシュトークンを失効させ、このブラウザに保存された認証情報も削除します。
3. `useAuthFlow`から受け取った`setNextStep`で`setNextStep(null)`を呼びます。
4. `useRouter`で`/login`へ進みます。

**確認：** 初回MFA設定後のホームでサインアウトを押すと、ログイン画面へ戻ること。ブラウザを再読み込みしてもセッションが復元されないことを`fetchAuthSession()`の`tokens`がないことで確認します。確認用コードでトークンの値は画面やログに出さないでください。この時点では2回目以降のMFAは未実装なので、再ログインの完了は次の課題で確認します。

`global: true`は他の端末もサインアウトさせます。Cognitoでの失効後も、署名と有効期限だけでJWTを検証するAPIは、発行済みJWTを期限まで受け付ける場合があります。「サインアウト直後にすべてのAPIでJWTが使えなくなる」という意味ではありません。[Cognitoのトークン失効の説明](https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html)も参照してください。

### 8. 2回目以降のMFAを実装する（C08）

**場所：`app/mfa/page.tsx`の`handleMfa`**

1. `confirmSignIn`をimportします。
2. `challengeResponse`に入力された`code`を渡します。
3. 結果の`isSignedIn`が`true`なら、`setNextStep(null)`を呼び、`/home`へ進みます。`setNextStep`は`useAuthFlow`から受け取ります。

**確認：** サインアウト済みのアカウントでメールアドレスとパスワードを入力すると、`CONFIRM_SIGN_IN_WITH_TOTP_CODE`が返り、`/mfa`へ進むこと。初回設定のQRは表示されず、登録済みアプリの正しいコードでホームへ進み、間違ったコードではエラーになること。

### 9. セッションからメールアドレスを表示する（C10）

**場所：`app/home/home-session.tsx`**

1. 表示用の`userInfo`と`setUserInfo`は用意済みです。初期値は未実装時の案内文なので、stateや表示用の`<p>`を追加する必要はありません。
2. `useEffect`と`fetchAuthSession`をimportし、`useEffect`の中で`fetchAuthSession()`を呼びます。`useRouter`も用意します。
3. `tokens?.idToken`があれば、`setUserInfo(String(tokens.idToken.payload.email ?? 'ユーザー'))`で案内文をメールアドレスに置き換えます。
4. トークンがなければ`/login`へ移動します。通信などのエラーはcatchで画面に表示します。

**確認：** 再ログインしてMFAを完了すると、ホーム上部の案内文が自分のメールアドレスに置き換わること。サインアウト後、未ログインで直接ホームを開くとログイン画面へ戻ること。

トークンは、ログインしたことを示す文字列です。この課題では、Cognitoのセッションに含まれるIDトークンからメールアドレスを取り出し、ログイン状態に応じて表示と画面遷移を切り替えます。トークンの値を画面やログに出さないでください。

## 完了チェック

課題1〜9（C01・C04〜C11）をすべて実装し、次の項目をすべて確認できれば、この問題集は完了です。

- [ ] 新規登録すると確認メールが届き、メール確認画面へ進む。
- [ ] 正しいメールコードで確認が完了し、ログイン画面へ進む。
- [ ] メール確認前にコードを再送でき、入力欄が空になり、再送メッセージが表示される。
- [ ] 初回ログインで認証アプリの設定画面へ進み、QRコードと手入力用キーを表示できる。
- [ ] 認証アプリの正しいコードで初回設定を完了し、ホームへ進む。
- [ ] サインアウトするとログイン画面へ戻り、再読み込みしてもセッションが復元されない。
- [ ] 2回目以降のログインでは初回設定のQRコードを表示せず、認証アプリのコード確認画面へ進む。
- [ ] 登録済みの認証アプリの正しいコードでホームへ進み、自分のメールアドレスが表示される。
- [ ] 間違ったメールコードや認証アプリのコードではエラーが表示され、認証完了として画面遷移しない。
- [ ] 未ログインで直接`/home`を開くと、ログイン画面へ戻る。
- [ ] 初回設定画面を再読み込みして共有値が消えた場合、ログインからやり直す案内が表示される。
- [ ] トークンの値を画面やログに出さず、共有秘密鍵をURLやログに書いたり永続保存したりしていない。

確認する流れは次の2つです。

1. 新規登録 → メール確認 → ログイン → 認証アプリの初回設定 → ホームでメールアドレスを表示
2. サインアウト → ログイン → 登録済みの認証アプリのコード確認 → ホームでメールアドレスを表示

両方の流れと上記のチェックを確認できたら、Cognito認証のハンズオンは終了です。追加の課題はありません。

## 参考資料

- [Cognitoへの登録を行うSDKの使い方](https://docs.amplify.aws/nextjs/frontend/auth/sign-up/)
- [CognitoへのログインとMFAを行うSDKの使い方](https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/)
- [Cognitoのトークン失効](https://docs.aws.amazon.com/cognito/latest/developerguide/token-revocation.html)
