'use client';

import { useState, type SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from 'aws-amplify/auth';
import { AuthScreen } from '../components/auth-screen';
import { useAuthFlow } from '../components/auth-provider';
import { SignupForm } from './signup-form';

export default function Page() {
  const router = useRouter();
  const { email, setEmail, setNextStep } = useAuthFlow();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    if (password !== confirmPassword) {
      setError('確認用パスワードが一致していません。');
      return;
    }
    setIsSubmitting(true);
    try {
      setNextStep(null);
      // [COGNITO C04 START]
      // C04: ここでsignUpを呼びます（aws-amplify/authからimport）。
      // username: email、password、options.userAttributes: { email }を渡します。
      // 基本課題ではautoSignInを指定しません。
      // nextStep.signUpStepがCONFIRM_SIGN_UPなら/verify、DONEなら/loginへ。
      // useRouterをimportし、Pageの先頭でrouterを用意してください。
      const { nextStep } = await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setPassword('');
        setConfirmPassword('');
        router.replace('/verify');
      } else if (nextStep.signUpStep === 'DONE') {
        setPassword('');
        setConfirmPassword('');
        router.replace('/login');
      } else {
        throw new Error(`未対応の登録ステップです: ${nextStep.signUpStep}`);
      }
      // [COGNITO C04 END]
    } catch (error) {
      setError(error instanceof Error ? error.message : '認証処理に失敗しました。');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <AuthScreen screen="signup"><SignupForm email={email} password={password} confirmPassword={confirmPassword}
    onEmailChange={setEmail} onPasswordChange={setPassword} onConfirmPasswordChange={setConfirmPassword}
    onSubmit={handleSignup} isSubmitting={isSubmitting} error={error} message="" /></AuthScreen>;
}
