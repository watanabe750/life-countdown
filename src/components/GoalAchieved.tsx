import { useEffect, useState, useMemo } from 'react';

interface GoalAchievedProps {
  label: string;
  goalDate: Date;
  isToday?: boolean;
}

const COLORS = [
  '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
];

interface Piece {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  shape: 'rect' | 'circle';
}

export function GoalAchieved({ label, goalDate, isToday = false }: GoalAchievedProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [visible, setVisible] = useState(false);

  const goalDateString = useMemo(
    () => goalDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
    [goalDate]
  );

  useEffect(() => {
    // 初回マウント時に紙吹雪を生成
    const newPieces: Piece[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 2,
      rotate: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));
    setPieces(newPieces);

    // 少し遅らせてポップアニメーション
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* 紙吹雪 */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {pieces.map((p) => (
          <div
            key={p.id}
            className="absolute animate-confetti"
            style={{
              left: `${p.x}%`,
              top: '-10px',
              width: p.shape === 'rect' ? p.size : p.size,
              height: p.shape === 'rect' ? p.size * 0.5 : p.size,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              transform: `rotate(${p.rotate}deg)`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* 達成メッセージカード */}
      <div
        className="relative text-center"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.1s' }}
      >
        <div
          className="animate-achievement-pop bg-gradient-to-br from-white/25 via-white/15 to-transparent backdrop-blur-2xl rounded-3xl border-2 border-white/40 shadow-2xl overflow-hidden"
          style={{ padding: '3rem 4rem', opacity: 0, animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          {/* 背景グロー */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-yellow-400/30 to-pink-400/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-3xl" />

          <div className="relative">
            {/* アイコン */}
            <div className="text-7xl mb-6 animate-pulse-slow">{isToday ? '🎂' : '🎉'}</div>

            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/30">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isToday ? 'bg-pink-400' : 'bg-yellow-400'}`} />
              <span className="text-white/90 text-sm font-bold tracking-wider uppercase">
                {isToday ? '今日がその日' : '目標達成'}
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight"
              style={{ textShadow: '0 0 40px rgba(255,255,255,0.4)' }}
            >
              {label}
            </h2>
            <p className="text-white/70 text-lg font-semibold mb-2">
              {isToday ? '今日がその日です！' : '達成おめでとうございます！'}
            </p>
            <p className="text-white/50 text-sm">{goalDateString}</p>

            {/* キラキラライン */}
            <div className={`mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-transparent to-transparent rounded-full animate-pulse ${isToday ? 'via-pink-400' : 'via-yellow-400'}`} />
          </div>

          {/* 底部の輝線 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      </div>
    </div>
  );
}
