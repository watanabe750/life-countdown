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
    <div className="space-y-6">
      {/* ステップ表示 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">1</div>
        <div className="h-0.5 w-6 bg-gray-200" />
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-xs font-bold">2</div>
        <span className="text-sm text-gray-500 ml-2">入力</span>
      </div>

      {/* 生年月日 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="text"
              inputMode="numeric"
              placeholder="年"
              value={year}
              onChange={(e) => onChangeYear(e.target.value)}
              maxLength={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 text-center text-lg font-medium"
            />
            <p className="text-xs text-gray-400 text-center mt-0.5">年</p>
          </div>
          <div className="w-14">
            <input
              type="text"
              inputMode="numeric"
              placeholder="月"
              value={month}
              onChange={(e) => onChangeMonth(e.target.value)}
              maxLength={2}
              className="w-full px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 text-center text-lg font-medium"
            />
            <p className="text-xs text-gray-400 text-center mt-0.5">月</p>
          </div>
          <div className="w-14">
            <input
              type="text"
              inputMode="numeric"
              placeholder="日"
              value={day}
              onChange={(e) => onChangeDay(e.target.value)}
              maxLength={2}
              className="w-full px-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800 text-center text-lg font-medium"
            />
            <p className="text-xs text-gray-400 text-center mt-0.5">日</p>
          </div>
        </div>
      </div>

      {/* 目標年齢 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          目標年齢
          <span className="ml-2 text-purple-600 font-bold text-base">{targetAge} 歳</span>
        </label>
        <input
          type="range"
          min={1}
          max={150}
          value={targetAge}
          onChange={(e) => onChangeTargetAge(Number(e.target.value))}
          className="w-full accent-purple-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1歳</span>
          <span>75歳</span>
          <span>150歳</span>
        </div>
        {/* 数値入力（補助） */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-500">直入力：</span>
          <input
            type="number"
            min={1}
            max={150}
            value={targetAge}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v >= 1 && v <= 150) onChangeTargetAge(v);
            }}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <span className="text-xs text-gray-500">歳</span>
        </div>
      </div>

      {/* エラー */}
      {error && (
        <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* ボタン */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-4 py-2.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            次へ →
          </button>
        </div>
        <button
          onClick={onReset}
          className="w-full px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
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
    <div className="space-y-6">
      {/* ステップ表示 */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-200 text-purple-600 text-xs font-bold">1</div>
        <div className="h-0.5 w-6 bg-purple-400" />
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">2</div>
        <span className="text-sm text-gray-500 ml-2">確認</span>
      </div>

      {/* サマリーカード */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-purple-600 px-4 py-2">
          <p className="text-white text-sm font-medium">入力内容の確認</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">生年月日</span>
            <span className="text-gray-800 font-semibold">{displayBirth}</span>
          </div>
          <div className="border-t border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">目標年齢</span>
            <span className="text-gray-800 font-semibold">{targetAge} 歳</span>
          </div>
          <div className="border-t border-gray-200" />
          <div className="flex justify-between items-center bg-purple-50 rounded-lg px-3 py-2 -mx-4 mt-1">
            <span className="text-purple-700 text-sm font-medium">目標日</span>
            <span className="text-purple-700 font-bold">
              {goalInfo.goalYear} 年 {goalInfo.goalMonth} 月 {goalInfo.goalDay} 日
            </span>
          </div>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← 戻る
        </button>
        <button
          onClick={onSave}
          className="flex-1 px-4 py-2.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors font-medium"
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">設定</h2>

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
