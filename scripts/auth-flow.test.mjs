import assert from 'node:assert/strict';
import test from 'node:test';
import { getSignInRoute, authErrorMessage } from '../lib/auth-flow.ts';

const result = (signInStep, isSignedIn = false) => ({ isSignedIn, nextStep: { signInStep } });

test('MFAが不要ならホームへ進む', () => {
  assert.equal(getSignInRoute(result('DONE', true)), '/home');
});

test('未確認のユーザーは登録確認へ戻す', () => {
  assert.equal(getSignInRoute(result('CONFIRM_SIGN_UP')), '/verify');
});

test('TOTPの初回設定と登録済みコード入力を区別する', () => {
  assert.equal(getSignInRoute(result('CONTINUE_SIGN_IN_WITH_TOTP_SETUP')), '/mfa/setup');
  assert.equal(getSignInRoute(result('CONFIRM_SIGN_IN_WITH_TOTP_CODE')), '/mfa');
});

test('SMSとメールコードのチャレンジもコード入力画面へ進める', () => {
  for (const step of ['CONFIRM_SIGN_IN_WITH_SMS_CODE', 'CONFIRM_SIGN_IN_WITH_EMAIL_CODE']) {
    assert.equal(getSignInRoute(result(step)), '/mfa');
  }
});

test('未対応手順では黙って止まらず、次に必要な手順を通知する', () => {
  assert.throws(() => getSignInRoute(result('RESET_PASSWORD')), /RESET_PASSWORD/);
  assert.throws(() => getSignInRoute(result('CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED')), /NEW_PASSWORD_REQUIRED/);
});

test('isSignedInがfalseのままホームへ進めない', () => {
  assert.throws(() => getSignInRoute(result('DONE')), /DONE/);
});

test('既存セッションは成功扱いにせず、明示的なアカウント確認を案内する', () => {
  const error = new Error('There is already a signed in user.');
  error.name = 'UserAlreadyAuthenticatedException';
  assert.match(authErrorMessage(error), /サインアウト/);
});

test('認証コードの期限切れは再送信を案内する', () => {
  const error = new Error('Invalid code provided');
  error.name = 'ExpiredCodeException';
  assert.match(authErrorMessage(error), /再送信/);
});

test('その他のCognitoエラーはデバッグできるよう理由を保持する', () => {
  const error = new Error('Current status is CONFIRMED');
  error.name = 'NotAuthorizedException';
  assert.equal(authErrorMessage(error), 'NotAuthorizedException: Current status is CONFIRMED');
});
