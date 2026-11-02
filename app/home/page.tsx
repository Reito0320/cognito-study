import type { Metadata } from 'next';
import { HomeSession } from './home-session';
import { FlowDeck } from './flow-deck';

export const metadata: Metadata = { title: '認証フローの学習カード | Cognito Study' };

export default function HomePage() {
  return <HomeSession>
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 sm:px-10">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight"><span className="mr-1 grid size-9 place-items-center rounded-xl bg-emerald-950 text-sm text-emerald-200">C</span>Cognito <span className="font-normal text-slate-400">Study</span></div>
        <span className="hidden text-[10px] tracking-[0.2em] text-slate-400 sm:block">AUTHENTICATION NOTEBOOK</span>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-[10px] font-semibold tracking-[0.2em] text-emerald-700">LEARN ONE CARD AT A TIME</p><h1 className="mb-3 mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">めくって学ぶ、Cognito認証。</h1><p className="text-xs leading-7 text-slate-500 sm:text-sm">登録からサインアウトまで。処理の流れと、実際の実装をひとつずつ。</p></div>
          <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] text-slate-500">Amplify Auth / 11 cards</span>
        </div>
        <FlowDeck />
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-slate-200 pt-6 text-[11px] leading-6 text-slate-400">
          <p>コードはmyStudyの実装から抜粋。import・フォーム・周辺の状態管理は省略しています。</p>
          <a href="https://docs.amplify.aws/nextjs/frontend/auth/multi-step-sign-in/" target="_blank" rel="noreferrer" className="text-emerald-800 underline underline-offset-4">Amplify公式ドキュメント ↗</a>
        </div>
      </main>
    </div>
  </HomeSession>;
}
