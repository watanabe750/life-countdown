import type { TargetColor } from '../types';

export const COLOR_OPTIONS: { value: TargetColor; label: string; from: string; to: string; tab: string }[] = [
  { value: 'purple', label: '紫',   from: '#a855f7', to: '#ec4899', tab: 'rgba(168,85,247,0.8)' },
  { value: 'blue',   label: '青',   from: '#3b82f6', to: '#6366f1', tab: 'rgba(59,130,246,0.8)' },
  { value: 'cyan',   label: '水色', from: '#06b6d4', to: '#3b82f6', tab: 'rgba(6,182,212,0.8)'  },
  { value: 'green',  label: '緑',   from: '#10b981', to: '#06b6d4', tab: 'rgba(16,185,129,0.8)' },
  { value: 'yellow', label: '黄',   from: '#f59e0b', to: '#10b981', tab: 'rgba(245,158,11,0.8)' },
  { value: 'orange', label: 'オレンジ', from: '#f97316', to: '#f59e0b', tab: 'rgba(249,115,22,0.8)' },
  { value: 'red',    label: '赤',   from: '#ef4444', to: '#f97316', tab: 'rgba(239,68,68,0.8)'  },
  { value: 'pink',   label: 'ピンク', from: '#ec4899', to: '#f43f5e', tab: 'rgba(236,72,153,0.8)' },
];

export function getColorOption(color?: TargetColor) {
  return COLOR_OPTIONS.find((c) => c.value === color) ?? COLOR_OPTIONS[0];
}
