import { useMemo } from 'react';
import type { TimeUnit } from '../utils/timeUtils';
import {
  convertMsToUnit,
  formatValue,
  getUnitLabel,
  formatDate,
} from '../utils/timeUtils';

interface CountdownCardProps {
  remainingMs: number;
  selectedUnit: TimeUnit;
  goalDate: Date;
}

export function CountdownCard({
  remainingMs,
  selectedUnit,
  goalDate,
}: CountdownCardProps) {
  const displayValue = useMemo(() => {
    const value = convertMsToUnit(remainingMs, selectedUnit);
    return formatValue(value, selectedUnit);
  }, [remainingMs, selectedUnit]);

  const unitLabel = getUnitLabel(selectedUnit);
  const goalDateString = formatDate(goalDate);

  return (
    <div className="relative">
      {/* メインカウントダウンカード */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border-2 border-white/20 shadow-2xl p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
        {/* 背景装飾 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />

        {/* コンテンツ */}
        <div className="relative text-center">
          <p className="text-white/70 text-sm md:text-base font-medium mb-4 tracking-wide uppercase">
            Remaining Time
          </p>

          {/* 数値表示 */}
          <div className="flex items-baseline justify-center gap-3 md:gap-4 mb-8">
            <span className="text-7xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl animate-in slide-in-from-bottom-4 duration-700" style={{ fontFeatureSettings: '"tnum"' }}>
              {displayValue}
            </span>
            <span className="text-3xl md:text-4xl font-bold text-white/90 mb-2">{unitLabel}</span>
          </div>

          {/* 目標日表示 */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20 shadow-lg">
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white/80 text-sm font-medium">
              目標日: {goalDateString}
            </span>
          </div>
        </div>

        {/* 光の反射効果 */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 背景装飾円 */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
    </div>
  );
}
