import { useRef, useState } from 'react';
import type { Target } from '../types';

interface TargetTabsProps {
  targets: Target[];
  activeId: string;
  achievedIds: Set<string>;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (target: Target) => void;
  onReorder: (targets: Target[]) => void;
}

const MAX_TARGETS = 10;

export function TargetTabs({ targets, activeId, achievedIds, onSelect, onAdd, onEdit, onReorder }: TargetTabsProps) {
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (dragIndex.current === null || dragIndex.current === index) {
      setDragOverIndex(null);
      return;
    }
    const reordered = [...targets];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    onReorder(reordered);
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {targets.length > 1 && targets.map((target, index) => {
        const isActive = target.id === activeId;
        const isAchieved = achievedIds.has(target.id);
        const isDragOver = dragOverIndex === index;
        return (
          <div
            key={target.id}
            className="relative group flex items-center"
            style={{ marginRight: '4px', opacity: dragIndex.current === index ? 0.4 : 1 }}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
          >
            {/* ドロップ位置インジケーター */}
            {isDragOver && (
              <div className="absolute -left-1.5 top-0 bottom-0 w-1 bg-white/80 rounded-full" />
            )}
            <button
              onClick={() => onSelect(target.id)}
              className={`
                rounded-2xl text-sm font-bold transition-all duration-200 truncate cursor-grab active:cursor-grabbing
                ${isActive
                  ? 'bg-white text-purple-700 shadow-lg shadow-white/20'
                  : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white'
                }
              `}
              style={{ padding: '0.5rem 1.5rem 0.5rem 1rem', maxWidth: '10rem' }}
              title={target.label}
            >
              {isAchieved && (
                <span style={{ marginRight: '0.25rem' }}>✓</span>
              )}
              {target.label}
            </button>
            {/* 編集ボタン（常時表示） */}
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(target); }}
              className="absolute top-0 right-0 w-5 h-5 bg-white/80 rounded-full text-gray-500 hover:text-purple-600 hover:bg-white transition-all duration-200 flex items-center justify-center shadow-sm translate-x-1/3 -translate-y-1/3"
              title="編集"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        );
      })}

      {/* 追加ボタン — 区切り線で分離、上限時はグレーアウト＋ツールチップ */}
      <>
        {targets.length > 1 && <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />}
        <div className="relative" style={{ isolation: 'isolate' }}>
          <button
            onClick={targets.length < MAX_TARGETS ? onAdd : undefined}
            disabled={targets.length >= MAX_TARGETS}
            className="rounded-2xl text-sm font-bold border border-dashed transition-all duration-200 flex items-center peer"
            style={{
              padding: '0.5rem 0.75rem',
              gap: '0.375rem',
              backgroundColor: targets.length >= MAX_TARGETS ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.10)',
              color: targets.length >= MAX_TARGETS ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.60)',
              borderColor: targets.length >= MAX_TARGETS ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.20)',
              cursor: targets.length >= MAX_TARGETS ? 'not-allowed' : 'pointer',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            追加
          </button>
          {targets.length >= MAX_TARGETS && (
            <div
              className="absolute bottom-full left-1/2 mb-2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 peer-hover:opacity-100 transition-opacity duration-200 z-50"
              style={{ transform: 'translateX(-50%)' }}
            >
              上限 {MAX_TARGETS} 件です
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
            </div>
          )}
        </div>
      </>
    </div>
  );
}
