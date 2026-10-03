import { copy } from "../data/copy.en.ts";

const c = copy.cover;

export function Cover() {
  return (
    <header className="fb-cover" id="cover">
      <div className="fb-cover-top">
        <span className="fb-masthead">{c.masthead}</span>
        <span className="fb-issue">{c.issue} · Basel · 2026</span>
      </div>
      <h1 className="fb-cover-title">{c.title}</h1>
      <svg className="fb-cover-drawing" viewBox="0 0 1000 260" aria-hidden="true">
        <g stroke="var(--ink)" strokeWidth="1.4" fill="none">
          <path d="M0 230 H1000" />
          <path d="M40 230 V70 H200 V230 M800 230 V96 H960 V230" />
          <path d="M200 230 h70 v6 h460 v-6 h70" />
        </g>
        <g stroke="var(--rhine)" strokeWidth="1" opacity="0.6">
          {Array.from({ length: 46 }, (_, i) => (
            <line key={i} x1={(i * 61) % 1000} y1={(i * 37) % 150} x2={(i * 61) % 1000 - 5} y2={((i * 37) % 150) + 16} />
          ))}
        </g>
        <path d="M60 64 H196 M204 72 V226 H300" stroke="var(--rhine)" strokeWidth="2.2" strokeDasharray="7 6" fill="none" />
        <path d="M300 230 q40 26 90 0" fill="url(#fb-hatch-storage)" stroke="var(--storage)" />
        <circle cx="345" cy="140" r="44" fill="var(--leaf-wash)" stroke="var(--leaf)" strokeDasharray="6 5" />
        <line x1="345" y1="184" x2="345" y2="230" stroke="var(--leaf)" strokeWidth="2.4" />
        <rect x="200" y="240" width="600" height="20" fill="url(#fb-hatch-unknown)" />
      </svg>
      <p className="fb-cover-line">“{c.line}”</p>
      <div className="fb-cover-foot">
        <a className="fb-button fb-button-ink" href="#site">
          {c.open}
        </a>
        <ul className="fb-principle" aria-label="Product principle">
          {c.principle.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      <p className="fb-disclaimer">{copy.disclaimer}</p>
    </header>
  );
}
