import { useMemo } from 'react';
import type { TimeUnit } from '../utils/timeUtils';
import {
  convertMsToUnit,
  getUnitLabel,
  formatDate,
} from '../utils/timeUtils';

interface CountdownCardProps {
  remainingMs: number;
  selectedUnit: TimeUnit;
  goalDate: Date;
  remainingDays: number;
  label: string;
}



export function CountdownCard({
  remainingMs,
  selectedUnit,
  goalDate,
  remainingDays,
  label,
}: CountdownCardProps) {
  const displayValue = useMemo(() => {
    const value = convertMsToUnit(remainingMs, selectedUnit);
    return Math.floor(value).toLocaleString();
  }, [remainingMs, selectedUnit]);

  const unitLabel = getUnitLabel(selectedUnit);
  const goalDateString = formatDate(goalDate);

  return (
    <div className="relative">
      {/* メインカード */}
      <div
        style={{ padding: '2.5rem 2rem 3rem' }}
        className="relative bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl rounded-3xl border-2 border-white/30 shadow-2xl overflow-hidden"
      >

        {/* コンテンツ */}
        <div className="relative text-center">
          {/* 期限警告バナー */}
          {remainingDays > 0 && remainingDays <= 30 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <span
                className="inline-flex items-center gap-2 rounded-2xl border font-bold text-sm"
                style={{
                  padding: '0.4rem 1rem',
                  ...(remainingDays <= 7
                    ? {
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(249,115,22,0.25))',
                        borderColor: 'rgba(239,68,68,0.5)',
                        color: '#fca5a5',
                      }
                    : {
                        background: 'linear-gradient(135deg, rgba(234,179,8,0.2), rgba(249,115,22,0.2))',
                        borderColor: 'rgba(234,179,8,0.4)',
                        color: '#fde68a',
                      }),
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: remainingDays <= 7 ? '#f87171' : '#fbbf24',
                    animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                />
                {remainingDays <= 7
                  ? `🔥 あと ${remainingDays} 日！`
                  : `⚠️ あと ${remainingDays} 日`}
              </span>
            </div>
          )}

          {/* 目標名 */}
          <div className="mb-2">
            <h2 className="text-white text-2xl font-black tracking-tight">{label}</h2>
          </div>

          {/* ラベル */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-white/90 text-sm font-bold tracking-wider uppercase">
              Time Remaining
            </p>
          </div>

          {/* 数値表示 - カウントアップアニメーション */}
          <div className="mb-8">
            <div className="flex items-baseline justify-center gap-4">
              <span
                className="font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                style={{
                  fontFeatureSettings: '"tnum"',
                  textShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(167,139,250,0.3)',
                  fontSize: 'clamp(2.5rem, 10vw, 6rem)',
                  lineHeight: 1,
                }}
              >
                {displayValue.split('').map((ch: string, i: number) => (
                  ch === ',' ? (
                    <span key={i} style={{ fontSize: '0.45em', opacity: 0.7, letterSpacing: 0 }}>{ch}</span>
                  ) : ch
                ))}
              </span>
              <div className="flex flex-col items-start mb-4">
                <span className="font-bold text-white/90 text-3xl md:text-4xl">{unitLabel}</span>
                <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-1 animate-pulse" />
              </div>
            </div>
          </div>

          {/* 目標日 */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-white/90 text-base font-semibold">
              目標: {goalDateString}
            </span>
          </div>
        </div>

        {/* カード下部の輝線 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>
    </div>
  );
}
