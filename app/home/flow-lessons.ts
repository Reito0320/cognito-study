// myStudy（032b1b1）の実装から抜粋した表示専用のコードです。認証処理として実行しません。
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
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "初期設定完了",
        "data": "undefined",
        "meaning": "戻り値で画面を分岐しません。設定を読み込んだ後、signUpやsignInを呼びます。"
      }
    ]
  },
  {
    "id": "C04",
    "title": "アカウントを作る",
    "api": "signUp",
    "chapter": "新規登録",
    "description": "メールアドレスとパスワードをCognitoへ送って、ユーザーを登録します。",
    "points": [
      "usernameは今回のログインに使うメールアドレス。",
      "userAttributesにはユーザー情報としてemailを登録。",
      "autoSignInを有効にし、確認後のログインに備える。"
    ],
    "outcome": "CONFIRM_SIGN_UPなら、メールのコード確認へ。",
    "file": "app/signup/page.tsx",
    "code": "const { nextStep } = await signUp({\n  username: email.trim(), password,\n  options: { userAttributes: { email: email.trim() }, autoSignIn: true },\n});\nswitch (nextStep.signUpStep) {\n  case 'CONFIRM_SIGN_UP': router.replace('/verify'); return;\n  case 'COMPLETE_AUTO_SIGN_IN':\n    try { await continueSignIn(await autoSignIn()); }\n    catch (error) { setError(`登録は完了しました。${authErrorMessage(error)}`); }\n    return;\n  case 'DONE': router.replace('/login'); return;\n}",
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
    "api": "confirmSignUp / autoSignIn",
    "chapter": "登録確認",
    "description": "メールに届いたコードを確認し、登録完了後の手順へ進みます。登録確認とログインは別の処理です。",
    "points": [
      "コード確認に成功したら、確認済みの状態を保持。",
      "COMPLETE_AUTO_SIGN_INならautoSignInを呼ぶ。",
      "自動ログインだけ失敗した場合、登録確認はやり直さない。"
    ],
    "outcome": "自動ログインの結果で分岐。DONEなら通常ログインへ。",
    "file": "app/verify/page.tsx",
    "code": "const { nextStep } = await confirmSignUp({\n  username: email.trim(), confirmationCode: code,\n});\nsetIsConfirmed(true);\n\nif (nextStep.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {\n  try {\n    await continueSignIn(await autoSignIn());\n  } catch (error) {\n    // メール確認は成功済み。自動ログインの失敗と区別します。\n    setMessage('メールアドレスの確認は完了しました。');\n    setError(authErrorMessage(error));\n  }\n} else {\n  router.replace('/login');\n}",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "confirmSignUp：通常完了",
        "data": "{\n  \"isSignUpComplete\": true,\n  \"nextStep\": {\n    \"signUpStep\": \"DONE\"\n  }\n}",
        "meaning": "登録確認は成功しました。/loginへ移動してsignInを呼びます。"
      },
      {
        "label": "confirmSignUp：自動ログインへ",
        "data": "{\n  \"isSignUpComplete\": true,\n  \"nextStep\": {\n    \"signUpStep\": \"COMPLETE_AUTO_SIGN_IN\"\n  }\n}",
        "meaning": "autoSignInを呼びます。この時点ではログイン完了とは限りません。"
      },
      {
        "label": "autoSignIn：MFAが必要",
        "data": "{\n  \"isSignedIn\": false,\n  \"nextStep\": {\n    \"signInStep\": \"CONFIRM_SIGN_IN_WITH_TOTP_CODE\"\n  }\n}",
        "meaning": "autoSignInの結果はsignInStepで判断。isSignedInがfalseなら/mfaでコードを確認します。"
      },
      {
        "label": "autoSignIn：ログイン完了",
        "data": "{\n  \"isSignedIn\": true,\n  \"nextStep\": {\n    \"signInStep\": \"DONE\"\n  }\n}",
        "meaning": "isSignedInがtrueなので/homeへ。登録のsignUpStepとログインのsignInStepを区別します。"
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
      "メールアドレスとパスワードを送る。",
      "ログイン完了とは限らないので、結果を共通処理へ渡す。",
      "MFAやメール確認など、nextStepの手順を続ける。"
    ],
    "outcome": "結果をcontinueSignInへ。次のカードで分岐を確認。",
    "file": "app/login/page.tsx",
    "code": "const result = await signIn({ username: email.trim(), password });\nawait continueSignIn(result);",
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
    "id": "C03 / C02",
    "title": "次に進む画面を決める",
    "api": "nextStep / confirmSignIn",
    "chapter": "共通の分岐",
    "description": "通常ログイン・自動サインイン・MFA確認の結果を、同じルールで扱います。",
    "points": [
      "MFA方式の選択が必要なら、利用可能なTOTPを選ぶ。",
      "初回設定は/mfa/setup、登録済みコード確認は/mfaへ。",
      "isSignedInがtrueになったら/homeへ進む。"
    ],
    "outcome": "必要なチャレンジへ。完了済みならホームへ。",
    "file": "app/components/auth-provider.tsx · lib/auth-flow.ts",
    "code": "async function continueSignIn(result: SignInOutput): Promise<void> {\n  const step = result.nextStep;\n  // このハンズオンでは、選択が必要な場合はTOTPを選びます。\n  if (!result.isSignedIn && (\n    step.signInStep === 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION' ||\n    step.signInStep === 'CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION'\n  )) {\n    if (!step.allowedMFATypes?.includes('TOTP')) {\n      throw new Error('CognitoでTOTPを有効にしてください。');\n    }\n    return continueSignIn(await confirmSignIn({ challengeResponse: 'TOTP' }));\n  }\n  const destination = getSignInRoute(result);\n  // QR用の共有秘密鍵を含むnextStepは、画面間のメモリだけで保持します。\n  setNextStep(result.isSignedIn ? null : step);\n  router.replace(destination);\n}\n\nexport function getSignInRoute({ isSignedIn, nextStep }: SignInOutput) {\n  if (isSignedIn) return '/home';\n  switch (nextStep.signInStep) {\n    case 'CONFIRM_SIGN_UP':\n      return '/verify';\n    case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':\n      return '/mfa/setup';\n    case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':\n    case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':\n    case 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE':\n      return '/mfa';\n    default:\n      throw new Error(`この学習アプリでは未対応の認証手順です: ${nextStep.signInStep}`);\n  }\n}",
    "resultTitle": "受け取るresultの例",
    "results": [
      {
        "label": "MFA方式を選択",
        "data": "{\n  \"isSignedIn\": false,\n  \"nextStep\": {\n    \"signInStep\": \"CONTINUE_SIGN_IN_WITH_MFA_SELECTION\",\n    \"allowedMFATypes\": [\n      \"TOTP\",\n      \"SMS\"\n    ]\n  }\n}",
        "meaning": "このアプリは利用可能なTOTPを選び、confirmSignInの結果をもう一度分岐処理へ渡します。"
      },
      {
        "label": "初回設定の方式を選択",
        "data": "{\n  \"isSignedIn\": false,\n  \"nextStep\": {\n    \"signInStep\": \"CONTINUE_SIGN_IN_WITH_MFA_SETUP_SELECTION\",\n    \"allowedMFATypes\": [\n      \"TOTP\"\n    ]\n  }\n}",
        "meaning": "TOTPを選ぶと、初回設定用のnextStepが続きます。選択しただけではログイン完了になりません。"
      },
      {
        "label": "選択後のTOTP確認",
        "data": "{\n  \"isSignedIn\": false,\n  \"nextStep\": {\n    \"signInStep\": \"CONFIRM_SIGN_IN_WITH_TOTP_CODE\"\n  }\n}",
        "meaning": "getSignInRouteは/mfaを返します。continueSignIn自体の戻り値はPromise<void>です。"
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
    "code": "const details =\n  nextStep?.signInStep === 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP'\n    ? nextStep.totpSetupDetails\n    : null;\n\n// detailsがある場合、SetupFormに渡すQRと手動キーを表示\n{details && (\n  <SetupForm\n    code={code}\n    onCodeChange={setCode}\n    onSubmit={handleSetup}\n    error={error}\n    isSubmitting={isSubmitting}\n    qrCode={\n      <QRCodeSVG\n        value={details.getSetupUri('Cognito Study').toString()}\n        size={192}\n        marginSize={4}\n        title=\"認証アプリ登録用QRコード\"\n        className=\"h-full w-full\"\n      />\n    }\n    setupKey={details.sharedSecret}\n  />\n)}\n\n// フォーム送信後の設定確認\nawait continueSignIn(\n  await confirmSignIn({ challengeResponse: code })\n);",
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
      "challengeResponseには今回の認証コードを渡す。",
      "TOTP初回設定の確認でも、同じAPIを使う。",
      "結果は再びcontinueSignInに渡し、成功や追加手順を判断。"
    ],
    "outcome": "isSignedInがtrueなら、ホームが表示される。",
    "file": "app/mfa/page.tsx",
    "code": "await continueSignIn(await confirmSignIn({ challengeResponse: code }));",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "MFA確認が完了",
        "data": "{\n  \"isSignedIn\": true,\n  \"nextStep\": {\n    \"signInStep\": \"DONE\"\n  }\n}",
        "meaning": "追加認証が完了。continueSignInが/homeへ遷移させます。"
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
      "表示名はIDトークンのname、なければemail。",
      "ブラウザの確認とは別に、APIではサーバー側でトークンを検証する。"
    ],
    "outcome": "ホームにユーザーを表示。次はサインアウト。",
    "file": "app/home/home-session.tsx",
    "code": "useEffect(() => {\n  let active = true;\n  fetchAuthSession().then(({ tokens }) => {\n    if (!active) return;\n    if (!tokens?.accessToken || !tokens.idToken) {\n      router.replace('/login');\n      return;\n    }\n    const { name, email } = tokens.idToken.payload;\n    setName(typeof name === 'string' ? name : typeof email === 'string' ? email : 'ユーザー');\n  }).catch((error) => { if (active) setError(authErrorMessage(error)); });\n  return () => { active = false; };\n}, [router]);",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "ログイン済み",
        "data": "{\n  \"tokens\": {\n    \"accessToken\": {\n      \"payload\": {\n        \"sub\": \"<ユーザーID>\",\n        \"token_use\": \"access\"\n      }\n    },\n    \"idToken\": {\n      \"payload\": {\n        \"sub\": \"<ユーザーID>\",\n        \"token_use\": \"id\",\n        \"name\": \"山田 太郎\",\n        \"email\": \"you@example.com\"\n      }\n    }\n  }\n}",
        "meaning": "主要フィールドだけを抜粋しています。tokens内のトークンは実際にはJWTオブジェクト。IDトークンのnameかemailを表示に使います。"
      },
      {
        "label": "ログイン情報なし",
        "data": "{\n  tokens: undefined\n}",
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
    "code": "await signOut();\nclearChallenge();\nsetName(null);\nrouter.replace('/login');",
    "resultTitle": "返り値の例",
    "results": [
      {
        "label": "サインアウト完了",
        "data": "undefined",
        "meaning": "signOutはPromise<void>です。成功時にユーザーデータやnextStepは返らず、共有状態を消して/loginへ進みます。"
      }
    ]
  },
  {
    "id": "C13",
    "title": "エラーから次の操作を決める",
    "api": "AuthError",
    "chapter": "エラー処理",
    "description": "認証が止まったときは、エラー名を見て原因と次の操作を切り分けます。",
    "points": [
      "コードの不一致と無効なコードを区別。",
      "既存のログインセッションがある場合は明示的にサインアウト。",
      "登録確認の失敗と、その後の自動ログイン失敗を混同しない。"
    ],
    "outcome": "課題で実装し、同じエラーを再現して挙動を確認。",
    "file": "lib/auth-flow.ts",
    "code": "export function authErrorMessage(error: unknown) {\n  if (!(error instanceof Error)) return '認証処理に失敗しました。';\n  switch (error.name) {\n    case 'UserAlreadyAuthenticatedException':\n      return 'すでにログイン中です。ホームへ進むか、サインアウトしてからやり直してください。';\n    case 'CodeMismatchException':\n      return '認証コードが一致しません。最新のコードを確認してください。';\n    case 'ExpiredCodeException':\n      return '認証コードが無効になっています。コードを再送信してください。';\n    case 'AutoSignInException':\n      return '自動ログインを継続できません。ログイン画面からログインしてください。';\n    default:\n      // 学習用にCognitoから返ったエラー名と理由を確認できるようにします。\n      return `${error.name}: ${error.message}`;\n  }\n}",
    "resultTitle": "catchで受け取る例外の例",
    "results": [
      {
        "label": "無効な確認コード",
        "data": "{\n  \"name\": \"ExpiredCodeException\",\n  \"message\": \"Invalid code provided, please request a code again.\"\n}",
        "meaning": "正常な返り値ではなく例外です。catchで受け取り、コードの再送信を案内します。"
      },
      {
        "label": "既存のログイン状態",
        "data": "{\n  \"name\": \"UserAlreadyAuthenticatedException\",\n  \"message\": \"There is already a signed in user.\"\n}",
        "meaning": "現在のユーザーを確認し、必要なら明示的にサインアウト。別ユーザーのログイン成功として扱いません。"
      }
    ]
  }
] as const;
