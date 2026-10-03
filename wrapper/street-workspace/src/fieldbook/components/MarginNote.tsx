import { copy } from "../data/copy.en.ts";
import { futures } from "../data/issue01.ts";
import type { FutureId, NoteKey } from "../state.ts";

type Props = { note: NoteKey | null; future: FutureId | null; onFuture: (f: FutureId | null) => void; onClose: () => void };

export function MarginNote({ note, future, onFuture, onClose }: Props) {
  if (!note)
    return (
      <aside className="fb-margin is-empty" aria-live="polite">
        <p>{copy.weather.hint}</p>
        <ul>
          <li>Roof → roof strategy</li>
          <li>Tree → roots and shade</li>
          <li>Kerb and road → the rain's journey</li>
          <li>Grey ground → the underground negotiation</li>
          <li>Planted strip → choose a future</li>
        </ul>
      </aside>
    );
  const n = copy.notes[note];
  return (
    <aside className="fb-margin" aria-live="polite" aria-labelledby="fb-note-h">
      <p className="fb-kicker">{n.move}</p>
      <h3 id="fb-note-h">{n.title}</h3>
      <p>{n.body}</p>
      {note === "planting" && (
        <div className="fb-future-pick" role="group" aria-label={copy.weather.futureLabel}>
          <button type="button" aria-pressed={future === null} onClick={() => onFuture(null)}>
            {copy.weather.noneFuture}
          </button>
          {futures.map((f) => (
            <button key={f.id} type="button" aria-pressed={future === f.id} onClick={() => onFuture(f.id)}>
              {f.title}
            </button>
          ))}
        </div>
      )}
      {n.verify.length > 0 && (
        <>
          <h4>Must verify</h4>
          <ul className="fb-list-unknown">
            {n.verify.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </>
      )}
      <button type="button" className="fb-link" onClick={onClose}>
        Close note
      </button>
    </aside>
  );
}
