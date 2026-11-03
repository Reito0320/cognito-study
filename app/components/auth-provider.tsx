'use client';

import '@/lib/amplify';
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { SignInOutput } from 'aws-amplify/auth';

// 画面間で値を渡すだけの土台です。認証処理と画面遷移は各ページに書きます。
type AuthFlow = {
  email: string;
  setEmail: (email: string) => void;
  nextStep: SignInOutput['nextStep'] | null;
  setNextStep: (step: SignInOutput['nextStep'] | null) => void;
};

const AuthContext = createContext<AuthFlow | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [nextStep, setNextStep] = useState<SignInOutput['nextStep'] | null>(null);

  return <AuthContext.Provider value={{ email, setEmail, nextStep, setNextStep }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuthFlow() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProviderが必要です。');
  return context;
}
