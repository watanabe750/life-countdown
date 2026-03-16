import { useMemo, useEffect, useState, useRef } from 'react';
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
  remainingDays: number;
}

// 数値のカウントアップアニメーション
function useCountUp(target: string, duration: number = 1000) {
  const [displayValue, setDisplayValue] = useState('0');
  const previousTarget = useRef(target);

  useEffect(() => {
    if (previousTarget.current === target) return;

    const targetNum = parseFloat(target.replace(/,/g, ''));
    const startNum = parseFloat(previousTarget.current.replace(/,/g, '')) || 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング関数（easeOutExpo）
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startNum + (targetNum - startNum) * eased;

      setDisplayValue(formatNumber(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousTarget.current = target;
      }
    };

    animate();
  }, [target, duration]);

  return displayValue;
}

function formatNumber(num: number): string {
  return Math.floor(num).toLocaleString('en-US');
}

export function CountdownCard({
  remainingMs,
  selectedUnit,
  goalDate,
  remainingDays,
}: CountdownCardProps) {
  const displayValue = useMemo(() => {
    const value = convertMsToUnit(remainingMs, selectedUnit);
    return formatValue(value, selectedUnit);
  }, [remainingMs, selectedUnit]);

  const animatedValue = useCountUp(displayValue, 800);
  const unitLabel = getUnitLabel(selectedUnit);
  const goalDateString = formatDate(goalDate);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // パーティクルの位置を固定（レンダー時に変化しないように）
  const particles = useMemo(() => {
    return [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      opacity: Math.random() * 0.7,
    }));
  }, []);

  // マウス追跡で3D傾き効果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative perspective-1000">
      {/* 背景の波紋エフェクト */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-spin-slow opacity-20">
          <div className="absolute inset-0 bg-gradient-conic from-purple-500 via-pink-500 to-purple-500 rounded-full blur-3xl" />
        </div>
      </div>

      {/* メインカード */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${-mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg) scale3d(1.02, 1.02, 1.02)`,
          transition: 'transform 0.2s ease-out',
          padding: '2.5rem 2rem 3rem',
        }}
        className="relative bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-2xl rounded-3xl border-2 border-white/30 shadow-2xl overflow-hidden"
      >
        {/* 光の粒子エフェクト */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                opacity: particle.opacity,
              }}
            />
          ))}
        </div>

        {/* グラデーション装飾 */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

        {/* コンテンツ */}
        <div className="relative text-center">
          {/* 期限警告バナー */}
          {remainingDays > 0 && remainingDays <= 30 && (
            <div
              className="mb-5 inline-flex items-center gap-2 rounded-2xl border font-bold text-sm"
              style={{
                padding: '0.5rem 1.25rem',
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
            </div>
          )}

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
                className={`font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 ${
                  animatedValue.length > 13
                    ? 'text-3xl md:text-5xl'
                    : animatedValue.length > 10
                      ? 'text-4xl md:text-6xl'
                      : animatedValue.length > 7
                        ? 'text-5xl md:text-7xl'
                        : 'text-8xl md:text-9xl'
                }`}
                style={{
                  fontFeatureSettings: '"tnum"',
                  textShadow: '0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(167,139,250,0.3)',
                }}
                key={animatedValue}
              >
                {animatedValue.split('').map((ch, i) => (
                  ch === ',' ? (
                    <span key={i} style={{ fontSize: '0.45em', opacity: 0.7, letterSpacing: 0 }}>{ch}</span>
                  ) : ch
                ))}
              </span>
              <div className="flex flex-col items-start mb-4">
                <span className={`font-bold text-white/90 ${
                  animatedValue.length > 10 ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'
                }`}>{unitLabel}</span>
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
