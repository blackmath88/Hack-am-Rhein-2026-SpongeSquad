import { useRef } from "react";
import { copy } from "../data/copy.en.ts";
import { Gate } from "./SvgDefs.tsx";

function Label({ x, y, tx, ty, text, anchor = "start" }: { x: number; y: number; tx: number; ty: number; text: string; anchor?: "start" | "end" }) {
  return (
    <g>
      <line x1={x} y1={y} x2={tx} y2={ty} stroke="var(--ink-2)" strokeWidth="0.8" />
      <circle cx={x} cy={y} r="2.2" fill="var(--ink)" />
      <text x={tx + (anchor === "start" ? 6 : -6)} y={ty + 4} textAnchor={anchor} className="fb-svg-label">
        {text}
      </text>
    </g>
  );
}

function Detail({ titleId }: { titleId: string }) {
  return (
    <svg className="fb-detail" viewBox="0 0 960 560" role="img" aria-labelledby={titleId}>
      <title id={titleId}>
        Illustrative threshold section: pavement, planted edge, shallow basin over filter and root zones, kerb with opening and overflow notch, road surface.
      </title>
      <rect width="960" height="560" fill="var(--paper)" />
      {/* unknown ground */}
      <rect x="0" y="430" width="960" height="130" fill="url(#fb-hatch-unknown)" />
      <rect x="0" y="260" width="250" height="170" fill="url(#fb-hatch-unknown)" />
      <rect x="640" y="270" width="320" height="160" fill="url(#fb-hatch-unknown)" />
      {/* pavement */}
      <rect x="0" y="180" width="250" height="16" fill="url(#fb-paving)" stroke="var(--ink)" />
      <rect x="0" y="196" width="250" height="14" fill="var(--paper-2)" stroke="var(--ink-3)" />
      <rect x="0" y="210" width="250" height="50" fill="url(#fb-buildup)" stroke="var(--ink-3)" />
      {/* planted edge */}
      <rect x="250" y="176" width="8" height="90" fill="var(--ink)" />
      {/* root zone, filter, basin */}
      <rect x="258" y="290" width="342" height="140" fill="url(#fb-soil)" stroke="var(--clay)" strokeDasharray="6 5" />
      <path d="M258 196 Q430 262 600 196 L600 290 L258 290 Z" fill="var(--soil-bg)" stroke="var(--clay)" strokeDasharray="6 5" />
      <rect x="258" y="250" width="342" height="40" fill="url(#fb-buildup)" opacity="0.9" />
      <path d="M272 202 Q430 252 586 202 Z" fill="url(#fb-hatch-storage)" />
      <g stroke="var(--leaf)" strokeWidth="1.4" fill="none">
        <path d="M300 210 l-6 -30 M308 212 l4 -34 M318 214 l10 -26 M520 214 l-8 -30 M530 212 l2 -36 M540 208 l10 -28" />
        <path d="M430 236 V120" strokeWidth="4" strokeDasharray="7 5" />
        <path d="M430 300 q-30 40 -70 70 M430 300 q20 50 60 80 M430 300 v100" strokeWidth="1.2" strokeDasharray="4 4" />
      </g>
      {/* kerb with opening */}
      <path d="M600 176 H640 V270 H620 V200 H600 Z" fill="var(--ink-2)" />
      <rect x="600" y="186" width="40" height="10" fill="var(--paper)" stroke="var(--rhine)" strokeDasharray="4 3" />
      {/* road */}
      <rect x="640" y="200" width="320" height="22" fill="var(--asphalt)" stroke="var(--ink)" />
      <rect x="640" y="222" width="320" height="48" fill="url(#fb-buildup)" stroke="var(--ink-3)" />
      {/* water */}
      <g stroke="var(--rhine)" strokeWidth="2.2" strokeDasharray="7 6" fill="none" markerEnd="url(#fb-arrow)">
        <path d="M900 194 H660 Q630 192 600 196 L560 206" />
        <path d="M266 200 Q240 172 190 172" />
      </g>
      <rect x="252" y="188" width="10" height="8" fill="var(--paper)" stroke="var(--rhine)" />
      <Gate x={160} y={150} label="overflow route to confirm" />
      {/* 150 mm dimension */}
      <g stroke="var(--gate)" strokeWidth="1">
        <line x1="680" y1="176" x2="680" y2="200" />
        <line x1="672" y1="176" x2="688" y2="176" />
        <line x1="672" y1="200" x2="688" y2="200" />
      </g>
      <text x="694" y="192" className="fb-svg-label fb-svg-strong">≈ 150 mm</text>
      {/* labels */}
      <Label x={120} y={186} tx={60} ty={90} text="Pavement" />
      <Label x={254} y={240} tx={170} ty={320} text="Planted edge" anchor="end" />
      <Label x={430} y={226} tx={380} ty={60} text="Shallow basin" />
      <Label x={256} y={192} tx={300} ty={100} text="Overflow notch" />
      <Label x={620} y={190} tx={700} ty={110} text="Kerb opening" />
      <Label x={520} y={270} tx={720} ty={320} text="Filter zone" />
      <Label x={480} y={380} tx={720} ty={370} text="Root zone" />
      <Label x={820} y={210} tx={820} ty={150} text="Street surface" />
      <text x="480" y="500" textAnchor="middle" className="fb-svg-label fb-svg-unknown-title">Below: not known from this evidence</text>
      <text x="948" y="548" textAnchor="end" className="fb-svg-label fb-svg-quiet">Illustrative · not to scale</text>
    </svg>
  );
}

export function ThresholdPlate() {
  const t = copy.threshold;
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <section className="fb-chapter" id="threshold" aria-labelledby="threshold-h">
      <p className="fb-kicker">05 — {t.kicker}</p>
      <h2 id="threshold-h" className="fb-display fb-display-s">
        {t.title}
      </h2>
      <p className="fb-lede">{t.lede}</p>
      <div className="fb-threshold">
        <div className="fb-section-scroll">
          <Detail titleId="fb-detail-title" />
        </div>
        <div className="fb-threshold-side">
          <button type="button" className="fb-button" onClick={() => dialog.current?.showModal()}>
            ⌕ {t.zoomIn}
          </button>
          <p className="fb-disclaimer">{t.disclaimer}</p>
        </div>
      </div>
      <dialog ref={dialog} className="fb-zoom" aria-label={t.title}>
        <div className="fb-zoom-inner">
          <Detail titleId="fb-detail-title-zoom" />
        </div>
        <form method="dialog">
          <button className="fb-button fb-button-ink" autoFocus>
            {t.zoomOut}
          </button>
        </form>
      </dialog>
    </section>
  );
}
