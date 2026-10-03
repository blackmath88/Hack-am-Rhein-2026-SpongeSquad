import { copy } from "../data/copy.en.ts";
import { futures } from "../data/issue01.ts";
import type { FutureId, NoteKey, Weather } from "../state.ts";
import { Legend } from "./Legend.tsx";
import { LivingSection } from "./LivingSection.tsx";
import { MarginNote } from "./MarginNote.tsx";
import { WeatherScrubber } from "./WeatherScrubber.tsx";

type Props = {
  weather: Weather;
  onWeather: (w: Weather) => void;
  future: FutureId | null;
  onFuture: (f: FutureId | null) => void;
  note: NoteKey | null;
  onNote: (n: NoteKey | null) => void;
};

export function SectionPlate({ weather, onWeather, future, onFuture, note, onNote }: Props) {
  const w = copy.weather;
  return (
    <section className="fb-chapter fb-plate" id="weather" aria-labelledby="weather-h">
      <div className="fb-plate-head">
        <div>
          <p className="fb-kicker">02 — {w.kicker}</p>
          <h2 id="weather-h" className="fb-display fb-display-s">
            {w.title}
          </h2>
        </div>
        <div className="fb-plate-controls">
          <WeatherScrubber value={weather} onChange={onWeather} />
          <label className="fb-select">
            <span>{w.futureLabel}</span>
            <select value={future ?? ""} onChange={(e) => onFuture((e.target.value || null) as FutureId | null)}>
              <option value="">{w.noneFuture}</option>
              {futures.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <p className="fb-plate-caption" aria-live="polite">
        {w.states[weather].caption}
      </p>
      <div className="fb-plate-body">
        <div className="fb-section-scroll" tabIndex={-1}>
          <LivingSection weather={weather} future={future} activeNote={note} onNote={(n) => onNote(n === note ? null : n)} />
        </div>
        <p className="fb-scroll-hint" aria-hidden="true">← Drag sideways to see the whole section →</p>
        <MarginNote note={note} future={future} onFuture={onFuture} onClose={() => onNote(null)} />
      </div>
      <Legend />
      <p className="fb-disclaimer">{copy.disclaimer}</p>
    </section>
  );
}
