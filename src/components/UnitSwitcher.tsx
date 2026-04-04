import { useCallback, useState, useEffect } from 'react';
import type { TimeUnit } from '../utils/timeUtils';
import { getUnitLabel } from '../utils/timeUtils';

interface UnitSwitcherProps {
  selectedUnit: TimeUnit;
  onUnitChange: (unit: TimeUnit) => void;
}

const UNITS: TimeUnit[] = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];

export function UnitSwitcher({ selectedUnit, onUnitChange }: UnitSwitcherProps) {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [buttonRefs] = useState<Map<TimeUnit, HTMLButtonElement>>(new Map());

  const handleClick = useCallback(
    (unit: TimeUnit) => {
      onUnitChange(unit);
    },
    [onUnitChange]
  );

  // 選択された単位の位置にインジケーターを移動（リサイズ時も再計算）
  useEffect(() => {
    const update = () => {
      const button = buttonRefs.get(selectedUnit);
      if (button) {
        setIndicatorStyle({
          left: button.offsetLeft,
          width: button.offsetWidth,
        });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    const button = buttonRefs.get(selectedUnit);
    if (button?.parentElement) observer.observe(button.parentElement);
    return () => observer.disconnect();
  }, [selectedUnit, buttonRefs]);

  return (
    <div className="relative flex flex-wrap justify-center gap-2 md:gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-3xl border-2 border-white/30">
        {/* 動くインジケーター背景 */}
        <div
          className="absolute top-3 h-[calc(100%-1.5rem)] bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-lg shadow-purple-500/50 transition-all duration-500 ease-out"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
        />

        {UNITS.map((unit) => {
          const isSelected = selectedUnit === unit;
          return (
            <button
              key={unit}
              ref={(el) => {
                if (el) buttonRefs.set(unit, el);
              }}
              onClick={() => handleClick(unit)}
              className={`
                relative z-10 px-6 py-3 rounded-3xl text-sm font-bold transition-all duration-300
                ${
                  isSelected
                    ? 'text-white scale-110'
                    : 'text-white/60 hover:text-white/90 hover:scale-105 active:scale-95'
                }
              `}
            >
              <span className="relative flex items-center gap-2">
                {getUnitLabel(unit)}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                )}
              </span>
            </button>
          );
        })}
    </div>
  );
}
