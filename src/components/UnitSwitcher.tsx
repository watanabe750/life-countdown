import { useCallback } from 'react';
import type { TimeUnit } from '../utils/timeUtils';
import { getUnitLabel } from '../utils/timeUtils';

interface UnitSwitcherProps {
  selectedUnit: TimeUnit;
  onUnitChange: (unit: TimeUnit) => void;
}

const UNITS: TimeUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

export function UnitSwitcher({ selectedUnit, onUnitChange }: UnitSwitcherProps) {
  const handleClick = useCallback(
    (unit: TimeUnit) => {
      onUnitChange(unit);
    },
    [onUnitChange]
  );

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
      {UNITS.map((unit) => (
        <button
          key={unit}
          onClick={() => handleClick(unit)}
          className={`
            relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
            ${
              selectedUnit === unit
                ? 'bg-white text-purple-600 shadow-lg shadow-white/25 scale-105'
                : 'bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25 hover:border-white/30 hover:scale-105 hover:shadow-md active:scale-95'
            }
          `}
        >
          {/* 選択時の光効果 */}
          {selectedUnit === unit && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
          )}
          <span className="relative">{getUnitLabel(unit)}</span>
        </button>
      ))}
    </div>
  );
}
