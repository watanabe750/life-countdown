import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SettingsModal } from './components/SettingsModal';
import { UnitSwitcher } from './components/UnitSwitcher';
import { CountdownCard } from './components/CountdownCard';
import { ProgressBar } from './components/ProgressBar';
import type { Settings } from './types';
import type { TimeUnit } from './utils/timeUtils';
import { parseDate, calculateGoalDate, calculateRemainingMs } from './utils/timeUtils';

const STORAGE_KEY_SETTINGS = 'life-countdown-settings';
const STORAGE_KEY_UNIT = 'life-countdown-unit';
const UNITS: TimeUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

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
  const { goalDate, remainingMs, birthDate } = useMemo(() => {
    if (!settings?.birthDate) {
      return { goalDate: null, remainingMs: 0, birthDate: null };
    }

    const birthDate = parseDate(settings.birthDate);
    if (!birthDate) {
      return { goalDate: null, remainingMs: 0, birthDate: null };
    }

    const goal = calculateGoalDate(birthDate, settings.targetAge);
    const remaining = calculateRemainingMs(goal, now);

    return { goalDate: goal, remainingMs: remaining, birthDate };
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

  // Keyboard shortcuts: ←/→ for unit switching, Esc to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when modal is open (except Esc)
      if (isModalOpen) {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedUnit((current: TimeUnit) => {
          const idx = UNITS.indexOf(current);
          if (e.key === 'ArrowLeft') {
            return UNITS[idx > 0 ? idx - 1 : UNITS.length - 1];
          } else {
            return UNITS[idx < UNITS.length - 1 ? idx + 1 : 0];
          }
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, setSelectedUnit]);

  const hasSettings = settings?.birthDate && settings?.targetAge;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-center items-center p-4 md:p-6 animate-in fade-in slide-in-from-top duration-500">
        <div className="w-full max-w-6xl flex justify-between items-center px-4 md:px-8">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        {hasSettings && goalDate && birthDate && settings ? (
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-700">
            {/* Left Column - Countdown Card (Larger) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <CountdownCard
                remainingMs={remainingMs}
                selectedUnit={selectedUnit}
                goalDate={goalDate}
              />
              <UnitSwitcher
                selectedUnit={selectedUnit}
                onUnitChange={handleUnitChange}
              />
            </div>

            {/* Right Column - Progress & Stats (stretch to match left) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <ProgressBar
                birthDate={birthDate}
                targetAge={settings.targetAge}
                currentDate={now}
              />

              {/* Quick Stats Card - flex-1 to fill remaining height */}
              <div className="relative flex-1 animate-in fade-in slide-in-from-right duration-700 delay-300">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse-slow" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl h-full flex flex-col">
                  <h3 className="text-white/90 text-sm font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Quick Stats
                  </h3>
                  <div className="flex-1 grid grid-cols-2 gap-3 auto-rows-fr">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col justify-center">
                      <div className="text-white/60 text-xs font-medium mb-1">誕生日</div>
                      <div className="text-white text-base font-bold">
                        {birthDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col justify-center">
                      <div className="text-white/60 text-xs font-medium mb-1">目標年齢</div>
                      <div className="text-white text-base font-bold">{settings.targetAge} 歳</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col justify-center">
                      <div className="text-white/60 text-xs font-medium mb-1">目標日</div>
                      <div className="text-white text-base font-bold">
                        {goalDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col justify-center">
                      <div className="text-white/60 text-xs font-medium mb-1">現在の年齢</div>
                      <div className="text-white text-base font-bold">
                        {(() => {
                          const ageDiff = now.getFullYear() - birthDate.getFullYear();
                          const monthDiff = now.getMonth() - birthDate.getMonth();
                          const dayDiff = now.getDate() - birthDate.getDate();
                          return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? ageDiff - 1 : ageDiff;
                        })()} 歳
                      </div>
                    </div>
                    <div className="col-span-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 flex flex-col justify-center">
                      <div className="text-white/60 text-xs font-medium mb-1">次の誕生日まで</div>
                      <div className="text-white text-base font-bold">
                        {(() => {
                          const nextBday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                          if (nextBday <= now) nextBday.setFullYear(nextBday.getFullYear() + 1);
                          return Math.ceil((nextBday.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
                        })()} 日
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center relative">
            {/* 背景の円形波紋 */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-64 h-64 border-2 border-white/10 rounded-full animate-ping"
                  style={{
                    animationDuration: `${3 + i}s`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>

            {/* メインカード - スプラッシュアニメーション */}
            <div className="relative animate-in fade-in zoom-in-90 duration-1000">
              <div className="bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl rounded-[2.5rem] border-2 border-white/30 shadow-2xl p-12 md:p-20 max-w-2xl mx-auto overflow-hidden">
                {/* 光る粒子 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                      style={{
                        left: `${(i * 13 + 10) % 100}%`,
                        top: `${(i * 17 + 20) % 100}%`,
                        animation: `float ${4 + i * 0.3}s linear infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>

                {/* グラデーション装飾 */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-400/40 to-transparent rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-br from-pink-400/40 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

                {/* コンテンツ */}
                <div className="relative">
                  {/* アイコン */}
                  <div className="relative w-28 h-28 mx-auto mb-8 animate-in zoom-in-50 duration-700 delay-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60 animate-pulse-slow" />
                    <div className="relative w-full h-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
                      <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* タイトル */}
                  <h2 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-300" style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
                    Life Countdown
                  </h2>

                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6 animate-in fade-in duration-700 delay-400" />

                  <p className="text-white/80 text-lg md:text-xl mb-12 leading-relaxed animate-in slide-in-from-bottom-2 duration-700 delay-500">
                    あなたの<span className="font-bold text-white">残り時間</span>を可視化して<br />
                    今この瞬間を大切に生きよう
                  </p>

                  {/* CTA ボタン */}
                  <button
                    onClick={handleOpenModal}
                    className="group relative px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105 active:scale-95 transition-all duration-300 animate-in zoom-in-95 duration-700 delay-700 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-3">
                      始めましょう
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
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
