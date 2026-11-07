'use client';

import { useMemo, useRef, useState, useSyncExternalStore, type SubmitEvent } from 'react';

type StudyMemo = {
  id: string;
  content: string;
  createdAt: string;
};

const storageKey = 'cognito-study:learning-memos:v1';
const changeEvent = 'cognito-study:memos-changed';
const maxLength = 2000;

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) onChange();
  }
  window.addEventListener('storage', onStorage);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(changeEvent, onChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(storageKey) ?? '[]';
  } catch {
    return 'unavailable';
  }
}

function getServerSnapshot() {
  return null;
}

function parseMemos(value: string): StudyMemo[] {
  const data: unknown = JSON.parse(value);
  if (!Array.isArray(data) || !data.every((memo) =>
    memo !== null && typeof memo === 'object' &&
    typeof memo.id === 'string' && typeof memo.content === 'string' &&
    typeof memo.createdAt === 'string' && Number.isFinite(Date.parse(memo.createdAt))
  )) {
    throw new Error('保存されたメモを読み込めませんでした。');
  }
  return data;
}

const dateFormat = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function StudyMemos() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { memos, loadError } = useMemo(() => {
    try {
      return { memos: snapshot === null ? [] : parseMemos(snapshot), loadError: '' };
    } catch {
      return { memos: [], loadError: 'メモを読み込めませんでした。ブラウザの保存設定や保存データを確認してください。' };
    }
  }, [snapshot]);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const addButton = useRef<HTMLButtonElement>(null);

  function handleSave(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    const content = draft.trim();
    if (!content || content.length > maxLength) {
      setError(`メモは1〜${maxLength}文字で入力してください。`);
      return;
    }
    try {
      // 保存直前に読み直し、別のタブで追加されたメモも残します。
      const saved = parseMemos(getSnapshot());
      const memo: StudyMemo = {
        id: crypto.randomUUID(),
        content,
        createdAt: new Date().toISOString(),
      };
      window.localStorage.setItem(storageKey, JSON.stringify([memo, ...saved]));
      window.dispatchEvent(new Event(changeEvent));
      setDraft('');
      setIsOpen(false);
      setMessage('学習メモを保存しました。');
      addButton.current?.focus();
    } catch {
      setError('メモを保存できませんでした。入力内容は残っています。ブラウザの保存設定や空き容量を確認して、もう一度お試しください。');
    }
  }

  return <section aria-labelledby="study-memos-title" className="mt-10 border-t border-slate-200 pt-8 lg:ml-[282px]">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 id="study-memos-title" className="text-lg font-semibold text-slate-800">学習メモ</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">わかったこと、あとで試したいことをひとこと。</p>
      </div>
      <button ref={addButton} type="button" aria-expanded={isOpen} aria-controls="study-memo-form"
        onClick={() => { setIsOpen(!isOpen); setMessage(''); }}
        className="rounded-xl border border-cognito-200 bg-white px-4 py-2.5 text-sm font-medium text-cognito-800 transition-colors hover:bg-cognito-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cognito-600">
        {isOpen ? '入力欄を閉じる' : '＋ 学習メモを追加'}
      </button>
    </div>
    <p className="mt-3 text-xs leading-5 text-slate-400">メモはこのブラウザに保存されます。同じブラウザを使う人と共有されます。</p>

    <div id="study-memo-form" hidden={!isOpen}>
      {isOpen && <form onSubmit={handleSave} className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <label htmlFor="study-memo-content" className="mb-3 block text-sm font-medium text-slate-700">今回の学びを残す</label>
        <textarea id="study-memo-content" name="memo" rows={4} autoFocus required maxLength={maxLength}
          value={draft} onChange={(event) => { setDraft(event.target.value); setError(''); }}
          placeholder="例：メール確認とログインは別の処理。MFAの初回設定はnextStepで分岐する。"
          aria-describedby="study-memo-count" aria-invalid={Boolean(error)}
          className="block w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 placeholder:text-slate-400 focus:border-cognito-500 focus:outline-2 focus:outline-cognito-500" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p id="study-memo-count" className="text-xs tabular-nums text-slate-400">{draft.length} / {maxLength}文字</p>
          <button type="submit" disabled={!draft.trim() || snapshot === null || Boolean(loadError)}
            className="rounded-lg bg-cognito-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cognito-700 disabled:cursor-not-allowed disabled:opacity-40">保存する</button>
        </div>
        {error && <p role="alert" className="mt-3 text-sm leading-6 text-red-700">{error}</p>}
      </form>}
    </div>

    {loadError && <p role="alert" className="mt-4 text-sm leading-6 text-red-700">{loadError}</p>}
    <p role="status" className="mt-3 text-sm text-cognito-800">{message}</p>
    {snapshot === null ? <p className="mt-4 text-sm text-slate-400">メモを読み込み中…</p>
      : !loadError && (memos.length ? <ul aria-label="保存した学習メモ" className="mt-4 space-y-3">
        {memos.map((memo) => <li key={memo.id} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{memo.content}</p>
          <time dateTime={memo.createdAt} className="mt-2 block text-xs text-slate-400">{dateFormat.format(new Date(memo.createdAt))}</time>
        </li>)}
      </ul> : <p className="mt-4 text-sm leading-6 text-slate-400">まだメモはありません。気づいたことから、少しずつ残していきましょう。</p>)}
  </section>;
}
