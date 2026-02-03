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
    <div className="flex flex-wrap justify-center gap-2">
      {UNITS.map((unit) => (
        <button
          key={unit}
          onClick={() => handleClick(unit)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedUnit === unit
              ? 'bg-white text-purple-700 shadow-md'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          {getUnitLabel(unit)}
        </button>
      ))}
    </div>
  );
}
