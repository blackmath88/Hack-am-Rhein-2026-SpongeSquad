// Shared SVG patterns: the drawing, legend and detail plate use the same fills,
// so a hatch always means the same evidence status everywhere.
export function SvgDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <pattern id="fb-hatch-unknown" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="9" height="9" fill="var(--unknown-bg)" />
          <line x1="0" y1="0" x2="0" y2="9" stroke="var(--unknown)" strokeWidth="1" />
        </pattern>
        <pattern id="fb-hatch-storage" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="6" height="6" fill="var(--storage-bg)" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="var(--storage)" strokeWidth="1.6" />
        </pattern>
        <pattern id="fb-soil" width="14" height="12" patternUnits="userSpaceOnUse">
          <rect width="14" height="12" fill="var(--soil-bg)" />
          <circle cx="3" cy="3" r="1.1" fill="var(--clay)" />
          <circle cx="10" cy="8" r="0.9" fill="var(--clay)" />
        </pattern>
        <pattern id="fb-paving" width="18" height="10" patternUnits="userSpaceOnUse">
          <rect width="18" height="10" fill="var(--paving)" />
          <line x1="0" y1="0" x2="0" y2="10" stroke="var(--rule)" strokeWidth="1" />
        </pattern>
        <pattern id="fb-buildup" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="var(--paper-2)" />
          <circle cx="5" cy="5" r="0.8" fill="var(--ink-3)" />
        </pattern>
        <marker id="fb-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill="var(--rhine)" />
        </marker>
      </defs>
    </svg>
  );
}

/** Small legend swatch, drawn with the same language as the section. */
export function Mark({ kind }: { kind: string }) {
  const common = { width: 34, height: 16, viewBox: "0 0 34 16", "aria-hidden": true as const };
  switch (kind) {
    case "solid":
      return <svg {...common}><line x1="2" y1="8" x2="32" y2="8" stroke="var(--ink)" strokeWidth="2" /></svg>;
    case "dashed":
      return <svg {...common}><line x1="2" y1="8" x2="32" y2="8" stroke="var(--rhine)" strokeWidth="2" strokeDasharray="5 4" /></svg>;
    case "dotted":
      return <svg {...common}><line x1="2" y1="8" x2="32" y2="8" stroke="var(--amber)" strokeWidth="2.4" strokeDasharray="0.1 5" strokeLinecap="round" /></svg>;
    case "ring":
      return <svg {...common}><circle cx="17" cy="8" r="5.5" fill="none" stroke="var(--amber)" strokeWidth="2" /><circle cx="17" cy="8" r="1.6" fill="var(--amber)" /></svg>;
    case "storage":
      return <svg {...common}><rect x="2" y="2" width="30" height="12" fill="url(#fb-hatch-storage)" stroke="var(--storage)" /></svg>;
    case "hatch":
      return <svg {...common}><rect x="2" y="2" width="30" height="12" fill="url(#fb-hatch-unknown)" /></svg>;
    case "gate":
      return <GateSwatch />;
    default:
      return null;
  }
}

function GateSwatch() {
  return (
    <svg width="34" height="16" viewBox="0 0 34 16" aria-hidden="true">
      <Gate x={17} y={8} />
    </svg>
  );
}

/** Muted red gate: operator / authority confirmation required. */
export function Gate({ x, y, label }: { x: number; y: number; label?: string }) {
  return (
    <g className="fb-gate" transform={`translate(${x} ${y})`}>
      <rect x="-7" y="-7" width="14" height="14" fill="var(--paper)" stroke="var(--gate)" strokeWidth="2" />
      <line x1="-7" y1="0" x2="7" y2="0" stroke="var(--gate)" strokeWidth="2" />
      {label && (
        <text x="12" y="4" className="fb-svg-label fb-svg-gate">
          {label}
        </text>
      )}
    </g>
  );
}
