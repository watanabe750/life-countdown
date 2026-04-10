import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TargetModal } from './components/TargetModal';
import { TargetTabs } from './components/TargetTabs';
import { UnitSwitcher } from './components/UnitSwitcher';
import { CountdownCard } from './components/CountdownCard';
import { ProgressBar } from './components/ProgressBar';
import { GoalAchieved } from './components/GoalAchieved';
import { DataModal } from './components/DataModal';
import type { Target } from './types';
import type { TimeUnit } from './utils/timeUtils';
import { parseDate, calculateGoalDate, calculateRemainingMs } from './utils/timeUtils';
import { getColorOption } from './utils/colorUtils';

const STORAGE_KEY_UNIT_MAP = 'life-countdown-unit-map';
const STORAGE_KEY_TARGETS = 'life-countdown-targets';
const STORAGE_KEY_ACTIVE_TARGET = 'life-countdown-active-target';
const UNITS: TimeUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

function App() {
  const [targets, setTargets] = useLocalStorage<Target[]>(STORAGE_KEY_TARGETS, []);
  const [activeTargetId, setActiveTargetId] = useLocalStorage<string>(STORAGE_KEY_ACTIVE_TARGET, '');
  const [unitMap, setUnitMap] = useLocalStorage<Record<string, TimeUnit>>(STORAGE_KEY_UNIT_MAP, {});

  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Target | null>(null);
  const [now, setNow] = useState(new Date());

  // アクティブなターゲットを取得
  const activeTarget = useMemo(
    () => targets.find((t) => t.id === activeTargetId) ?? targets[0] ?? null,
    [targets, activeTargetId]
  );

  // 目標ごとの選択単位（デフォルト: 年齢ベース→'years'、日付ベース→'days'）
  const selectedUnit: TimeUnit = useMemo(() => {
    if (!activeTarget) return 'days';
    return unitMap[activeTarget.id] ?? (activeTarget.type === 'age' ? 'years' : 'days');
  }, [activeTarget, unitMap]);

  const setSelectedUnit = useCallback((unitOrUpdater: TimeUnit | ((prev: TimeUnit) => TimeUnit)) => {
    if (!activeTarget) return;
    const id = activeTarget.id;
    setUnitMap((prev) => {
      const current = prev[id] ?? (activeTarget.type === 'age' ? 'years' : 'days');
      const next = typeof unitOrUpdater === 'function' ? unitOrUpdater(current) : unitOrUpdater;
      return { ...prev, [id]: next };
    });
  }, [activeTarget, setUnitMap]);

  // 毎秒更新
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // アクティブターゲットから goalDate / remainingMs / birthDate を計算
  const { goalDate, remainingMs } = useMemo(() => {
    if (!activeTarget) return { goalDate: null, remainingMs: 0 };

    if (activeTarget.type === 'age') {
      const birth = parseDate(activeTarget.birthDate);
      if (!birth) return { goalDate: null, remainingMs: 0 };
      const goal = calculateGoalDate(birth, activeTarget.targetAge);
      return { goalDate: goal, remainingMs: calculateRemainingMs(goal, now) };
    } else {
      const goal = parseDate(activeTarget.targetDate);
      if (!goal) return { goalDate: null, remainingMs: 0 };
      return { goalDate: goal, remainingMs: calculateRemainingMs(goal, now) };
    }
  }, [activeTarget, now]);

  // ProgressBar用: 年齢ベースのみ表示可能
  const progressTarget = activeTarget?.type === 'age' ? activeTarget : null;
  const progressBirthDate = progressTarget ? parseDate(progressTarget.birthDate) : null;

  // 達成済みターゲットのIDセット
  const achievedIds = useMemo(() => {
    const set = new Set<string>();
    for (const t of targets) {
      let goal: Date | null = null;
      if (t.type === 'age') {
        const birth = parseDate(t.birthDate);
        if (birth) goal = calculateGoalDate(birth, t.targetAge);
      } else {
        goal = parseDate(t.targetDate);
      }
      if (goal && calculateRemainingMs(goal, now) <= 0) set.add(t.id);
    }
    return set;
  }, [targets, now]);

  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTargetModalOpen) {
        if (e.key === 'Escape') setIsTargetModalOpen(false);
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedUnit((current: TimeUnit) => {
          const idx = UNITS.indexOf(current);
          return e.key === 'ArrowLeft'
            ? UNITS[idx > 0 ? idx - 1 : UNITS.length - 1]
            : UNITS[idx < UNITS.length - 1 ? idx + 1 : 0];
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTargetModalOpen, setSelectedUnit]);

  // ターゲット操作
  const handleAddTarget = useCallback(() => {
    setEditingTarget(null);
    setIsTargetModalOpen(true);
  }, []);

  const handleEditTarget = useCallback((target: Target) => {
    setEditingTarget(target);
    setIsTargetModalOpen(true);
  }, []);

  const handleSaveTarget = useCallback((target: Target) => {
    setTargets((prev) => {
      const exists = prev.find((t) => t.id === target.id);
      return exists ? prev.map((t) => (t.id === target.id ? target : t)) : [...prev, target];
    });
    setActiveTargetId(target.id);
  }, [setTargets, setActiveTargetId]);

  const handleDeleteTarget = useCallback(() => {
    if (!editingTarget) return;
    setTargets((prev) => {
      const next = prev.filter((t) => t.id !== editingTarget.id);
      if (next.length > 0) setActiveTargetId(next[0].id);
      return next;
    });
  }, [editingTarget, setTargets, setActiveTargetId]);

  const handleImport = useCallback(({ targets: newTargets, activeTargetId: newActiveId, unitMap: newUnitMap }: { targets: Target[]; activeTargetId: string; unitMap: Record<string, TimeUnit> }) => {
    setTargets(newTargets);
    setActiveTargetId(newActiveId);
    setUnitMap(newUnitMap);
  }, [setTargets, setActiveTargetId, setUnitMap]);

  const hasTargets = targets.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="flex justify-center items-center px-6 md:px-10 animate-in fade-in slide-in-from-top duration-500 overflow-visible"
        style={{ paddingTop: '2.5rem', paddingBottom: '1.5rem' }}
      >
        <div className="w-full max-w-7xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl border-2 border-white/25 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Life Countdown
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* 時計 */}
              <div className="text-right hidden sm:block">
                <div className="text-white font-mono font-bold text-lg leading-tight">
                  {now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
                <div className="text-white/60 text-xs">
                  {now.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
                </div>
              </div>
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                title="データ管理（エクスポート/インポート）"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* タブ */}
          {hasTargets && (
            <div style={{ paddingTop: '0.25rem' }}>
              <TargetTabs
                targets={targets}
                activeId={activeTarget?.id ?? ''}
                achievedIds={achievedIds}
                onSelect={setActiveTargetId}
                onAdd={handleAddTarget}
                onEdit={handleEditTarget}
                onReorder={setTargets}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-10 py-6">
        {hasTargets && activeTarget && goalDate && remainingMs <= 0 ? (
          <GoalAchieved
            label={activeTarget.label}
            goalDate={goalDate}
            isToday={
              goalDate.getFullYear() === now.getFullYear() &&
              goalDate.getMonth() === now.getMonth() &&
              goalDate.getDate() === now.getDate()
            }
            onAddNew={handleAddTarget}
          />
        ) : hasTargets && activeTarget && goalDate ? (
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in duration-700 lg:items-stretch">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* 目標名 */}
              {(() => {
                const c = getColorOption(activeTarget.color);
                return (
                  <div className="flex items-center gap-3 px-1">
                    <div className="w-1 h-8 rounded-full" style={{ background: `linear-gradient(to bottom, ${c.from}, ${c.to})` }} />
                    <h2 className="text-white text-2xl font-black tracking-tight">{activeTarget.label}</h2>
                  </div>
                );
              })()}
              <CountdownCard
                remainingMs={remainingMs}
                selectedUnit={selectedUnit}
                goalDate={goalDate}
                memo={activeTarget.memo}
              />
              <UnitSwitcher
                selectedUnit={selectedUnit}
                onUnitChange={setSelectedUnit}
              />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* 左カラムの目標名行と高さを揃えるスペーサー */}
              <div className="h-8 hidden lg:block" />
              {progressTarget && progressBirthDate ? (
                <div className="flex-1">
                  <ProgressBar
                    birthDate={progressBirthDate}
                    targetAge={progressTarget.targetAge}
                    currentDate={now}
                  />
                </div>
              ) : activeTarget.type === 'date' && activeTarget.startDate ? (
                /* 日付ベース目標の進捗バー */
                (() => {
                  const start = parseDate(activeTarget.startDate);
                  if (!start) return null;
                  const totalMs = goalDate.getTime() - start.getTime();
                  const elapsedMs = now.getTime() - start.getTime();
                  const pct = Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100);
                  const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
                  const totalDays = Math.floor(totalMs / (24 * 60 * 60 * 1000));
                  return (
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/30 shadow-2xl" style={{ padding: '2rem' }}>
                      <div className="flex justify-between items-baseline mb-5">
                        <h3 className="text-white/90 text-sm font-bold flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          進捗
                        </h3>
                        <div className="text-2xl font-black tabular-nums bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {pct.toFixed(1)}%
                        </div>
                      </div>
                      <div className="relative h-6 bg-white/5 rounded-full overflow-hidden border border-white/15 shadow-inner">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                        {pct > 10 && (
                          <div className="absolute inset-y-0 flex items-center px-3 text-white text-xs font-bold" style={{ width: `${pct}%`, justifyContent: 'flex-end' }}>
                            {Math.floor(pct)}%
                          </div>
                        )}
                      </div>
                      <div className="mt-5 flex justify-between text-xs tabular-nums">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          <span className="text-white/70 font-medium">{elapsedDays.toLocaleString()} 日経過</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/70 font-medium">残り {(totalDays - elapsedDays).toLocaleString()} 日</span>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : null}
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
                  style={{ animationDuration: `${3 + i}s`, animationDelay: `${i * 0.5}s` }}
                />
              ))}
            </div>

            <div className="relative animate-in fade-in zoom-in-90 duration-1000">
              <div className="bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl rounded-3xl border-2 border-white/30 shadow-2xl p-12 md:p-20 max-w-2xl mx-auto overflow-hidden">
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
                <div className="relative">
                  <div className="relative w-28 h-28 mx-auto mb-8 animate-in zoom-in-50 duration-700 delay-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-60" />
                    <div className="relative w-full h-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
                      <svg className="w-16 h-16 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <h2 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-300" style={{ textShadow: '0 0 40px rgba(255,255,255,0.3)' }}>
                    Life Countdown
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6 animate-in fade-in duration-700 delay-400" />
                  <p className="text-white/80 text-lg md:text-xl mb-12 leading-relaxed animate-in slide-in-from-bottom-2 duration-700 delay-500">
                    あなたの<span className="font-bold text-white">残り時間</span>を可視化して<br />
                    今この瞬間を大切に生きよう
                  </p>

                  <button
                    onClick={handleAddTarget}
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
      <footer className="text-center px-6 pt-2 pb-8 animate-in fade-in slide-in-from-bottom duration-500 delay-300">
        <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-full px-5 py-2 border border-white/10">
          <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p className="text-white/60 text-xs font-medium">
            データはローカルに保存され、外部送信されません
          </p>
        </div>
        {hasTargets && (
          <p className="text-white/30 text-xs mt-2 font-medium">
            <kbd className="font-sans">←</kbd> <kbd className="font-sans">→</kbd> キーで単位を切り替え
          </p>
        )}
        <p className="text-white/40 text-xs mt-2 font-medium">今日を大切に ✨</p>
      </footer>

      {/* データ管理モーダル */}
      <DataModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        targets={targets}
        activeTargetId={activeTargetId}
        unitMap={unitMap}
        onImport={handleImport}
      />

      {/* 目標追加・編集モーダル */}
      <TargetModal
        isOpen={isTargetModalOpen}
        onClose={() => { setIsTargetModalOpen(false); setEditingTarget(null); }}
        onSave={handleSaveTarget}
        onDelete={editingTarget ? handleDeleteTarget : undefined}
        editTarget={editingTarget}
      />
    </div>
  );
}

export default App;
