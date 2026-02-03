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
      <header className="flex justify-between items-center p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Life Countdown
        </h1>
        <button
          onClick={handleOpenModal}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            hasSettings
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-white text-purple-700 shadow-lg animate-pulse'
          }`}
        >
          設定
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
          <div className="text-center">
            <p className="text-white/90 text-xl mb-4">
              まず設定してください
            </p>
            <p className="text-white/60 text-sm mb-6">
              生年月日と目標年齢を入力すると、<br />
              残り時間が表示されます
            </p>
            <button
              onClick={handleOpenModal}
              className="px-6 py-3 bg-white text-purple-700 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              設定を開く
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center p-4 text-white/50 text-xs">
        <p className="mb-1">今日を大切に</p>
        <p>データは端末内（localStorage）に保存され、外部送信しません</p>
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
