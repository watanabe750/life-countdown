import { describe, it, expect } from 'vitest';
import {
  calculateGoalDate,
  calculateRemainingMs,
  convertMsToUnit,
  formatValue,
  parseDate,
  MS_PER_DAY,
  MS_PER_MONTH,
  MS_PER_YEAR,
} from './timeUtils';

describe('timeUtils', () => {
  describe('calculateGoalDate', () => {
    it('should calculate goal date correctly', () => {
      const birthDate = new Date(2000, 4, 20); // May 20, 2000
      const targetAge = 80;
      const goal = calculateGoalDate(birthDate, targetAge);

      expect(goal.getFullYear()).toBe(2080);
      expect(goal.getMonth()).toBe(4); // May (0-indexed)
      expect(goal.getDate()).toBe(20);
      expect(goal.getHours()).toBe(0);
      expect(goal.getMinutes()).toBe(0);
      expect(goal.getSeconds()).toBe(0);
    });

    it('should handle leap year birthdays', () => {
      const birthDate = new Date(2000, 1, 29); // Feb 29, 2000 (leap year)
      const targetAge = 80;
      const goal = calculateGoalDate(birthDate, targetAge);

      expect(goal.getFullYear()).toBe(2080);
      // Note: 2080 is a leap year, so Feb 29 is valid
      expect(goal.getMonth()).toBe(1); // February
      expect(goal.getDate()).toBe(29);
    });
  });

  describe('calculateRemainingMs', () => {
    it('should calculate remaining time correctly', () => {
      const goal = new Date(2080, 4, 20, 0, 0, 0, 0);
      const now = new Date(2025, 0, 1, 0, 0, 0, 0);
      const remaining = calculateRemainingMs(goal, now);

      expect(remaining).toBeGreaterThan(0);
    });

    it('should return 0 if goal is in the past', () => {
      const goal = new Date(2020, 0, 1);
      const now = new Date(2025, 0, 1);
      const remaining = calculateRemainingMs(goal, now);

      expect(remaining).toBe(0);
    });

    it('should return 0 if goal equals now', () => {
      const dateTime = new Date(2025, 0, 1);
      const remaining = calculateRemainingMs(dateTime, dateTime);

      expect(remaining).toBe(0);
    });
  });

  describe('convertMsToUnit', () => {
    it('should convert 7 days to 1 week', () => {
      const sevenDaysMs = 7 * MS_PER_DAY;
      const weeks = convertMsToUnit(sevenDaysMs, 'weeks');

      expect(weeks).toBeCloseTo(1, 5);
    });

    it('should convert 30.4375 days to 1 month', () => {
      const oneMonthMs = MS_PER_MONTH;
      const months = convertMsToUnit(oneMonthMs, 'months');

      expect(months).toBeCloseTo(1, 5);
    });

    it('should convert 365.2425 days to 1 year', () => {
      const oneYearMs = MS_PER_YEAR;
      const years = convertMsToUnit(oneYearMs, 'years');

      expect(years).toBeCloseTo(1, 5);
    });

    it('should convert days to hours correctly', () => {
      const oneDayMs = MS_PER_DAY;
      const hours = convertMsToUnit(oneDayMs, 'hours');

      expect(hours).toBe(24);
    });

    it('should convert hours to minutes correctly', () => {
      const oneHourMs = 60 * 60 * 1000;
      const minutes = convertMsToUnit(oneHourMs, 'minutes');

      expect(minutes).toBe(60);
    });

    it('should convert minutes to seconds correctly', () => {
      const oneMinuteMs = 60 * 1000;
      const seconds = convertMsToUnit(oneMinuteMs, 'seconds');

      expect(seconds).toBe(60);
    });
  });

  describe('formatValue', () => {
    it('should format seconds as integers', () => {
      const result = formatValue(123.456, 'seconds');
      expect(result).toBe('123');
    });

    it('should format days with 2 decimal places', () => {
      const result = formatValue(123.456789, 'days');
      expect(result).toBe('123.46');
    });

    it('should format weeks with 2 decimal places', () => {
      const result = formatValue(52.1234, 'weeks');
      expect(result).toBe('52.12');
    });

    it('should format years with 2 decimal places', () => {
      const result = formatValue(55.5555, 'years');
      expect(result).toBe('55.56');
    });
  });

  describe('parseDate', () => {
    it('should parse valid date string', () => {
      const date = parseDate('2000-05-20');
      expect(date).not.toBeNull();
      expect(date!.getFullYear()).toBe(2000);
      expect(date!.getMonth()).toBe(4); // May (0-indexed)
      expect(date!.getDate()).toBe(20);
    });

    it('should return null for empty string', () => {
      const date = parseDate('');
      expect(date).toBeNull();
    });

    it('should return null for invalid format', () => {
      const date = parseDate('invalid');
      expect(date).toBeNull();
    });
  });
});
