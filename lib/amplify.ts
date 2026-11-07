import { Amplify } from 'aws-amplify';

// [COGNITO C01 START]
// C01: 環境変数を使ってAmplify Authを初期化します。
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

// 未設定でも画面は開けます。実際の認証には両方の設定が必要です。
if (userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: { userPoolId, userPoolClientId },
    },
  });
}
// [COGNITO C01 END]
