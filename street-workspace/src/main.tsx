import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createDemoStreet } from "./scenario.ts";
import { applyPlan } from "./interventions.ts";
import { simulate } from "./simulation.ts";
import { WorldView } from "./WorldView.tsx";
import type { InterventionPlan } from "./types.ts";
import "./style.css";

const baseline = createDemoStreet();
const emptyPlan: InterventionPlan = { rainGarden: false, connected: false };
function App() {
  const [plan, setPlan] = useState(emptyPlan);
  const [depthMm, setDepth] = useState(30);
  const [selected, select] = useState("zone-2");
  const [frame, setFrame] = useState(0);
  const [running, setRunning] = useState(false);
  const [compare, setCompare] = useState(false);
  const world = useMemo(() => applyPlan(baseline, plan), [plan]);
  const frames = useMemo(
    () => simulate(world, { depthMm, durationMinutes: 30 }),
    [world, depthMm],
  );
  const baseFrames = useMemo(
    () => simulate(baseline, { depthMm, durationMinutes: 30 }),
    [depthMm],
  );
  const snapshot = (compare ? baseFrames : frames)[frame];
  const activeWorld = compare ? baseline : world;
  const zone = activeWorld.zones.find((z) => z.id === selected)!;
  const surface = activeWorld.surfaces.find((s) => s.zoneId === selected)!;
  const end = frames.at(-1)!;
  const baseEnd = baseFrames.at(-1)!;
  const changePlan = (next: InterventionPlan) => {
    setPlan(next);
    setFrame(0);
    setRunning(false);
    setCompare(false);
  };
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () =>
        setFrame((f) => {
          if (f >= 30) return f;
          return f + 1;
        }),
      300,
    );
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (frame === 30) setRunning(false);
  }, [frame]);
  const run = () => {
    setFrame(0);
    setRunning(true);
  };
  return (
    <main>
      <header>
        <a className="brand" href="#">
          SPONGE SQUAD <span>/ STREET LAB</span>
        </a>
        <span className="tag">Illustrative scenario · v0.1</span>
      </header>
      <section className="intro">
        <div>
          <p className="eyebrow">01 / UNDERSTAND THE CONNECTION</p>
          <h1>A street, connected.</h1>
          <p>
            Give rain somewhere to go. Add a garden, open the kerb, then follow
            the water.
          </p>
        </div>
        <div className="place">
          BASEL-INSPIRED
          <br />
          <strong>Synthetic demo street</strong>
          <br />
          No surveyed site selected
        </div>
      </section>
      <div className="layout">
        <section className="workspace" aria-label="Street workspace">
          <div className="viewbar">
            <span>
              {compare
                ? "BASELINE / SEALED STREET"
                : "YOUR STREET / " +
                  (plan.rainGarden
                    ? plan.connected
                      ? "CONNECTED GARDEN"
                      : "ISOLATED GARDEN"
                    : "SEALED")}
            </span>
            <button
              aria-pressed={compare}
              onClick={() => setCompare((v) => !v)}
            >
              {compare ? "Show your street" : "Compare baseline"}
            </button>
          </div>
          <WorldView
            world={activeWorld}
            snapshot={snapshot}
            previous={(compare ? baseFrames : frames)[Math.max(0, frame - 1)]}
            selected={selected}
            running={running}
            onSelect={select}
          />
          <div className="legend">
            <span>
              <i className="blue" />
              Drainage
            </span>
            <span>
              <i className="green" />
              Infiltration
            </span>
            <span>
              <i className="amber" />
              Overflow
            </span>
            <span>Click a zone to inspect</span>
          </div>
          <div className="storm">
            <button className="primary" onClick={run}>
              {running
                ? "Restart rain"
                : frame === 30
                  ? "Replay rain"
                  : "Run rain"}
            </button>
            <button disabled={!running} onClick={() => setRunning(false)}>
              Pause
            </button>
            <label>
              Rain in 30 minutes
              <select
                value={depthMm}
                onChange={(e) => {
                  setDepth(Number(e.target.value));
                  setFrame(0);
                  setRunning(false);
                }}
              >
                <option value="10">10 mm</option>
                <option value="30">30 mm</option>
                <option value="60">60 mm</option>
              </select>
            </label>
            <span className="clock">{snapshot.elapsedMinutes} / 30 min</span>
          </div>
          <label className="timeline">
            Storm progress
            <input
              aria-label="Storm progress"
              type="range"
              min="0"
              max="30"
              value={frame}
              onChange={(e) => {
                setRunning(false);
                setFrame(Number(e.target.value));
              }}
            />
          </label>
          <div className="metrics" aria-label="Current water balance">
            {[
              ["Rain received", snapshot.rainM3],
              ["Held in garden", snapshot.storedM3],
              ["Into soil", snapshot.infiltratedM3],
              ["Into sewer", snapshot.sewerM3],
            ].map(([name, value]) => (
              <div key={name}>
                <span>{name}</span>
                <strong>
                  {Number(value).toFixed(1)} <small>m³</small>
                </strong>
              </div>
            ))}
          </div>
          <p className="balance">
            Rain = stored + infiltrated + sewer · Results at minute {frame}.
            Simulation time is accelerated.
          </p>
        </section>
        <aside>
          <p className="eyebrow">02 / CHANGE ONE SYSTEM</p>
          <h2>From parking to sponge.</h2>
          <button
            className={"intervention " + (plan.rainGarden ? "active" : "")}
            aria-pressed={plan.rainGarden}
            onClick={() =>
              changePlan({ rainGarden: !plan.rainGarden, connected: false })
            }
          >
            <span className="step">1</span>
            <span>
              <strong>
                {plan.rainGarden ? "Rain garden added" : "Add a rain garden"}
              </strong>
              <small>
                Replace the north parking strip.
                <br />
                12 m³ storage · 3 spaces removed
              </small>
            </span>
            <b>{plan.rainGarden ? "✓" : "+"}</b>
          </button>
          <button
            className={"intervention " + (plan.connected ? "active" : "")}
            disabled={!plan.rainGarden}
            aria-pressed={plan.connected}
            onClick={() => changePlan({ ...plan, connected: !plan.connected })}
          >
            <span className="step">2</span>
            <span>
              <strong>Connect street runoff</strong>
              <small>
                Open the kerb to feed the garden.
                <br />
                Overflow still reaches the drain.
              </small>
            </span>
            <b>{plan.connected ? "✓" : "+"}</b>
          </button>
          <p className="explanation">
            {!plan.rainGarden
              ? "The sealed surfaces send all rainfall to the sewer. Start with one garden."
              : !plan.connected
                ? "The garden catches rain falling on itself. Runoff from the rest of the street still bypasses it."
                : "Roof and street runoff now feed the garden. Water infiltrates into soil; once storage is full, the excess flows to the sewer."}
          </p>
          <div className="forecast">
            <span>At the end of this storm</span>
            <strong>{(baseEnd.sewerM3 - end.sewerM3).toFixed(1)} m³</strong>
            <p>less water reaches the sewer than in the baseline</p>
            <table>
              <thead>
                <tr>
                  <th>Water path</th>
                  <th>Before</th>
                  <th>After</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["Stored", "storedM3"],
                  ["Infiltrated", "infiltratedM3"],
                  ["Sewer", "sewerM3"],
                ] as const).map(([label, key]) => (
                  <tr key={key}>
                    <th>{label}</th>
                    <td>{baseEnd[key].toFixed(1)}</td>
                    <td>{end[key].toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <small>Volumes in m³ · illustrative parameters</small>
          </div>
          <button
            className="reset"
            onClick={() => {
              changePlan(emptyPlan);
              setDepth(30);
              select("zone-2");
            }}
          >
            Reset street & rain
          </button>
        </aside>
      </div>
      <section className="details">
        <div>
          <p className="eyebrow">03 / LOOK UNDER THE SURFACE</p>
          <h2>Every part has an identity.</h2>
          <div className="zones" aria-label="Inspect zone">
            {activeWorld.zones.map((z) => (
              <button
                key={z.id}
                aria-pressed={z.id === selected}
                onClick={() => select(z.id)}
              >
                {z.label}
              </button>
            ))}
          </div>
          <dl>
            <dt>Zone</dt>
            <dd>
              {zone.id} · {zone.kind}
            </dd>
            <dt>Surface</dt>
            <dd>{surface.material}</dd>
            <dt>Area</dt>
            <dd>{zone.rect.width * zone.rect.height} m²</dd>
            <dt>Parking spaces</dt>
            <dd>{zone.parkingSpaces}</dd>
            <dt>Ownership</dt>
            <dd>Unknown — needs site evidence</dd>
          </dl>
        </div>
        <div>
          <h3>Model boundaries</h3>
          <p>
            This is an explanation of connected water systems, not a hydraulic
            model or a site recommendation.
          </p>
          <ul>
            {baseline.evidence.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <details>
            <summary>Inspect world data & water connections</summary>
            <pre>
              {JSON.stringify({ plan, world: activeWorld, snapshot }, null, 2)}
            </pre>
          </details>
        </div>
      </section>
      <footer>
        SpongeSquad / Hack am Rhein 2026{" "}
        <span>Site scoping → Street model → Interventions → Water paths</span>
      </footer>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
