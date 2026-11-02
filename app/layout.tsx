import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./components/auth-provider";

export const metadata: Metadata = {
  title: "Cognito Study | 認証ハンズオン",
  description: "Amazon Cognitoの認証・認可を学ぶための学習用アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ja"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
