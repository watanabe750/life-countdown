import { useState, useCallback, useMemo } from 'react';
import type { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  onReset: () => void;
  currentSettings: Settings | null;
}

// ---------- Step 1: 入力画面 ----------
function InputStep({
  year,
  month,
  day,
  targetAge,
  error,
  onChangeYear,
  onChangeMonth,
  onChangeDay,
  onChangeTargetAge,
  onNext,
  onCancel,
  onReset,
}: {
  year: string;
  month: string;
  day: string;
  targetAge: number;
  error: string | null;
  onChangeYear: (v: string) => void;
  onChangeMonth: (v: string) => void;
  onChangeDay: (v: string) => void;
  onChangeTargetAge: (v: number) => void;
  onNext: () => void;
  onCancel: () => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* ステップ表示 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-base font-bold shadow-lg shadow-purple-500/50 transition-all">
          1
        </div>
        <div className="h-1 w-10 bg-gradient-to-r from-purple-500 to-gray-200 rounded-full" />
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 text-base font-bold transition-all">
          2
        </div>
        <span className="text-base font-semibold text-gray-600 ml-auto">入力フォーム</span>
      </div>

      {/* 生年月日 */}
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-5">生年月日</label>
        <div className="flex items-start gap-4">
          {/* 年 */}
          <div className="flex-1 group">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="1990"
                value={year}
                onChange={(e) => onChangeYear(e.target.value)}
                maxLength={4}
                className="w-full px-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white/80 outline-none text-gray-800 text-center text-xl font-bold transition-all duration-200 hover:border-purple-300 hover:shadow-lg shadow-sm group-hover:scale-[1.02]"
              />
              <div className="absolute -bottom-8 left-0 right-0">
                <span className="block text-xs font-bold text-gray-400 text-center uppercase tracking-wider">Year</span>
              </div>
            </div>
          </div>

          {/* 区切り */}
          <div className="flex items-center pt-2">
            <span className="text-2xl font-bold text-gray-300">/</span>
          </div>

          {/* 月 */}
          <div className="w-20 group">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="01"
                value={month}
                onChange={(e) => onChangeMonth(e.target.value)}
                maxLength={2}
                className="w-full px-3 py-4 bg-white/60 backdrop-blur-sm border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white/80 outline-none text-gray-800 text-center text-xl font-bold transition-all duration-200 hover:border-purple-300 hover:shadow-lg shadow-sm group-hover:scale-[1.02]"
              />
              <div className="absolute -bottom-8 left-0 right-0">
                <span className="block text-xs font-bold text-gray-400 text-center uppercase tracking-wider">Mon</span>
              </div>
            </div>
          </div>

          {/* 区切り */}
          <div className="flex items-center pt-2">
            <span className="text-2xl font-bold text-gray-300">/</span>
          </div>

          {/* 日 */}
          <div className="w-20 group">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="01"
                value={day}
                onChange={(e) => onChangeDay(e.target.value)}
                maxLength={2}
                className="w-full px-3 py-4 bg-white/60 backdrop-blur-sm border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:bg-white/80 outline-none text-gray-800 text-center text-xl font-bold transition-all duration-200 hover:border-purple-300 hover:shadow-lg shadow-sm group-hover:scale-[1.02]"
              />
              <div className="absolute -bottom-8 left-0 right-0">
                <span className="block text-xs font-bold text-gray-400 text-center uppercase tracking-wider">Day</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 目標年齢 */}
      <div className="pt-2">
        <label className="block text-base font-semibold text-gray-700 mb-4">
          目標年齢
          <span className="ml-4 px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg">{targetAge} 歳</span>
        </label>
        <div className="relative">
          <input
            type="range"
            min={1}
            max={150}
            value={targetAge}
            onChange={(e) => onChangeTargetAge(Number(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-purple-200 via-purple-300 to-pink-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/50 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gradient-to-br [&::-moz-range-thumb]:from-purple-500 [&::-moz-range-thumb]:to-pink-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-purple-500/50 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
          <span>1歳</span>
          <span>75歳</span>
          <span>150歳</span>
        </div>
        {/* 数値入力（補助） */}
        <div className="mt-5 flex items-center gap-3 bg-purple-50/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-purple-100">
          <span className="text-sm text-gray-600 font-medium">直接入力：</span>
          <input
            type="number"
            min={1}
            max={150}
            value={targetAge}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= 150) onChangeTargetAge(v);
            }}
            className="w-24 px-4 py-2 bg-white border-2 border-purple-200 rounded-xl text-center text-base text-gray-800 font-semibold focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-all"
          />
          <span className="text-sm text-gray-600 font-medium">歳</span>
        </div>
      </div>

      {/* エラー */}
      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-xl px-5 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-red-600 text-base font-medium">{error}</p>
        </div>
      )}

      {/* ボタン */}
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 text-gray-700 text-base bg-gray-100/80 backdrop-blur-sm rounded-xl hover:bg-gray-200 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold"
          >
            キャンセル
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-6 py-4 text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 transition-all duration-200 font-bold"
          >
            次へ →
          </button>
        </div>
        <button
          onClick={onReset}
          className="w-full px-5 py-3 text-red-600 text-base bg-red-50/80 backdrop-blur-sm rounded-xl hover:bg-red-100 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold"
        >
          リセット（データを削除）
        </button>
      </div>
    </div>
  );
}

// ---------- Step 2: サマリー確認画面 ----------
function SummaryStep({
  birthDate,
  targetAge,
  onSave,
  onBack,
}: {
  birthDate: string;
  targetAge: number;
  onSave: () => void;
  onBack: () => void;
}) {
  // 目標日を計算して表示
  const goalInfo = useMemo(() => {
    const [y, m, d] = birthDate.split('-').map(Number);
    const goal = new Date(y + targetAge, m - 1, d);
    return {
      goalYear: goal.getFullYear(),
      goalMonth: goal.getMonth() + 1,
      goalDay: goal.getDate(),
    };
  }, [birthDate, targetAge]);

  // 生年月日の表示用
  const [y, m, d] = birthDate.split('-');
  const displayBirth = `${parseInt(y, 10)} 年 ${parseInt(m, 10)} 月 ${parseInt(d, 10)} 日`;

  return (
    <div className="space-y-8">
      {/* ステップ表示 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 text-base font-bold transition-all">
          1
        </div>
        <div className="h-1 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-base font-bold shadow-lg shadow-purple-500/50 transition-all">
          2
        </div>
        <span className="text-base font-semibold text-gray-600 ml-auto">確認画面</span>
      </div>

      {/* サマリーカード */}
      <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200/50 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
          <p className="text-white text-lg font-bold">入力内容の確認</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-xl px-5 py-4 shadow-sm">
            <span className="text-gray-600 text-base font-semibold">生年月日</span>
            <span className="text-gray-800 font-bold text-lg">{displayBirth}</span>
          </div>
          <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-xl px-5 py-4 shadow-sm">
            <span className="text-gray-600 text-base font-semibold">目標年齢</span>
            <span className="text-gray-800 font-bold text-lg">{targetAge} 歳</span>
          </div>
          <div className="flex justify-between items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl px-5 py-5 shadow-md border-2 border-purple-300/50">
            <span className="text-purple-700 text-base font-bold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              目標日
            </span>
            <span className="text-purple-800 font-bold text-xl">
              {goalInfo.goalYear} 年 {goalInfo.goalMonth} 月 {goalInfo.goalDay} 日
            </span>
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 text-gray-700 text-base bg-gray-100/80 backdrop-blur-sm rounded-xl hover:bg-gray-200 hover:shadow-md active:scale-95 transition-all duration-200 font-semibold"
        >
          ← 戻る
        </button>
        <button
          onClick={onSave}
          className="flex-1 px-6 py-4 text-white text-base bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95 transition-all duration-200 font-bold"
        >
          保存
        </button>
      </div>
    </div>
  );
}

// ---------- メインモーダル ----------
export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  onReset,
  currentSettings,
}: SettingsModalProps) {
  // 現在設定を分解して初期値とする
  const [year, setYear] = useState(() => {
    if (!currentSettings?.birthDate) return '';
    return currentSettings.birthDate.split('-')[0].replace(/^0+/, '');
  });
  const [month, setMonth] = useState(() => {
    if (!currentSettings?.birthDate) return '';
    return String(parseInt(currentSettings.birthDate.split('-')[1], 10));
  });
  const [day, setDay] = useState(() => {
    if (!currentSettings?.birthDate) return '';
    return String(parseInt(currentSettings.birthDate.split('-')[2], 10));
  });
  const [targetAge, setTargetAge] = useState(currentSettings?.targetAge ?? 80);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  // ---------- 入力バリデーション ----------
  const validate = useCallback((): string | null => {
    if (!year || !month || !day) return '生年月日を全て入力してください';

    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (isNaN(y) || isNaN(m) || isNaN(d)) return '数字を入力してください';
    if (m < 1 || m > 12) return '月は1〜12の間で入力してください';
    if (d < 1 || d > 31) return '日は1〜31の間で入力してください';

    // 実際の日数チェック
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
      return 'この日付は存在しません';
    }

    // 未来の日付チェック
    if (date > new Date()) return '生年月日は過去の日付を入力してください';

    if (targetAge < 1 || targetAge > 150) return '目標年齢は1〜150の間で入力してください';

    return null;
  }, [year, month, day, targetAge]);

  // ---------- birthDate 文字列を組み立て ----------
  const birthDateStr = useMemo(() => {
    const y = year.padStart(4, '0');
    const m = month.padStart(2, '0');
    const d = day.padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [year, month, day]);

  // ---------- イベントハンドラ ----------
  const handleNext = useCallback(() => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(2);
  }, [validate]);

  const handleBack = useCallback(() => {
    setStep(1);
  }, []);

  const handleSave = useCallback(() => {
    onSave({ birthDate: birthDateStr, targetAge });
    onClose();
  }, [birthDateStr, targetAge, onSave, onClose]);

  const handleReset = useCallback(() => {
    if (window.confirm('設定をリセットしますか？保存されたデータが削除されます。')) {
      onReset();
      setYear('');
      setMonth('');
      setDay('');
      setTargetAge(80);
      setError(null);
      setStep(1);
      onClose();
    }
  }, [onReset, onClose]);

  const handleCancel = useCallback(() => {
    // フォームを現在設定に戻す
    if (currentSettings?.birthDate) {
      const parts = currentSettings.birthDate.split('-');
      setYear(parts[0].replace(/^0+/, ''));
      setMonth(String(parseInt(parts[1], 10)));
      setDay(String(parseInt(parts[2], 10)));
    } else {
      setYear('');
      setMonth('');
      setDay('');
    }
    setTargetAge(currentSettings?.targetAge ?? 80);
    setError(null);
    setStep(1);
    onClose();
  }, [currentSettings, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // オーバーレイ自体がクリックされた場合のみ閉じる（モーダルコンテンツ内のクリックは無視）
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  }, [handleCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-xl w-full p-10 md:p-12 border border-white/20 animate-in zoom-in-95 duration-300">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-10">設定</h2>

        {step === 1 ? (
          <InputStep
            year={year}
            month={month}
            day={day}
            targetAge={targetAge}
            error={error}
            onChangeYear={setYear}
            onChangeMonth={setMonth}
            onChangeDay={setDay}
            onChangeTargetAge={setTargetAge}
            onNext={handleNext}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        ) : (
          <SummaryStep
            birthDate={birthDateStr}
            targetAge={targetAge}
            onSave={handleSave}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
