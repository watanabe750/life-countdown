import { useMemo } from 'react';
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
}

export function CountdownCard({
  remainingMs,
  selectedUnit,
  goalDate,
}: CountdownCardProps) {
  const displayValue = useMemo(() => {
    const value = convertMsToUnit(remainingMs, selectedUnit);
    return formatValue(value, selectedUnit);
  }, [remainingMs, selectedUnit]);

  const unitLabel = getUnitLabel(selectedUnit);
  const goalDateString = formatDate(goalDate);

  return (
    <div className="text-center">
      <p className="text-white/80 text-lg mb-2">残り時間</p>
      <div className="flex items-baseline justify-center gap-3">
        <span className="text-6xl md:text-8xl font-bold text-white tracking-tight">
          {displayValue}
        </span>
        <span className="text-2xl md:text-3xl text-white/90">{unitLabel}</span>
      </div>
      <p className="text-white/60 text-sm mt-6">
        目標日: {goalDateString}
      </p>
    </div>
  );
}
