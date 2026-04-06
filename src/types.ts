import type { TimeUnit } from './utils/timeUtils';

export interface Settings {
  birthDate: string; // YYYY-MM-DD format
  targetAge: number;
}

export interface AppState {
  settings: Settings | null;
  selectedUnit: TimeUnit;
}

// 年齢ベースの目標（誕生日 + 目標年齢）
export interface AgeTarget {
  id: string;
  type: 'age';
  label: string;
  birthDate: string; // YYYY-MM-DD
  targetAge: number;
  memo?: string;
}

// 日付ベースの目標（任意の日付）
export interface DateTarget {
  id: string;
  type: 'date';
  label: string;
  targetDate: string; // YYYY-MM-DD
  memo?: string;
}

export type Target = AgeTarget | DateTarget;
