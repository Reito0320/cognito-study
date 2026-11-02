'use client';

import { useState } from 'react';
import { flowLessons } from './flow-lessons';

export function FlowDeck() {
  const [index, setIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [resultIndex, setResultIndex] = useState(0);
  const lesson = flowLessons[index];
  const result = lesson.results[resultIndex] ?? lesson.results[0];
  const isLast = index === flowLessons.length - 1;

  function turnCard(next: number) {
    setIndex(next);
    setShowCode(false);
    setResultIndex(0);
  }

  return <section aria-label="認証フローの学習カード" className="grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
    <nav aria-label="学習ステップ" className="min-w-0 lg:sticky lg:top-6">
      <p className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-slate-400">YOUR LEARNING PATH</p>
      <ol className="flex gap-2 overflow-x-auto pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
        {flowLessons.map((item, position) => <li key={item.id} className="shrink-0 lg:shrink">
          <button type="button" aria-current={index === position ? 'step' : undefined} onClick={() => turnCard(position)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-xs transition-colors ${index === position ? 'bg-emerald-950 text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-emerald-800'}`}>
            <span className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-[10px] ${index === position ? 'bg-white/10 text-lime-200' : 'border border-slate-200 bg-white text-slate-400'}`}>{String(position + 1).padStart(2, '0')}</span>
            <span className="leading-5">{item.title}</span>
          </button>
        </li>)}
      </ol>
      <p className="mt-5 hidden text-[11px] leading-6 text-slate-400 lg:block">学習しやすい順に並べています。<br />実際の認証はnextStepに応じて分岐します。</p>
    </nav>

    <div className="min-w-0">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs"><span className="font-mono font-medium text-emerald-900">{String(index + 1).padStart(2, '0')}</span><span className="text-slate-300">/</span><span className="font-mono text-slate-400">{flowLessons.length}</span><span className="ml-1 text-slate-500">{lesson.chapter}</span></div>
        <progress value={index + 1} max={flowLessons.length} aria-label="学習カードの進捗" className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200 accent-emerald-700 sm:w-40 [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:bg-emerald-700 [&::-moz-progress-bar]:bg-emerald-700" />
      </div>

      <div className="relative mb-4 pb-3">
        <div aria-hidden="true" className="absolute inset-x-4 bottom-0 top-8 rounded-3xl border border-slate-200 bg-slate-100" />
        <div aria-hidden="true" className="absolute inset-x-2 bottom-1.5 top-4 rounded-3xl border border-slate-200 bg-white" />
        <article key={lesson.id} aria-labelledby="card-title" className="relative min-h-[590px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_45px_-24px_rgba(24,55,38,0.25)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-5 sm:px-9">
            <span className="text-[10px] font-semibold tracking-[0.18em] text-emerald-700">AUTH FLOW / {String(index + 1).padStart(2, '0')}</span>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] text-emerald-800">{lesson.id}</span>
          </div>

          <div className="grid min-h-[505px] lg:grid-cols-[1fr_1.05fr]">
            <div className="flex min-w-0 flex-col p-6 sm:p-9">
              <span aria-hidden="true" className="mb-6 font-mono text-5xl font-light tracking-tighter text-emerald-100 sm:text-6xl">{String(index + 1).padStart(2, '0')}</span>
              <h2 id="card-title" className="text-2xl font-semibold leading-relaxed tracking-tight text-slate-800 sm:text-3xl">{lesson.title}</h2>
              <code className="mt-3 break-words text-xs leading-6 text-emerald-700">{lesson.api}</code>
              <p className="mt-6 text-sm leading-7 text-slate-500">{lesson.description}</p>
              <ul className="mt-6 space-y-3">{lesson.points.map((point, i) => <li key={point} className="flex gap-3 text-xs leading-6 text-slate-600"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-slate-100 text-[9px] text-slate-400">{i + 1}</span><span>{point}</span></li>)}</ul>
              <div className="mt-8 border-t border-slate-100 pt-5 lg:mt-auto lg:pt-6"><p className="mb-2 text-[9px] font-semibold tracking-widest text-emerald-600">WHAT HAPPENS NEXT</p><p className="text-xs leading-6 text-emerald-900">{lesson.outcome}</p></div>
            </div>

            <div className="flex min-w-0 flex-col bg-slate-950 text-slate-200">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-5"><span className="font-mono text-[10px] tracking-wider text-slate-400">IMPLEMENTATION</span><span className="rounded bg-white/5 px-2 py-1 font-mono text-[10px] text-emerald-300">myStudy</span></div>
              {showCode ? <>
                <div className="border-b border-white/5 px-6 py-3"><p className="break-all font-mono text-[10px] leading-5 text-slate-400">{lesson.file}</p></div>
                <pre tabIndex={0} aria-label={`${lesson.api}の実装コード`} className="max-h-[500px] min-h-72 flex-1 overflow-auto p-5 font-mono text-[11px] leading-6 outline-offset-[-4px] sm:p-6"><code>{lesson.code.split('\n').map((line, lineNumber) => <span key={lineNumber} className="block min-w-max"><span aria-hidden="true" className="mr-5 inline-block w-5 select-none text-right text-slate-600">{lineNumber + 1}</span><span className={line.trim().startsWith('//') ? 'text-slate-500' : 'text-emerald-100'}>{line || ' '}</span></span>)}</code></pre>
                <button type="button" onClick={() => setShowCode(false)} className="border-t border-white/10 px-6 py-4 text-left text-xs text-slate-400 hover:text-white">← 実装コードを閉じる</button>
              </> : <div className="flex min-h-80 flex-1 flex-col items-center justify-center p-8 text-center">
                <span aria-hidden="true" className="mb-7 grid size-16 place-items-center rounded-2xl border border-white/10 bg-white/5 font-mono text-2xl text-emerald-300">{'</>'}</span>
                <p className="text-lg font-medium text-white">このステップ、どう書く？</p>
                <p className="mt-3 max-w-60 text-xs leading-6 text-slate-400">まず自分で考えてから、今回実装したコードを確認してみましょう。</p>
                <button type="button" onClick={() => setShowCode(true)} className="mt-7 rounded-lg bg-emerald-300 px-5 py-3 text-xs font-semibold text-emerald-950 transition-colors hover:bg-emerald-200">実装コードを見る <span aria-hidden="true">↗</span></button>
                <p className="mt-4 text-[10px] leading-5 text-slate-500">表示専用の抜粋です。認証処理は実行しません。</p>
              </div>}
            </div>
          </div>
        </article>
      </div>

      <section aria-labelledby="result-title" className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-6 py-5">
          <h3 id="result-title" className="text-sm font-semibold text-slate-800">{lesson.resultTitle}</h3>
          <span className="font-mono text-[9px] tracking-widest text-emerald-700">DATA EXAMPLE</span>
          <p className="w-full text-[11px] leading-6 text-slate-400">ダミーデータによる代表例です。主要フィールドのみ掲載し、実際の値・追加の手順は設定によって変わります。</p>
        </div>
        {lesson.results.length > 1 && <div className="flex flex-wrap gap-2 px-6 pt-5" role="group" aria-label="返り値のパターンを選択">
          {lesson.results.map((item, position) => <button type="button" key={item.label} onClick={() => setResultIndex(position)} aria-pressed={resultIndex === position} aria-controls="result-example"
            className={`rounded-lg border px-3 py-2 text-[11px] leading-5 transition-colors ${resultIndex === position ? 'border-emerald-900 bg-emerald-950 text-white' : 'border-slate-200 text-slate-500 hover:border-emerald-400'}`}>{item.label}</button>)}
        </div>}
        <div id="result-example" className="grid gap-5 p-6 xl:grid-cols-[1.15fr_1fr]">
          <pre tabIndex={0} aria-label={result.label} className="max-h-96 min-w-0 overflow-auto rounded-xl bg-slate-950 p-5 font-mono text-[11px] leading-6 text-emerald-100"><code>{result.data}</code></pre>
          <div className="flex flex-col justify-center rounded-xl border border-emerald-100 bg-emerald-50/60 p-5">
            <p className="mb-3 text-[10px] font-semibold tracking-widest text-emerald-700">このデータから分かること</p>
            <p aria-live="polite" className="text-xs leading-7 text-emerald-950">{result.meaning}</p>
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button type="button" disabled={index === 0} onClick={() => turnCard(index - 1)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 transition-colors hover:border-slate-400 disabled:cursor-default disabled:opacity-35 sm:px-6">← 前のカード</button>
        <p className="sr-only" role="status">カード {index + 1} / {flowLessons.length}: {lesson.title}</p>
        <button type="button" onClick={() => turnCard(isLast ? 0 : index + 1)} className="rounded-xl bg-emerald-950 px-5 py-3 text-xs font-medium text-white transition-colors hover:bg-emerald-800 sm:px-7">{isLast ? '最初から振り返る ↺' : '次のカードをめくる →'}</button>
      </div>
      <p className="mt-4 text-right text-[11px] leading-6 text-slate-400">{isLast ? 'ここまでで、ひと通りの認証フローを確認しました。' : `次のカード：${flowLessons[index + 1].title}`}</p>
    </div>
  </section>;
}
