import type { TimeUnit } from './utils/timeUtils';

export interface Settings {
  birthDate: string; // YYYY-MM-DD format
  targetAge: number;
}

export interface AppState {
  settings: Settings | null;
  selectedUnit: TimeUnit;
}
