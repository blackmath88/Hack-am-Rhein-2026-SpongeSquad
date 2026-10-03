import type { KeyboardEvent } from "react";
import { copy } from "../data/copy.en.ts";
import { WEATHERS, type Weather } from "../state.ts";

/** Dry → Hot → Rain as a radio group; arrow keys move along the scrubber. */
export function WeatherScrubber({ value, onChange }: { value: Weather; onChange: (w: Weather) => void }) {
  const onKey = (e: KeyboardEvent) => {
    const i = WEATHERS.indexOf(value);
    const next = e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const w = WEATHERS[(next + WEATHERS.length) % WEATHERS.length];
    onChange(w);
    (e.currentTarget.querySelector(`[data-w="${w}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div className="fb-scrubber" role="radiogroup" aria-label="Weather" onKeyDown={onKey}>
      {WEATHERS.map((w) => (
        <button
          key={w}
          type="button"
          role="radio"
          data-w={w}
          aria-checked={value === w}
          tabIndex={value === w ? 0 : -1}
          className={value === w ? "is-on" : undefined}
          onClick={() => onChange(w)}
        >
          {copy.weather.states[w].label}
        </button>
      ))}
    </div>
  );
}
