import type { Metadata } from 'next';
import { HomeSession } from './home-session';
import { FlowDeck } from './flow-deck';
import { StudyMemos } from './study-memos';

export const metadata: Metadata = { title: '認証フローの学習カード | Cognito Study' };

export default function HomePage() {
  return <HomeSession>
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex h-20 items-center justify-between border-b border-slate-200 border-t-[3px] border-t-cognito-500 bg-white px-6 sm:px-10">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight"><span className="mr-1 grid size-9 place-items-center rounded-xl bg-cognito-500 text-base text-white">C</span>Cognito <span className="font-normal text-slate-400">Study</span></div>
        <span className="hidden text-xs tracking-[0.2em] text-slate-400 sm:block">AUTHENTICATION NOTEBOOK</span>
      </header>
      <main className="mx-auto max-w-[1440px] px-5 py-9 sm:px-8 sm:py-12 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-xs font-semibold tracking-[0.2em] text-cognito-700">LEARN ONE CARD AT A TIME</p><h1 className="mb-3 mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">めくって学ぶ、Cognito認証。</h1><p className="text-sm leading-7 text-slate-500 sm:text-base">初回登録から再ログイン、ユーザー情報の表示まで。処理の流れと、実際の実装をひとつずつ。</p></div>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">Amplify Auth / 9 cards</span>
        </div>
        <FlowDeck />
        <StudyMemos />
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-400">
          <p>コードは基本課題の参考例。import・フォーム・周辺の状態管理は省略しています。</p>
          <a href="https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/" target="_blank" rel="noreferrer" className="text-cognito-800 underline underline-offset-4">Amplify公式ドキュメント ↗</a>
        </div>
      </main>
    </div>
  </HomeSession>;
}
