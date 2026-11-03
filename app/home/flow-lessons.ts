// 基本課題の参考コードです。表示専用で、認証処理として実行しません。
export const flowLessons = [
  {
    "id": "C01",
    "title": "Cognitoにつなぐ",
    "api": "Amplify.configure",
    "chapter": "準備",
    "description": "最初に、アプリが使うUser PoolとApp Clientを指定します。設定はクライアント側で読み込みます。",
    "points": [
      "User Pool IDとApp Client IDは環境変数から取得。",
      "AuthProviderから設定ファイルをimportして初期化。",
      "ユーザー登録やログインより先に実行する。"
    ],
    "outcome": "初期設定ができたら、会員登録へ。",
    "file": "lib/amplify.ts",
    "code": "Amplify.configure({\n  Auth: {\n    Cognito: {\n      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,\n      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,\n    },\n  },\n});",
    "resultTitle": "",
    "results": []
  },
  {
    "id": "C04",
    "title": "アカウントを作る",
    "api": "signUp",
    "chapter": "新規登録",
    "description": "メールアドレスとパスワードをCognitoへ送って、ユーザーを登録します。",
    "points": [
      "メールアドレスとパスワードをCognitoへ送る。",
      "emailをユーザー属性として登録する。",
      "確認が必要なら/verifyへ進む。"
    ],
    "outcome": "CONFIRM_SIGN_UPなら、メールのコード確認へ。",
    "file": "app/signup/page.tsx",
    "code": "const { nextStep } = await signUp({\n  username: email,\n  password,\n  options: { userAttributes: { email } },\n});\nif (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {\n  router.replace('/verify');\n} else if (nextStep.signUpStep === 'DONE') {\n  router.replace('/login');\n}",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "コード確認が必要",
        "data": "{\n  \"isSignUpComplete\": false,\n  \"userId\": \"<ユーザーID>\",\n  \"nextStep\": {\n    \"signUpStep\": \"CONFIRM_SIGN_UP\",\n    \"codeDeliveryDetails\": {\n      \"deliveryMedium\": \"EMAIL\",\n      \"destination\": \"y***@e***.com\",\n      \"attributeName\": \"email\"\n    }\n  }\n}",
        "meaning": "メールは送信済みですが登録確認は未完了。/verifyでconfirmSignUpを呼びます。"
      },
      {
        "label": "登録が完了",
        "data": "{\n  \"isSignUpComplete\": true,\n  \"userId\": \"<ユーザーID>\",\n  \"nextStep\": {\n    \"signUpStep\": \"DONE\"\n  }\n}",
        "meaning": "追加の登録確認は不要。ログイン済みという意味ではないため、通常ログインへ進みます。"
      }
    ]
  },
  {
    "id": "C06",
    "title": "メールのコードを確認する",
    "api": "confirmSignUp",
    "chapter": "登録確認",
    "description": "メールに届いたコードで登録を確認します。完了後はログイン画面へ進みます。",
    "points": [
      "confirmSignUpへメールとコードを渡す。",
      "登録確認とログインは別の処理。",
      "成功したら/loginへ進む。"
    ],
    "outcome": "メール確認 → ログイン。",
    "file": "app/verify/page.tsx",
    "code": "await confirmSignUp({ username: email, confirmationCode: code });\nrouter.replace('/login');",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "confirmSignUp：通常完了",
        "data": "{\n  \"isSignUpComplete\": true,\n  \"nextStep\": {\n    \"signUpStep\": \"DONE\"\n  }\n}",
        "meaning": "登録確認は成功しました。/loginへ移動してsignInを呼びます。"
      }
    ]
  },
  {
    "id": "C07",
    "title": "コードをもう一度届ける",
    "api": "resendSignUpCode",
    "chapter": "必要なとき",
    "description": "コードが期限切れ、またはメールが届かないときは、登録先へ新しいコードを送ります。",
    "points": [
      "登録時と同じメールアドレスを指定。",
      "再送後は古い入力コードをクリア。",
      "登録確認が完了したユーザーには再送しない。"
    ],
    "outcome": "最新のメールのコードで、登録確認を再開。",
    "file": "app/verify/page.tsx",
    "code": "await resendSignUpCode({ username: email.trim() });\nsetCode('');\nsetMessage('認証コードを再送信しました。最新のメールを確認してください。');",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "再送信先の情報",
        "data": "{\n  \"deliveryMedium\": \"EMAIL\",\n  \"destination\": \"y***@e***.com\",\n  \"attributeName\": \"email\"\n}",
        "meaning": "メールを再送した宛先情報が返ります。nextStepはありません。入力を空にして最新のコードを待ちます。"
      }
    ]
  },
  {
    "id": "C05",
    "title": "通常ログインを始める",
    "api": "signIn",
    "chapter": "通常ログイン",
    "description": "自動サインインを使わない場合や、サインアウト後はここからログインします。",
    "points": [
      "signInを呼ぶ。",
      "isSignedInでログイン完了を確認する。",
      "nextStepの分岐はこのページ内に直接書く。"
    ],
    "outcome": "ログイン結果からホーム・MFA・初回設定へ。",
    "file": "app/login/page.tsx",
    "code": "const { isSignedIn, nextStep } = await signIn({ username: email, password });\nif (isSignedIn) {\n  router.replace('/home');\n} else {\n  setNextStep(nextStep);\n  switch (nextStep.signInStep) {\n    case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':\n      router.replace('/mfa/setup');\n      break;\n    case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':\n      router.replace('/mfa');\n      break;\n    case 'CONFIRM_SIGN_UP':\n      router.replace('/verify');\n      break;\n    default:\n      setError(`今回の基本課題の対象外です: ${nextStep.signInStep}`);\n  }\n}",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "ログイン完了",
        "data": "{\n  \"isSignedIn\": true,\n  \"nextStep\": {\n    \"signInStep\": \"DONE\"\n  }\n}",
        "meaning": "追加の確認が不要なので/homeへ進みます。"
      },
      {
        "label": "登録済みTOTPの確認",
        "data": "{\n  \"isSignedIn\": false,\n  \"nextStep\": {\n    \"signInStep\": \"CONFIRM_SIGN_IN_WITH_TOTP_CODE\"\n  }\n}",
        "meaning": "パスワード確認後、認証アプリのコードが必要。/mfaへ進みます。"
      },
      {
        "label": "初回のTOTP設定",
        "data": "{\n  \"isSignedIn\": false,\n  \"nextStep\": {\n    \"signInStep\": \"CONTINUE_SIGN_IN_WITH_TOTP_SETUP\",\n    \"totpSetupDetails\": {\n      \"sharedSecret\": \"<共有秘密鍵>\",\n      \"getSetupUri\": \"<関数：設定用URLを生成>\"\n    }\n  }\n}",
        "meaning": "/mfa/setupでQRを表示します。getSetupUriは実際には関数です。ここでは説明用の文字列で表しています。"
      },
      {
        "label": "登録確認が未完了",
        "data": "{\n  \"isSignedIn\": false,\n  \"nextStep\": {\n    \"signInStep\": \"CONFIRM_SIGN_UP\"\n  }\n}",
        "meaning": "ログインの前にメール確認が必要。/verifyへ戻してconfirmSignUpを呼びます。"
      }
    ]
  },
  {
    "id": "C09",
    "title": "認証アプリを初めて登録する",
    "api": "totpSetupDetails",
    "chapter": "TOTP初回設定",
    "description": "初回設定のチャレンジで受け取った情報を、QRコードと手動登録キーとして表示します。",
    "points": [
      "CONTINUE_SIGN_IN_WITH_TOTP_SETUPの場合だけ設定情報を取得。",
      "getSetupUriのURIを、ブラウザ内でQRコードに変換。",
      "sharedSecretは手動登録に使用。アプリの永続ストレージには保存しない。"
    ],
    "outcome": "アプリに登録したら、表示される6桁のコードで確認。",
    "file": "app/mfa/setup/page.tsx",
    "code": "// Pageの中：loginで保存した値からQRを作ります。\nconst { nextStep, setNextStep } = useAuthFlow();\nconst details = nextStep?.signInStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP'\n  ? nextStep.totpSetupDetails : null;\n\n// JSX内（detailsがない場合はログインからやり直す案内を表示）\n// qrCode={<QRCodeSVG value={details.getSetupUri('Cognito Study').toString()} />}\n// setupKey={details.sharedSecret}\n\n// handleSetup内：認証アプリのコードで設定を確定します。\nconst { isSignedIn } = await confirmSignIn({ challengeResponse: code });\nif (isSignedIn) {\n  setNextStep(null);\n  router.replace('/home');\n}",
    "resultTitle": "受け取る設定データの例",
    "results": [
      {
        "label": "初回設定のnextStep",
        "data": "{\n  \"signInStep\": \"CONTINUE_SIGN_IN_WITH_TOTP_SETUP\",\n  \"totpSetupDetails\": {\n    \"sharedSecret\": \"<共有秘密鍵>\",\n    \"getSetupUri\": \"<関数：設定用URLを生成>\"\n  }\n}",
        "meaning": "nextStep.totpSetupDetailsから取得します。getSetupUriは実際には関数で、URLを返します。秘密鍵は例示のみで、実際の値は表示用ログに出しません。"
      },
      {
        "label": "設定コード確認後",
        "data": "{\n  \"isSignedIn\": true,\n  \"nextStep\": {\n    \"signInStep\": \"DONE\"\n  }\n}",
        "meaning": "confirmSignInの結果がisSignedIn: trueなら登録・ログインが完了し、/homeへ進みます。"
      }
    ]
  },
  {
    "id": "C08",
    "title": "MFAのコードを確認する",
    "api": "confirmSignIn",
    "chapter": "追加認証",
    "description": "認証アプリのコードをCognitoに渡し、ログインの追加手順を完了させます。",
    "points": [
      "confirmSignInへコードを渡す。",
      "isSignedInがtrueなら完了。",
      "共有値を消して/homeへ進む。"
    ],
    "outcome": "isSignedInがtrueなら、ホームが表示される。",
    "file": "app/mfa/page.tsx",
    "code": "const { isSignedIn } = await confirmSignIn({ challengeResponse: code });\nif (isSignedIn) {\n  setNextStep(null);\n  router.replace('/home');\n}",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "MFA確認が完了",
        "data": "{\n  \"isSignedIn\": true,\n  \"nextStep\": {\n    \"signInStep\": \"DONE\"\n  }\n}",
        "meaning": "追加認証が完了。このページで/homeへ遷移します。"
      }
    ]
  },
  {
    "id": "C10",
    "title": "ログイン状態とユーザーを確認する",
    "api": "fetchAuthSession",
    "chapter": "ホーム",
    "description": "保存済みセッションを取得し、ホームに表示するユーザー情報を取り出します。",
    "points": [
      "トークンがなければ、ログイン画面へ戻す。",
      "IDトークンのemailを画面に表示。",
      "ブラウザの確認とは別に、APIではサーバー側でトークンを検証する。"
    ],
    "outcome": "ホームにユーザーを表示。次はサインアウト。",
    "file": "app/home/home-session.tsx",
    "code": "// Pageの先頭にnameのstateとuseRouterを用意します。\nuseEffect(() => {\n  async function loadSession() {\n    try {\n      const { tokens } = await fetchAuthSession();\n      if (!tokens?.idToken) {\n        router.replace('/login');\n        return;\n      }\n      setName(String(tokens.idToken.payload.email ?? 'ユーザー'));\n    } catch (error) {\n      setError(error instanceof Error ? error.message : 'セッションを確認できませんでした。');\n    }\n  }\n  loadSession();\n}, [router]);",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "ログイン済み",
        "data": "{\n  \"tokens\": {\n    \"accessToken\": {\n      \"payload\": {\n        \"sub\": \"<ユーザーID>\",\n        \"token_use\": \"access\"\n      }\n    },\n    \"idToken\": {\n      \"payload\": {\n        \"sub\": \"<ユーザーID>\",\n        \"token_use\": \"id\",\n        \"name\": \"山田 太郎\",\n        \"email\": \"you@example.com\"\n      }\n    }\n  }\n}",
        "meaning": "主要フィールドだけを抜粋しています。tokens内のトークンは実際にはJWTオブジェクト。IDトークンのemailを表示に使います。"
      },
      {
        "label": "ログイン情報なし",
        "data": "{}",
        "meaning": "未ログインの場合はtokensがないため/loginへ。期限切れ時の更新失敗などは例外になる場合もあります。"
      }
    ]
  },
  {
    "id": "C11",
    "title": "セッションを終了する",
    "api": "signOut",
    "chapter": "サインアウト",
    "description": "ログイン状態を終了し、別アカウントや次のログインを試せる状態に戻します。",
    "points": [
      "トークンの削除はAmplify Authに任せる。",
      "Contextの進行中のチャレンジもクリア。",
      "ログイン画面へ戻して、一連の流れをもう一度確認。"
    ],
    "outcome": "サインアウト後は、signInから再開。",
    "file": "app/home/home-session.tsx",
    "code": "await signOut();\nsetNextStep(null);\nrouter.replace('/login');",
    "resultTitle": "",
    "results": []
  }
] as const;
