import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SettingsModal } from './components/SettingsModal';
import { UnitSwitcher } from './components/UnitSwitcher';
import { CountdownCard } from './components/CountdownCard';
import type { Settings } from './types';
import type { TimeUnit } from './utils/timeUtils';
import { parseDate, calculateGoalDate, calculateRemainingMs } from './utils/timeUtils';

const STORAGE_KEY_SETTINGS = 'life-countdown-settings';
const STORAGE_KEY_UNIT = 'life-countdown-unit';

function App() {
  const [settings, setSettings, resetSettings] = useLocalStorage<Settings | null>(
    STORAGE_KEY_SETTINGS,
    null
  );
  const [selectedUnit, setSelectedUnit] = useLocalStorage<TimeUnit>(
    STORAGE_KEY_UNIT,
    'days'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate goal date and remaining time
  const { goalDate, remainingMs } = useMemo(() => {
    if (!settings?.birthDate) {
      return { goalDate: null, remainingMs: 0 };
    }

    const birthDate = parseDate(settings.birthDate);
    if (!birthDate) {
      return { goalDate: null, remainingMs: 0 };
    }

    const goal = calculateGoalDate(birthDate, settings.targetAge);
    const remaining = calculateRemainingMs(goal, now);

    return { goalDate: goal, remainingMs: remaining };
  }, [settings, now]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSaveSettings = useCallback(
    (newSettings: Settings) => {
      setSettings(newSettings);
    },
    [setSettings]
  );

  const handleResetSettings = useCallback(() => {
    resetSettings();
  }, [resetSettings]);

  const handleUnitChange = useCallback(
    (unit: TimeUnit) => {
      setSelectedUnit(unit);
    },
    [setSelectedUnit]
  );

  const hasSettings = settings?.birthDate && settings?.targetAge;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6 animate-in fade-in slide-in-from-top duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Life Countdown
          </h1>
        </div>
        <button
          onClick={handleOpenModal}
          className={`
            px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
            ${
              hasSettings
                ? 'bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:scale-105 active:scale-95 shadow-lg'
                : 'bg-white text-purple-600 shadow-xl shadow-white/25 animate-pulse hover:shadow-2xl hover:scale-105'
            }
          `}
        >
          ⚙️ 設定
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {hasSettings && goalDate ? (
          <>
            <CountdownCard
              remainingMs={remainingMs}
              selectedUnit={selectedUnit}
              goalDate={goalDate}
            />
            <div className="mt-8">
              <UnitSwitcher
                selectedUnit={selectedUnit}
                onUnitChange={handleUnitChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center animate-in fade-in zoom-in-95 duration-700">
            {/* 初期画面カード */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border-2 border-white/20 shadow-2xl p-10 md:p-16 max-w-lg mx-auto">
              {/* アイコン */}
              <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center shadow-lg mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="text-white text-2xl md:text-3xl font-bold mb-3">
                ようこそ
              </h2>
              <p className="text-white/70 text-base mb-8 leading-relaxed">
                生年月日と目標年齢を入力して、<br />
                あなたの残り時間を可視化しましょう
              </p>
              <button
                onClick={handleOpenModal}
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold shadow-2xl shadow-white/25 hover:shadow-white/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                設定を開始する →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center p-6 animate-in fade-in slide-in-from-bottom duration-500 delay-300">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-5 py-2 border border-white/10">
          <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p className="text-white/60 text-xs font-medium">
            データはローカルに保存され、外部送信されません
          </p>
        </div>
        <p className="text-white/40 text-xs mt-3 font-medium">今日を大切に ✨</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
        currentSettings={settings}
      />
    </div>
  );
}

export default App;
