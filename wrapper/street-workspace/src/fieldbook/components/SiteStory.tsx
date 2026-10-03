import { useState } from "react";
import { copy } from "../data/copy.en.ts";

const s = copy.site;

export function SiteStory() {
  const [lifted, setLifted] = useState(false);
  return (
    <section className="fb-chapter fb-site" id="site" aria-labelledby="site-h">
      <p className="fb-kicker">01 — {s.kicker}</p>
      <h2 id="site-h" className="fb-display">
        {s.story[0]}
        <br />
        <em>{s.story[1]}</em>
      </h2>
      <div className="fb-site-grid">
        <p className="fb-lede">{s.lede}</p>
        <div className={`fb-tracing${lifted ? " is-lifted" : ""}`}>
          <button type="button" className="fb-button" aria-expanded={lifted} aria-controls="fb-lift" onClick={() => setLifted(!lifted)}>
            {lifted ? "Lay the surface back" : s.lifted.title}
          </button>
          <div className="fb-lift-sheet">
            <div>
              <h3>{s.lifted.above}</h3>
              <ul className="fb-list-solid">
                {s.lifted.aboveItems.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
            <div id="fb-lift" className="fb-lift-under" hidden={!lifted}>
              <h3>{s.lifted.below}</h3>
              <ul className="fb-list-unknown">
                {s.lifted.belowItems.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <p className="fb-note-small">{s.lifted.note}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="fb-disclaimer">{copy.disclaimer}</p>
    </section>
  );
}
