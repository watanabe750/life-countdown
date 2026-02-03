import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(JSON.parse(localStorage.getItem('test-key')!)).toBe('new-value');
  });

  it('should handle objects correctly', () => {
    const initialObj = { name: 'test', age: 25 };
    const { result } = renderHook(() => useLocalStorage('test-key', initialObj));

    expect(result.current[0]).toEqual(initialObj);

    const newObj = { name: 'updated', age: 30 };
    act(() => {
      result.current[1](newObj);
    });

    expect(result.current[0]).toEqual(newObj);
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(newObj);
  });

  it('should reset to initial value', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored');

    act(() => {
      result.current[2](); // resetValue
    });

    // After reset, value should be back to initial
    expect(result.current[0]).toBe('initial');
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 5));

    act(() => {
      result.current[1]((prev) => prev + 10);
    });

    expect(result.current[0]).toBe(15);
  });
});
