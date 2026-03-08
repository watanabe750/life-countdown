import { useState, useCallback, useMemo } from 'react';
import type { Target, AgeTarget, DateTarget } from '../types';

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (target: Target) => void;
  onDelete?: () => void;
  editTarget?: Target | null; // 編集時は既存データを渡す
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function TargetModal({ isOpen, onClose, onSave, onDelete, editTarget }: TargetModalProps) {
  const isEdit = !!editTarget;

  const [type, setType] = useState<'age' | 'date'>(editTarget?.type ?? 'age');
  const [label, setLabel] = useState(editTarget?.label ?? '');

  // 年齢ベース用
  const [year, setYear] = useState(() => {
    if (editTarget?.type === 'age') return editTarget.birthDate.split('-')[0];
    return '';
  });
  const [month, setMonth] = useState(() => {
    if (editTarget?.type === 'age') return String(parseInt(editTarget.birthDate.split('-')[1], 10));
    return '';
  });
  const [day, setDay] = useState(() => {
    if (editTarget?.type === 'age') return String(parseInt(editTarget.birthDate.split('-')[2], 10));
    return '';
  });
  const [targetAge, setTargetAge] = useState(
    editTarget?.type === 'age' ? editTarget.targetAge : 80
  );

  // 日付ベース用
  const [targetDate, setTargetDate] = useState(
    editTarget?.type === 'date' ? editTarget.targetDate : ''
  );

  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const birthDateStr = useMemo(() => {
    if (!year || !month || !day) return '';
    return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }, [year, month, day]);

  const validate = useCallback((): string | null => {
    if (!label.trim()) return 'タイトルを入力してください';

    if (type === 'age') {
      if (!year || !month || !day) return '生年月日を全て入力してください';
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const d = parseInt(day, 10);
      if (isNaN(y) || isNaN(m) || isNaN(d)) return '数字を入力してください';
      if (m < 1 || m > 12) return '月は1〜12の間で入力してください';
      if (d < 1 || d > 31) return '日は1〜31の間で入力してください';
      const date = new Date(y, m - 1, d);
      if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d)
        return 'この日付は存在しません';
      if (date > new Date()) return '生年月日は過去の日付を入力してください';
      if (targetAge < 1 || targetAge > 150) return '目標年齢は1〜150の間で入力してください';
    } else {
      if (!targetDate) return '目標日を入力してください';
      // YYYY-MM-DD をローカル時間として解釈するため手動でパース
      const [ty, tm, td] = targetDate.split('-').map(Number);
      const parsed = new Date(ty, tm - 1, td);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (parsed < today) return '目標日は今日以降の日付を入力してください';
    }

    return null;
  }, [label, type, year, month, day, targetAge, targetDate]);

  const handleSave = useCallback(() => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(null);

    if (type === 'age') {
      const target: AgeTarget = {
        id: editTarget?.id ?? generateId(),
        type: 'age',
        label: label.trim(),
        birthDate: birthDateStr,
        targetAge,
      };
      onSave(target);
    } else {
      const target: DateTarget = {
        id: editTarget?.id ?? generateId(),
        type: 'date',
        label: label.trim(),
        targetDate,
      };
      onSave(target);
    }
    onClose();
  }, [validate, type, label, birthDateStr, targetAge, targetDate, editTarget, onSave, onClose]);

  const handleDelete = useCallback(() => {
    onDelete?.();
    onClose();
  }, [onDelete, onClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={handleOverlayClick}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full border border-white/20 animate-in zoom-in-95 duration-300 overflow-y-auto" style={{ maxHeight: 'calc(100dvh - 2rem)', padding: '2rem 2.5rem' }}>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
          {isEdit ? '目標を編集' : '目標を追加'}
        </h2>

        <div className="space-y-6">
          {/* タイトル */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold text-gray-700">タイトル</label>
              <span className="text-xs text-gray-400">{label.length}/20</span>
            </div>
            <input
              type="text"
              placeholder="例：人生の目標、結婚記念日..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={20}
              className="w-full px-5 py-3 bg-white border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-gray-800 font-medium transition-all"
            />
          </div>

          {/* 種類選択 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">種類</label>
            <div className="flex gap-3">
              <button
                onClick={() => setType('age')}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  type === 'age'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                年齢ベース
              </button>
              <button
                onClick={() => setType('date')}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  type === 'date'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                日付ベース
              </button>
            </div>
          </div>

          {/* 年齢ベース入力 */}
          {type === 'age' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">生年月日</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1990"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    maxLength={4}
                    className="flex-1 px-3 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-gray-800 text-center font-bold transition-all"
                  />
                  <span className="text-gray-400 font-bold">/</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="01"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    maxLength={2}
                    className="w-16 px-3 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-gray-800 text-center font-bold transition-all"
                  />
                  <span className="text-gray-400 font-bold">/</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="01"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    maxLength={2}
                    className="w-16 px-3 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-gray-800 text-center font-bold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  目標年齢
                  <span className="ml-3 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-full shadow">{targetAge} 歳</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={150}
                  value={targetAge}
                  onChange={(e) => setTargetAge(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1歳</span><span>75歳</span><span>150歳</span>
                </div>
              </div>
            </div>
          )}

          {/* 日付ベース入力 */}
          {type === 'date' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">目標日</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-5 py-3 bg-white border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none text-gray-800 font-medium transition-all"
              />
            </div>
          )}

          {/* エラー */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex flex-col gap-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition-all font-semibold"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 transition-all font-bold"
              >
                {isEdit ? '更新' : '追加'}
              </button>
            </div>
            {isEdit && onDelete && (
              confirmingDelete ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-3">
                  <p className="text-red-700 text-sm font-semibold text-center">
                    「{editTarget?.label}」を削除しますか？
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmingDelete(false)}
                      className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition-all font-semibold text-sm"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all font-bold text-sm"
                    >
                      削除する
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="w-full px-4 py-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 active:scale-95 transition-all font-semibold text-sm"
                >
                  この目標を削除
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
