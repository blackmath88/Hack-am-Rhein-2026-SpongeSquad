// The living section: one original street cut that changes with weather and
// with the selected future. Proposals are dashed; the ground below the surface
// build-up is deliberately hatched as unknown — no pipes are drawn.
import type { KeyboardEvent, ReactNode } from "react";
import { copy } from "../data/copy.en.ts";
import { existingShade, futures } from "../data/issue01.ts";
import { formatRange } from "../screening.ts";
import type { FutureId, NoteKey, Weather } from "../state.ts";
import { Gate } from "./SvgDefs.tsx";

const G = 440; // pavement level
const R = 452; // road level

type Props = {
  weather: Weather;
  future: FutureId | null;
  activeNote: NoteKey | null;
  onNote: (note: NoteKey) => void;
};

function Hit({ id, label, active, onNote, children }: { id: NoteKey; label: string; active: boolean; onNote: (n: NoteKey) => void; children: ReactNode }) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onNote(id);
    }
  };
  return (
    <g
      className={`fb-hit${active ? " is-active" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active}
      onClick={() => onNote(id)}
      onKeyDown={onKey}
    >
      {children}
    </g>
  );
}

function Building({ x, w, roof, side }: { x: number; w: number; roof: number; side: "left" | "right" }) {
  const wallX = side === "left" ? x + w - 12 : x;
  const floors = [];
  for (let y = roof + 64; y < G; y += 64) floors.push(y);
  return (
    <g className="fb-building">
      <rect x={x} y={roof} width={w} height={G - roof} fill="var(--paper-2)" />
      {floors.map((y) => (
        <line key={y} x1={x} x2={x + w} y1={y} y2={y} stroke="var(--rule)" strokeWidth="1" />
      ))}
      <rect x={wallX} y={roof} width="12" height={G - roof + 100} fill="var(--ink)" />
      {floors.map((y) => (
        <rect key={`w${y}`} x={wallX} y={y - 46} width="12" height="30" fill="var(--paper)" />
      ))}
      <rect x={x} y={roof - 8} width={w} height="10" fill="var(--ink)" />
      <rect x={side === "left" ? x + w - 8 : x} y={roof - 20} width="8" height="14" fill="var(--ink)" />
      <rect x={x} y={G + 92} width={w} height="8" fill="var(--ink)" />
      <text x={x + w / 2} y={G + 60} textAnchor="middle" className="fb-svg-label fb-svg-quiet">
        private basement
      </text>
    </g>
  );
}

function Tree({ x, base, crown, r, proposed }: { x: number; base: number; crown: number; r: number; proposed?: boolean }) {
  const stroke = proposed ? "var(--leaf)" : "var(--ink)";
  const dash = proposed ? "6 5" : undefined;
  return (
    <g className="fb-tree">
      <line x1={x} y1={base} x2={x} y2={crown + r * 0.4} stroke={stroke} strokeWidth="3" strokeDasharray={dash} />
      <circle cx={x} cy={crown} r={r} fill="var(--leaf-wash)" stroke={stroke} strokeWidth="1.6" strokeDasharray={dash} />
      <circle cx={x - r * 0.45} cy={crown + r * 0.25} r={r * 0.55} fill="var(--leaf-wash)" stroke={stroke} strokeWidth="1.2" strokeDasharray={dash} />
      <circle cx={x + r * 0.5} cy={crown + r * 0.15} r={r * 0.6} fill="var(--leaf-wash)" stroke={stroke} strokeWidth="1.2" strokeDasharray={dash} />
    </g>
  );
}

function Person({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g className="fb-person" transform={`translate(${x} ${y}) scale(${s})`} stroke="var(--ink-2)" strokeWidth="1.6" fill="none">
      <circle cx="0" cy="-52" r="6" fill="var(--paper)" />
      <path d="M0 -45 L0 -20 M0 -20 L-6 0 M0 -20 L6 0 M0 -38 L-8 -24 M0 -38 L8 -26" />
    </g>
  );
}

function Rain() {
  const drops = [];
  for (let i = 0; i < 70; i++) {
    const x = (i * 173) % 1200;
    const y = (i * 97) % 380;
    drops.push(<line key={i} x1={x} y1={y} x2={x - 6} y2={y + 18} style={{ animationDelay: `${(i % 10) * -0.11}s` }} />);
  }
  return (
    <g className="fb-rain" stroke="var(--rhine)" strokeWidth="1" opacity="0.55" aria-hidden="true">
      {drops}
    </g>
  );
}

function Planting({ future, weather }: { future: FutureId | null; weather: Weather }) {
  const raining = weather === "rain";
  if (future === "deep")
    return (
      <g>
        <rect x="330" y={G} width="90" height="140" fill="url(#fb-soil)" stroke="var(--clay)" strokeDasharray="6 5" strokeWidth="1.6" />
        {raining && <rect x="334" y={G + 56} width="82" height="80" fill="url(#fb-hatch-storage)" opacity="0.9" />}
        <path d="M375 448 q-20 30 -30 70 M375 448 q10 40 32 66 M375 448 l-2 90" stroke="var(--clay)" strokeWidth="1.3" fill="none" strokeDasharray="4 4" />
        <Tree x={375} base={G} crown={290} r={62} proposed />
        <rect x="330" y={G - 4} width="90" height="4" fill="var(--leaf)" />
        <Gate x={375} y={G + 148} label="excavation depth to confirm" />
      </g>
    );
  if (future === "shallow")
    return (
      <g>
        <path d={`M330 ${G} q45 26 90 0 v60 h-90 z`} fill="url(#fb-soil)" stroke="var(--clay)" strokeDasharray="6 5" strokeWidth="1.6" />
        {raining && <path d={`M336 ${G + 2} q39 22 78 0 z`} fill="url(#fb-hatch-storage)" />}
        <Tree x={358} base={G + 10} crown={330} r={42} proposed />
        <g stroke="var(--leaf)" strokeWidth="1.4" fill="none">
          <path d="M392 450 l-4 -18 M398 452 l2 -20 M404 450 l6 -16" />
        </g>
        <Gate x={375} y={G + 74} label="utility clearance" />
      </g>
    );
  if (future === "no_dig")
    return (
      <g>
        <rect x="336" y={G - 42} width="78" height="42" fill="url(#fb-soil)" stroke="var(--ink)" strokeWidth="1.6" strokeDasharray="6 5" />
        {raining && <rect x="340" y={G - 30} width="70" height="26" fill="url(#fb-hatch-storage)" />}
        <g stroke="var(--leaf)" strokeWidth="1.4" fill="none">
          <path d="M350 398 l-6 -24 M362 398 l2 -28 M376 398 l6 -22 M392 398 l-2 -26 M404 398 l6 -18" />
        </g>
        <g stroke="var(--ink-2)" strokeWidth="2" strokeDasharray="6 5">
          <line x1="262" y1={G} x2="262" y2="300" />
          <line x1="420" y1={G - 42} x2="420" y2="300" />
          <line x1="252" y1="300" x2="430" y2="300" />
        </g>
        <path d="M262 300 q30 -16 60 0 q30 -16 60 0 q20 -10 40 0" stroke="var(--leaf)" strokeWidth="1.6" fill="none" strokeDasharray="6 5" />
      </g>
    );
  return (
    <g>
      <rect x="330" y={G} width="90" height="12" fill="url(#fb-paving)" />
      <rect x="330" y={G - 2} width="90" height="16" fill="none" stroke="var(--amber)" strokeWidth="2.4" strokeDasharray="0.1 6" strokeLinecap="round" />
      <text x="375" y={G - 14} textAnchor="middle" className="fb-svg-label fb-svg-amber">
        candidate zone
      </text>
    </g>
  );
}

function Flows({ future }: { future: FutureId | null }) {
  const intoStrip = future === "deep" || future === "shallow";
  return (
    <g className="fb-flow" fill="none" stroke="var(--rhine)" strokeWidth="2.2" strokeDasharray="7 6" markerEnd="url(#fb-arrow)">
      <path d="M30 104 H232" />
      <path d={`M248 112 V${G - 6} H${intoStrip ? 334 : 412}`} />
      <path d={`M648 ${R - 6} H${intoStrip ? 426 : 438}`} />
      <path d={`M648 ${R - 6} H782`} />
      <path d="M1180 134 H970" />
      <path d={`M954 142 V${G - 6} H800`} />
      {intoStrip && <path d={`M412 ${R - 4} q-10 0 -18 8`} />}
      {future === "no_dig" && <path d="M248 300 H330 V396" />}
      <path d={`M436 ${R + 2} V${R + 30}`} />
      <path d={`M792 ${R + 2} V${R + 30}`} />
    </g>
  );
}

function Heat({ future }: { future: FutureId | null }) {
  const proposedShade = future ? futures.find((f) => f.id === future)!.scenarioEffects[1] : null;
  return (
    <g>
      <g aria-hidden="true">
        <circle cx="1120" cy="56" r="26" fill="var(--amber)" opacity="0.85" />
        <g stroke="var(--amber)" strokeWidth="2" opacity="0.7">
          <line x1="1080" y1="56" x2="1060" y2="56" />
          <line x1="1092" y1="28" x2="1078" y2="14" />
          <line x1="1092" y1="84" x2="1078" y2="98" />
        </g>
      </g>
      <rect x="240" y={G - 5} width="180" height="7" fill="var(--clay)" opacity="0.75" />
      <rect x="426" y={R - 5} width="330" height="7" fill="var(--clay)" opacity="0.45" />
      <g className="fb-shade">
        <polygon points={`960,150 960,${R} 757,${R}`} fill="var(--ink)" opacity="0.08" />
        <rect x="757" y={G - 6} width="203" height="10" fill="var(--ink)" opacity="0.3" />
        <rect x="770" y={G - 6} width="96" height="10" fill="var(--ink)" opacity="0.25" />
        {future && <rect x={future === "no_dig" ? 250 : 240} y={G - 6} width={future === "deep" ? 120 : 96} height="10" fill="var(--ink)" opacity="0.32" />}
      </g>
      <text x="246" y="476" className="fb-svg-label fb-svg-clay">
        direct-sun ground
      </text>
      <g className="fb-svg-callout" transform="translate(470 196)">
        <rect x="-10" y="-22" width="360" height={proposedShade ? 74 : 54} fill="var(--paper)" stroke="var(--rule)" />
        <text className="fb-svg-label fb-svg-strong">{copy.weather.heatLabel}</text>
        <text y="20" className="fb-svg-label">Shade, sun-side strip · existing {formatRange(existingShade)}</text>
        {proposedShade && <text y="40" className="fb-svg-label">with this future {formatRange(proposedShade)}</text>}
      </g>
    </g>
  );
}

export function LivingSection({ weather, future, activeNote, onNote }: Props) {
  const n = copy.notes;
  const title = `Street section, ${copy.weather.states[weather].label.toLowerCase()} state, ${future ? futures.find((f) => f.id === future)!.title : "existing condition"}`;
  return (
    <svg className={`fb-section is-${weather}`} viewBox="0 0 1200 660" role="group" aria-label={title}>
      <title>{title}</title>
      <rect width="1200" height="660" fill="var(--paper)" />
      {weather === "rain" && <rect width="1200" height={G} fill="var(--rhine)" opacity="0.05" />}
      {weather === "heat" && <rect width="1200" height={G} fill="var(--amber)" opacity="0.05" />}

      {weather === "rain" && <Rain />}

      {/* Ground: surface build-up, then the unknown */}
      <rect x="240" y={G + 12} width="720" height="28" fill="url(#fb-buildup)" />
      <rect x="240" y={G + 40} width="720" height="180" fill="url(#fb-hatch-unknown)" />
      <line x1="240" x2="960" y1={G + 40} y2={G + 40} stroke="var(--unknown)" strokeDasharray="2 4" />
      <text x="700" y={G + 120} textAnchor="middle" className="fb-svg-label fb-svg-unknown-title">
        {copy.weather.undergroundLabel}
      </text>
      <text x="700" y={G + 142} textAnchor="middle" className="fb-svg-label fb-svg-quiet">
        services · soil · groundwater · not drawn because not known
      </text>
      <text x="560" y={G + 34} className="fb-svg-label fb-svg-quiet">surface build-up (assumed)</text>

      <Building x={0} w={240} roof={120} side="left" />
      <Building x={960} w={240} roof={150} side="right" />
      {future === "no_dig" && <rect x="0" y="104" width="232" height="8" fill="var(--leaf)" stroke="var(--leaf)" strokeDasharray="6 4" />}
      {future === "no_dig" && weather === "rain" && <rect x="0" y="104" width="232" height="8" fill="url(#fb-hatch-storage)" />}

      {/* Downpipe candidates (image candidates, amber rings) */}
      <line x1="248" y1="112" x2="248" y2={G} stroke="var(--ink-2)" strokeWidth="3" />
      <line x1="954" y1="142" x2="954" y2={G} stroke="var(--ink-2)" strokeWidth="3" />
      <circle cx="248" cy={G - 16} r="9" fill="none" stroke="var(--amber)" strokeWidth="2.2" />
      <circle cx="954" cy={G - 16} r="9" fill="none" stroke="var(--amber)" strokeWidth="2.2" />

      {/* Surfaces: pavement, kerbs, road */}
      <rect x="240" y={G} width="90" height="12" fill="url(#fb-paving)" />
      <rect x="426" y={R} width="364" height="0.1" />
      <path d={`M420 ${G} V${R} H790 V${G}`} fill="none" stroke="var(--ink)" strokeWidth="2" />
      <rect x="426" y={R} width="364" height="10" fill="var(--asphalt)" />
      <rect x="796" y={G} width="164" height="12" fill="url(#fb-paving)" />
      <line x1="240" x2="420" y1={G} y2={G} stroke="var(--ink)" strokeWidth="2" />
      <line x1="796" x2="960" y1={G} y2={G} stroke="var(--ink)" strokeWidth="2" />
      <g stroke="var(--ink-3)" strokeWidth="2">
        <line x1="580" x2="600" y1={R + 1} y2={R + 1} />
        <line x1="690" x2="710" y1={R + 1} y2={R + 1} />
      </g>
      <text x="645" y={R - 14} textAnchor="middle" className="fb-svg-label fb-svg-quiet">tram · bicycle · delivery</text>
      <rect x="430" y={R - 3} width="12" height="5" fill="var(--ink)" />
      <rect x="786" y={R - 3} width="12" height="5" fill="var(--ink)" />
      <text x="446" y={R + 22} className="fb-svg-label fb-svg-quiet">gully</text>

      {/* Existing tree in a recorded pit */}
      <rect x="862" y={G} width="36" height="60" fill="url(#fb-soil)" stroke="var(--ink)" strokeWidth="1.4" />
      <Tree x={880} base={G} crown={318} r={50} />

      {/* Public life */}
      <g opacity={weather === "rain" ? 0.45 : 1}>
        <Person x={290} y={G} />
        <Person x={830} y={G} s={0.95} />
        <Person x={930} y={G} s={0.9} />
        <g stroke="var(--ink-2)" strokeWidth="1.6" fill="none" transform={`translate(468 ${R})`}>
          <path d="M-36 0 v-22 q4 -18 22 -20 h36 q14 2 20 20 v22" />
          <circle cx="-22" cy="-2" r="6" fill="var(--paper)" />
          <circle cx="24" cy="-2" r="6" fill="var(--paper)" />
        </g>
      </g>

      <Planting future={future} weather={weather} />

      {weather === "heat" && <Heat future={future} />}
      {weather === "rain" && (
        <g>
          <Flows future={future} />
          <Gate x={436} y={R + 40} />
          <Gate x={792} y={R + 40} />
          <text x="614" y={R + 72} textAnchor="middle" className="fb-svg-label fb-svg-gate">gully connections & sewer capacity to confirm</text>
          <g className="fb-svg-callout" transform="translate(470 196)">
            <rect x="-10" y="-22" width="300" height="54" fill="var(--paper)" stroke="var(--rule)" />
            <text className="fb-svg-label fb-svg-rhine">— — {copy.weather.rainFlowLabel}</text>
            <text y="20" className="fb-svg-label fb-svg-storage">▨ {copy.weather.rainStoreLabel}</text>
          </g>
        </g>
      )}

      <text x="1188" y="650" textAnchor="end" className="fb-svg-label fb-svg-quiet">
        Schematic section · not to scale · demonstration scenario
      </text>

      {/* Clickable regions (drawn last, transparent) */}
      <Hit id="underground" label={n.underground.title} active={activeNote === "underground"} onNote={onNote}>
        <rect x="430" y={G + 42} width="530" height="176" />
      </Hit>
      <Hit id="roof" label={n.roof.title} active={activeNote === "roof"} onNote={onNote}>
        <rect x="0" y="80" width="240" height="44" />
        <rect x="960" y="110" width="240" height="44" />
      </Hit>
      <Hit id="rain" label={n.rain.title} active={activeNote === "rain"} onNote={onNote}>
        <rect x="430" y={G - 26} width="360" height="40" />
      </Hit>
      <Hit id="root" label={n.root.title} active={activeNote === "root"} onNote={onNote}>
        <rect x="820" y="260" width="120" height="240" />
      </Hit>
      <Hit id="planting" label={n.planting.title} active={activeNote === "planting"} onNote={onNote}>
        <rect x="320" y="370" width="104" height="250" />
      </Hit>
    </svg>
  );
}
