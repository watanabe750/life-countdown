export type TimeUnit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';

// Average values for consistent conversion
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
export const DAYS_PER_MONTH = 30.4375; // Average month (365.25 / 12)
export const DAYS_PER_YEAR = 365.2425; // Average solar year

export const MS_PER_SECOND = 1000;
export const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;
export const MS_PER_HOUR = MS_PER_MINUTE * MINUTES_PER_HOUR;
export const MS_PER_DAY = MS_PER_HOUR * HOURS_PER_DAY;
export const MS_PER_WEEK = MS_PER_DAY * DAYS_PER_WEEK;
export const MS_PER_MONTH = MS_PER_DAY * DAYS_PER_MONTH;
export const MS_PER_YEAR = MS_PER_DAY * DAYS_PER_YEAR;

/**
 * Calculate the goal date based on birthdate and target age.
 * Goal is the 00:00 of the birthday in the target year.
 */
export function calculateGoalDate(birthDate: Date, targetAge: number): Date {
  const goalDate = new Date(birthDate);
  goalDate.setFullYear(birthDate.getFullYear() + targetAge);
  goalDate.setHours(0, 0, 0, 0);
  return goalDate;
}

/**
 * Calculate remaining time in milliseconds.
 * Returns 0 if the goal has already passed.
 */
export function calculateRemainingMs(goalDate: Date, now: Date = new Date()): number {
  const remaining = goalDate.getTime() - now.getTime();
  return Math.max(0, remaining);
}

/**
 * Convert milliseconds to the specified unit.
 */
export function convertMsToUnit(ms: number, unit: TimeUnit): number {
  switch (unit) {
    case 'seconds':
      return ms / MS_PER_SECOND;
    case 'minutes':
      return ms / MS_PER_MINUTE;
    case 'hours':
      return ms / MS_PER_HOUR;
    case 'days':
      return ms / MS_PER_DAY;
    case 'weeks':
      return ms / MS_PER_WEEK;
    case 'months':
      return ms / MS_PER_MONTH;
    case 'years':
      return ms / MS_PER_YEAR;
    default:
      return ms / MS_PER_DAY;
  }
}

/**
 * Format the value based on unit.
 * Seconds are displayed as integers, others with 2 decimal places.
 */
export function formatValue(value: number, unit: TimeUnit): string {
  if (unit === 'seconds') {
    return Math.floor(value).toLocaleString();
  }
  return value.toFixed(2);
}

/**
 * Get display label for each unit.
 */
export function getUnitLabel(unit: TimeUnit): string {
  const labels: Record<TimeUnit, string> = {
    years: '年',
    months: '月',
    weeks: '週間',
    days: '日',
    hours: '時間',
    minutes: '分',
    seconds: '秒',
  };
  return labels[unit];
}

/**
 * Format date as YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse date string (YYYY-MM-DD) to Date object.
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}
