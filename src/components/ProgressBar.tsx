import { useMemo } from 'react';
import type { TargetColor } from '../types';
import { getColorOption } from '../utils/colorUtils';

interface ProgressBarProps {
  startDate: Date;
  endDate: Date;
  currentDate: Date;
  color?: TargetColor;
}

export function ProgressBar({ startDate, endDate, currentDate, color }: ProgressBarProps) {
  const colorOpt = getColorOption(color);

  const { percentage, elapsed, total } = useMemo(() => {
    const totalMs = endDate.getTime() - startDate.getTime();
    const elapsedMs = currentDate.getTime() - startDate.getTime();
    const pct = Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100);
    const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
    const totalDays = Math.floor(totalMs / (24 * 60 * 60 * 1000));
    return { percentage: pct, elapsed: elapsedDays, total: totalDays };
  }, [startDate, endDate, currentDate]);

  const milestones = useMemo(() => {
    return [25, 50, 75].map((pct) => {
      const ms = (endDate.getTime() - startDate.getTime()) * (pct / 100);
      const date = new Date(startDate.getTime() + ms);
      const isPast = date <= currentDate;
      return { pct, date, isPast };
    });
  }, [startDate, endDate, currentDate]);

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200">
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/30 shadow-2xl h-full flex flex-col" style={{ padding: '2rem' }}>
        {/* ヘッダー */}
        <div className="flex justify-between items-baseline mb-5">
          <h3 className="text-white/90 text-sm md:text-base font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            人生の進捗
          </h3>
          <div
            className="text-2xl md:text-3xl font-black tabular-nums bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(135deg, ${colorOpt.from}, ${colorOpt.to})` }}
          >
            {percentage.toFixed(1)}%
          </div>
        </div>

        {/* プログレスバー */}
        <div className="relative h-6 bg-white/5 rounded-full overflow-hidden border border-white/15 shadow-inner">
          <div
            className="absolute inset-0 transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%`, backgroundImage: `linear-gradient(to right, ${colorOpt.from}, ${colorOpt.to})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
          {percentage > 10 && (
            <div
              className="absolute inset-y-0 flex items-center px-3 text-white text-xs font-bold tabular-nums transition-all duration-1000"
              style={{ width: `${percentage}%`, justifyContent: 'flex-end' }}
            >
              {Math.floor(percentage)}%
            </div>
          )}
        </div>

        {/* 経過 / 残り 日数 */}
        <div className="mt-4 flex justify-between text-xs tabular-nums">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colorOpt.from }} />
            <span className="text-white/70 font-medium">{elapsed.toLocaleString()} 日経過</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70 font-medium">残り {(total - elapsed).toLocaleString()} 日</span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colorOpt.to, animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* マイルストーン */}
        <div className="mt-5 pt-5 border-t border-white/10 flex flex-col gap-3 flex-1 justify-center">
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">マイルストーン</p>
          {milestones.map(({ pct, date, isPast }) => (
            <div key={pct} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                  style={{
                    background: isPast
                      ? `linear-gradient(135deg, ${colorOpt.from}, ${colorOpt.to})`
                      : 'rgba(255,255,255,0.1)',
                    color: isPast ? 'white' : 'rgba(255,255,255,0.4)',
                  }}
                >
                  {isPast ? '✓' : `${pct}`}
                </div>
                <span className={`text-sm font-bold ${isPast ? 'text-white/90' : 'text-white/40'}`}>
                  {pct}%
                </span>
              </div>
              <span className={`text-xs tabular-nums font-medium ${isPast ? 'text-white/60' : 'text-white/30'}`}>
                {date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
