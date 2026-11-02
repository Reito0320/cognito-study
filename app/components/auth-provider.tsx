'use client';

import '@/lib/amplify';
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { SignInOutput } from 'aws-amplify/auth';

type AuthFlow = {
  email: string;
  setEmail: (email: string) => void;
  nextStep: SignInOutput['nextStep'] | null;
  continueSignIn: (result: SignInOutput) => Promise<void>;
  clearChallenge: () => void;
};

const AuthContext = createContext<AuthFlow | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [nextStep, setNextStep] = useState<SignInOutput['nextStep'] | null>(null);

  // [COGNITO C03 START]
  async function continueSignIn(): Promise<void> {
    // TODO C03: MFA方式の選択、認証結果の保持、C02を使う画面遷移を実装してください。
    // 結果の引数はAuthFlowの型を参考に追加します。
    throw new Error('TODO C03: 認証フローの継続処理を実装してください。');
  }
  // [COGNITO C03 END]

  return <AuthContext.Provider value={{ email, setEmail, nextStep, continueSignIn, clearChallenge: () => setNextStep(null) }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuthFlow() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProviderが必要です。');
  return context;
}
