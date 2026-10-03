import { useState } from "react";
import { copy } from "../data/copy.en.ts";
import { assumptions, confirmations, evidence, futures, runoffScenario, stakeholders } from "../data/issue01.ts";
import { formatRange } from "../screening.ts";
import type { FutureId } from "../state.ts";

const t = copy.tearout;

const assumptionLines = () => [
  `Rain event ${assumptions.rainfallMm.min} mm (representative, not a design storm)`,
  `Sealed catchment ${assumptions.sealedAreaM2.min}–${assumptions.sealedAreaM2.max} m²`,
  `Runoff coefficient ${assumptions.runoffCoefficient.min.toFixed(2)}–${assumptions.runoffCoefficient.max.toFixed(2)}`,
  `Intervention ${assumptions.interventionAreaM2.min} m² · active depth ${assumptions.activeDepthM.min}–${assumptions.activeDepthM.max} m · voids ${assumptions.voidFraction.min}–${assumptions.voidFraction.max}`,
];

export function buildSummary(future: FutureId | null): string {
  const f = futures.find((x) => x.id === future);
  const ev = evidence.filter((i) => i.value && (i.status === "derived" || i.status === "official_record"));
  return [
    `${t.title.toUpperCase()} — Sponge City Fieldbook, Issue 01`,
    `${t.place}`,
    `${t.selected}: ${f ? f.title : "none selected"}`,
    "",
    `${t.assumptions}:`,
    ...assumptionLines().map((l) => `- ${l}`),
    "",
    `${t.evidence}:`,
    ...ev.map((i) => `- ${i.label}: ${i.value}`),
    ...(f ? f.scenarioEffects.map((e) => `- ${e.label} (${f.title}): ${formatRange(e)}`) : []),
    "",
    `${t.confirmations}:`,
    ...confirmations.map((c, i) => `${i + 1}. ${c}`),
    "",
    `${t.stakeholders}:`,
    ...stakeholders.map((s) => `- ${s}`),
    "",
    t.disclaimer,
    copy.disclaimer,
  ].join("\n");
}

export function CoordinationTearout({ future }: { future: FutureId | null }) {
  const [status, setStatus] = useState<string>("");
  const f = futures.find((x) => x.id === future);
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary(future));
      setStatus(t.copied);
    } catch {
      setStatus(t.copyFailed);
    }
  };
  return (
    <section className="fb-chapter" id="next" aria-labelledby="next-h">
      <p className="fb-kicker">07 — {t.kicker}</p>
      <article className="fb-tearout" aria-labelledby="next-h">
        <div className="fb-tearout-perf" aria-hidden="true" />
        <p className="fb-tearout-place">{t.place}</p>
        <h2 id="next-h" className="fb-display fb-display-s">
          {t.title}
        </h2>
        <p className="fb-tearout-disclaimer">{t.disclaimer}</p>
        <div className="fb-tearout-grid">
          <div>
            <h3>{t.selected}</h3>
            <p>{f ? `${f.title} — ${f.proposition}` : "No future selected yet. Choose one in chapter 03."}</p>
            <h3>{t.assumptions}</h3>
            <ul className="fb-list-dotted">
              {assumptionLines().map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <h3>{t.evidence}</h3>
            <ul className="fb-list-dashed">
              <li>
                {copy.evidence.runoffLabel}: <strong>{formatRange(runoffScenario)}</strong>
              </li>
              {f?.scenarioEffects.map((e) => (
                <li key={e.label}>
                  {e.label}: <strong>{formatRange(e)}</strong>
                </li>
              ))}
            </ul>
            <ul className="fb-list-solid">
              <li>Surface: asphalt roadway, concrete-slab pavement, one tree pit (demo record)</li>
            </ul>
          </div>
          <div>
            <h3>{t.confirmations}</h3>
            <ol className="fb-confirm">
              {confirmations.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            <h3>{t.stakeholders}</h3>
            <ul className="fb-list-plain">
              {stakeholders.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="fb-disclaimer">{copy.disclaimer}</p>
        <div className="fb-tearout-actions">
          <button type="button" className="fb-button fb-button-ink" onClick={() => window.print()}>
            {t.print}
          </button>
          <button type="button" className="fb-button" onClick={copySummary}>
            {t.copy}
          </button>
          <a className="fb-button" href="#weather">
            {t.back}
          </a>
          <span role="status" className="fb-note-small">
            {status}
          </span>
        </div>
      </article>
    </section>
  );
}
