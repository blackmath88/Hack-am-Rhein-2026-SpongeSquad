import { copy } from "../data/copy.en.ts";
import { futures } from "../data/issue01.ts";
import { precedentById } from "../data/precedents.ts";
import { formatRange } from "../screening.ts";
import type { FutureId } from "../state.ts";

/** Thumbnail of the planted strip for one future, in the section's language. */
function StripGlyph({ id }: { id: FutureId }) {
  return (
    <svg viewBox="0 0 220 150" className="fb-glyph" aria-hidden="true">
      <rect x="0" y="80" width="220" height="70" fill="url(#fb-hatch-unknown)" />
      <line x1="0" x2="220" y1="70" y2="70" stroke="var(--ink)" strokeWidth="2" />
      {id === "deep" && (
        <>
          <rect x="70" y="70" width="80" height="72" fill="url(#fb-soil)" stroke="var(--clay)" strokeDasharray="5 4" />
          <rect x="74" y="98" width="72" height="40" fill="url(#fb-hatch-storage)" />
          <line x1="110" y1="70" x2="110" y2="34" stroke="var(--leaf)" strokeWidth="3" strokeDasharray="5 4" />
          <circle cx="110" cy="28" r="26" fill="var(--leaf-wash)" stroke="var(--leaf)" strokeDasharray="5 4" />
        </>
      )}
      {id === "shallow" && (
        <>
          <path d="M70 70 q40 22 80 0 v26 h-80 z" fill="url(#fb-soil)" stroke="var(--clay)" strokeDasharray="5 4" />
          <path d="M76 71 q34 16 68 0 z" fill="url(#fb-hatch-storage)" />
          <line x1="96" y1="76" x2="96" y2="46" stroke="var(--leaf)" strokeWidth="3" strokeDasharray="5 4" />
          <circle cx="96" cy="38" r="17" fill="var(--leaf-wash)" stroke="var(--leaf)" strokeDasharray="5 4" />
        </>
      )}
      {id === "no_dig" && (
        <>
          <rect x="80" y="48" width="60" height="22" fill="url(#fb-soil)" stroke="var(--ink)" strokeDasharray="5 4" />
          <path d="M30 70 V22 M190 70 V22 M24 22 H196" stroke="var(--ink-2)" strokeWidth="2" strokeDasharray="5 4" />
          <path d="M30 22 q25 -12 50 0 q25 -12 50 0 q25 -12 50 0" stroke="var(--leaf)" strokeWidth="1.6" fill="none" />
        </>
      )}
    </svg>
  );
}

export function FuturesSpread({ future, onDraw }: { future: FutureId | null; onDraw: (f: FutureId) => void }) {
  const f = copy.futures;
  return (
    <section className="fb-chapter" id="futures" aria-labelledby="futures-h">
      <p className="fb-kicker">03 — {f.kicker}</p>
      <h2 id="futures-h" className="fb-display fb-display-s">
        {f.title}
      </h2>
      <p className="fb-lede">{f.lede}</p>
      <div className="fb-futures">
        {futures.map((d) => (
          <article key={d.id} className={`fb-future${future === d.id ? " is-shown" : ""}`} aria-labelledby={`fut-${d.id}`}>
            <StripGlyph id={d.id} />
            <h3 id={`fut-${d.id}`}>{d.title}</h3>
            <p className="fb-proposition">{d.proposition}</p>
            <ul className="fb-chips" aria-label="Design moves">
              {d.moves.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <h4>{f.effectsTitle}</h4>
            <dl className="fb-effects">
              {d.scenarioEffects.map((e) => (
                <div key={e.label}>
                  <dt>{e.label}</dt>
                  <dd>
                    <strong>{formatRange(e)}</strong>
                    <details>
                      <summary>Basis and limits</summary>
                      <p>{e.basis}</p>
                      <p className="fb-limit">{e.limitation}</p>
                    </details>
                  </dd>
                </div>
              ))}
            </dl>
            <h4>{f.verifyTitle}</h4>
            <ul className="fb-list-unknown">
              {d.mustVerify.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <h4>{f.precedentTitle}</h4>
            <p className="fb-relatives">
              {d.precedentIds.map((id, i) => (
                <span key={id}>
                  {i > 0 && " · "}
                  <a href={`#ref-${id}`}>{precedentById(id)?.title}</a>
                </span>
              ))}
            </p>
            <button type="button" className="fb-button" aria-pressed={future === d.id} onClick={() => onDraw(d.id)}>
              {future === d.id ? f.shown : f.show}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
