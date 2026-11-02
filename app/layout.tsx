import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognito Study | 認証ハンズオン",
  description: "Amazon Cognitoの認証・認可を学ぶための学習用アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ja"><body>{children}</body></html>;
}
