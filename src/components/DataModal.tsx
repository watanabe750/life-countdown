import { useState, useRef, useCallback } from 'react';
import type { Target } from '../types';
import type { TimeUnit } from '../utils/timeUtils';

interface ExportData {
  version: 1;
  exportedAt: string;
  targets: Target[];
  activeTargetId: string;
  unitMap: Record<string, TimeUnit>;
}

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  targets: Target[];
  activeTargetId: string;
  unitMap: Record<string, TimeUnit>;
  onImport: (data: { targets: Target[]; activeTargetId: string; unitMap: Record<string, TimeUnit> }) => void;
}

export function DataModal({ isOpen, onClose, targets, activeTargetId, unitMap, onImport }: DataModalProps) {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    targets,
    activeTargetId,
    unitMap,
  };
  const exportJson = JSON.stringify(exportData, null, 2);

  const handleDownload = useCallback(() => {
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-countdown-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportJson]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(exportJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [exportJson]);

  const handleFileImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    setImportSuccess(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as ExportData;
        if (parsed.version !== 1 || !Array.isArray(parsed.targets)) {
          setImportError('ファイルの形式が正しくありません');
          return;
        }
        if (parsed.targets.length === 0) {
          setImportError('目標データが含まれていません');
          return;
        }
        onImport({ targets: parsed.targets, activeTargetId: parsed.activeTargetId ?? '', unitMap: parsed.unitMap ?? {} });
        setImportSuccess(true);
        setTimeout(() => { setImportSuccess(false); onClose(); }, 1500);
      } catch {
        setImportError('JSONの解析に失敗しました');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [onImport, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-white/20 animate-in zoom-in-95 duration-300 overflow-y-auto"
        style={{ maxHeight: 'calc(100dvh - 2rem)', padding: '2rem 2.5rem' }}
      >
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          データ管理
        </h2>

        {/* エクスポート */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-1">エクスポート</h3>
          <p className="text-xs text-gray-400 mb-3">目標データをJSONファイルとして保存します</p>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              ダウンロード
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'コピー済み ✓' : 'コピー'}
            </button>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-100 mb-6" />

        {/* インポート */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-1">インポート</h3>
          <p className="text-xs text-gray-400 mb-3">バックアップファイルから復元します（既存データは上書きされます）</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-purple-200 text-purple-600 text-sm font-bold rounded-xl hover:border-purple-400 hover:bg-purple-50 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            JSONファイルを選択
          </button>
          <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleFileImport} />
          {importError && (
            <p className="mt-2 text-xs text-red-600 font-medium">{importError}</p>
          )}
          {importSuccess && (
            <p className="mt-2 text-xs text-green-600 font-medium">インポート完了しました ✓</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition-all font-semibold text-sm"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
