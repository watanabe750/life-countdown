import { useState, useCallback } from 'react';
import type { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  onReset: () => void;
  currentSettings: Settings | null;
}

export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  onReset,
  currentSettings,
}: SettingsModalProps) {
  const [birthDate, setBirthDate] = useState(currentSettings?.birthDate ?? '');
  const [targetAge, setTargetAge] = useState(currentSettings?.targetAge ?? 80);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    setError(null);

    if (!birthDate) {
      setError('生年月日を入力してください');
      return;
    }

    if (targetAge < 1 || targetAge > 150) {
      setError('目標年齢は1〜150の間で入力してください');
      return;
    }

    onSave({ birthDate, targetAge });
    onClose();
  }, [birthDate, targetAge, onSave, onClose]);

  const handleReset = useCallback(() => {
    if (window.confirm('設定をリセットしますか？保存されたデータが削除されます。')) {
      onReset();
      setBirthDate('');
      setTargetAge(80);
      onClose();
    }
  }, [onReset, onClose]);

  const handleCancel = useCallback(() => {
    // Reset form to current settings
    setBirthDate(currentSettings?.birthDate ?? '');
    setTargetAge(currentSettings?.targetAge ?? 80);
    setError(null);
    onClose();
  }, [currentSettings, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">設定</h2>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              生年月日
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
            />
          </div>

          <div>
            <label
              htmlFor="targetAge"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              目標年齢（何歳まで生きるか）
            </label>
            <input
              type="number"
              id="targetAge"
              value={targetAge}
              onChange={(e) => setTargetAge(Number(e.target.value))}
              min={1}
              max={150}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-800"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              保存
            </button>
          </div>
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm"
          >
            リセット（データを削除）
          </button>
        </div>
      </div>
    </div>
  );
}
