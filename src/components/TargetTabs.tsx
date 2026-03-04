import type { Target } from '../types';

interface TargetTabsProps {
  targets: Target[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onEdit: (target: Target) => void;
}

const MAX_TARGETS = 10;

export function TargetTabs({ targets, activeId, onSelect, onAdd, onEdit }: TargetTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {targets.map((target) => {
        const isActive = target.id === activeId;
        return (
          <div key={target.id} className="relative group flex items-center" style={{ marginRight: '4px' }}>
            <button
              onClick={() => onSelect(target.id)}
              className={`
                rounded-2xl text-sm font-bold transition-all duration-200 truncate
                ${isActive
                  ? 'bg-white text-purple-700 shadow-lg shadow-white/20'
                  : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white'
                }
              `}
              style={{ padding: '0.5rem 1.5rem 0.5rem 1rem', maxWidth: '10rem' }}
              title={target.label}
            >
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

      {/* 追加ボタン（上限10まで）— 区切り線で分離 */}
      {targets.length < MAX_TARGETS && (
        <>
          <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />
          <button
            onClick={onAdd}
            className="rounded-2xl text-sm font-bold bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border border-white/20 border-dashed transition-all duration-200 flex items-center"
            style={{ padding: '0.5rem 0.75rem', gap: '0.375rem' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            追加
          </button>
        </>
      )}
    </div>
  );
}
