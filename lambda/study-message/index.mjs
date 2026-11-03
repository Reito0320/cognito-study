// AWS Lambda用の練習ファイルです。Next.jsからは実行しません。
export const handler = async (event) => {
  // [LAMBDA L07 START]
  // TODO L07: ステータス200とメッセージを返します。
  // return { statusCode: 200, body: JSON.stringify({ message: ... }) };
  // [LAMBDA L07 END]

  // [LAMBDA L10 START]
  // TODO L10: L07ができたら、その応答をここへ移して書き換えます。
  // event.requestContext.authorizer.jwt.claims.subからユーザーIDを取り出します。
  // 応答のJSONにmessageとuserIdを入れます。
  // L07のreturnを残すとここへ来ないので、応答は1つだけにします。
  // [LAMBDA L10 END]
  void event;
  throw new Error('TODO L07: Lambdaの応答を実装してください。');
};
