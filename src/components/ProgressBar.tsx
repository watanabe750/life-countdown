import { useMemo } from 'react';

interface ProgressBarProps {
  birthDate: Date;
  targetAge: number;
  currentDate: Date;
}

export function ProgressBar({ birthDate, targetAge, currentDate }: ProgressBarProps) {
  const { percentage, elapsed, total } = useMemo(() => {
    const totalMs = targetAge * 365.25 * 24 * 60 * 60 * 1000;
    const elapsedMs = currentDate.getTime() - birthDate.getTime();
    const pct = Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100);

    // 経過日数と総日数を計算
    const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
    const totalDays = Math.floor(totalMs / (24 * 60 * 60 * 1000));

    return {
      percentage: pct,
      elapsed: elapsedDays,
      total: totalDays,
    };
  }, [birthDate, targetAge, currentDate]);

  return (
    <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200">
      {/* 背景の光のオーラ */}
      <div className="relative">
        <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse-slow" />

        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 md:p-8 shadow-xl">
          {/* ヘッダー */}
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-white/90 text-sm md:text-base font-bold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Life Progress
            </h3>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {percentage.toFixed(2)}%
              </div>
              <div className="text-white/50 text-xs font-medium mt-0.5">
                {elapsed.toLocaleString()} / {total.toLocaleString()} 日
              </div>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="relative h-6 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
            {/* グラデーション背景 */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            >
              {/* 光るアニメーション */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>

            {/* パーセンテージ表示（バー内） */}
            {percentage > 10 && (
              <div
                className="absolute inset-y-0 flex items-center px-3 text-white text-xs font-bold transition-all duration-1000"
                style={{ width: `${percentage}%`, justifyContent: 'flex-end' }}
              >
                {percentage.toFixed(1)}%
              </div>
            )}
          </div>

          {/* 追加情報 */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-white/70 font-medium">経過: {elapsed.toLocaleString()} 日</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-white/70 font-medium">残り: {(total - elapsed).toLocaleString()} 日</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
