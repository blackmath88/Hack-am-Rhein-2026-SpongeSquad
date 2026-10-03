import { useEffect, useRef } from "react";
import { copy } from "../data/copy.en.ts";
import { evidence } from "../data/issue01.ts";
import { byGroup, GROUP_ORDER, STATUS_META, type EvidenceItem } from "../evidence.ts";
import { Mark } from "./SvgDefs.tsx";

const e = copy.evidence;

function Item({ item }: { item: EvidenceItem }) {
  const meta = STATUS_META[item.status];
  return (
    <li className={`fb-ev fb-ev-${meta.group}`}>
      <div className="fb-ev-head">
        <Mark kind={meta.mark} />
        <span className="fb-ev-status">
          {meta.label}
          {item.confidence && ` · ${item.confidence} confidence`}
        </span>
      </div>
      <h4>{item.label}</h4>
      {item.value ? <p className="fb-ev-value">{item.value}</p> : <p className="fb-ev-value fb-ev-blank">Not established</p>}
      <dl>
        {item.source && (
          <div>
            <dt>{e.sourceLabel}</dt>
            <dd>{item.source}</dd>
          </div>
        )}
        {item.method && (
          <div>
            <dt>{e.methodLabel}</dt>
            <dd>{item.method}</dd>
          </div>
        )}
        {item.observedAt && (
          <div>
            <dt>{e.dateLabel}</dt>
            <dd>{item.observedAt}</dd>
          </div>
        )}
        {item.canEstablish.length > 0 && (
          <div>
            <dt>{e.canLabel}</dt>
            <dd>{item.canEstablish.join("; ")}</dd>
          </div>
        )}
        {item.cannotEstablish.length > 0 && (
          <div className="fb-ev-cannot">
            <dt>{e.cannotLabel}</dt>
            <dd>{item.cannotEstablish.join("; ")}</dd>
          </div>
        )}
        {item.nextAction && (
          <div className="fb-ev-next">
            <dt>{e.nextLabel}</dt>
            <dd>{item.nextAction}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}

export function EvidenceContent() {
  const groups = byGroup(evidence);
  return (
    <>
      <ul className="fb-status-legend" aria-label="Status legend">
        {Object.entries(STATUS_META)
          .filter(([status]) => evidence.some((i) => i.status === status))
          .map(([status, m]) => (
            <li key={status}>
              <Mark kind={m.mark} />
              <span>
                <strong>{m.label}.</strong> {m.meaning}
              </span>
            </li>
          ))}
      </ul>
      <div className="fb-ev-groups">
        {GROUP_ORDER.map((g) => (
          <section key={g} className={`fb-ev-group fb-ev-group-${g}`} aria-labelledby={`evg-${g}`}>
            <h3 id={`evg-${g}`}>{e.groups[g].title}</h3>
            <p className="fb-note-small">{e.groups[g].lede}</p>
            {g === "compute" && <p className="fb-limit">{e.notPromise}</p>}
            <ul>
              {groups[g].map((item) => (
                <Item key={item.id} item={item} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

/** Bottom sheet. Native <dialog> gives focus trapping and Escape to close. */
export function EvidenceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="fb-drawer" aria-labelledby="fb-drawer-h" onClose={onClose}>
      <div className="fb-drawer-head">
        <div>
          <p className="fb-kicker">{e.kicker}</p>
          <h2 id="fb-drawer-h">{e.title}</h2>
        </div>
        <button type="button" className="fb-button" onClick={onClose}>
          {e.close}
        </button>
      </div>
      <EvidenceContent />
      <p className="fb-disclaimer">{copy.disclaimer}</p>
    </dialog>
  );
}

export function EvidenceChapter({ onOpen }: { onOpen: () => void }) {
  const groups = byGroup(evidence);
  return (
    <section className="fb-chapter" id="evidence" aria-labelledby="evidence-h">
      <p className="fb-kicker">06 — {e.kicker}</p>
      <h2 id="evidence-h" className="fb-display fb-display-s">
        {e.title}
      </h2>
      <div className="fb-ev-summary">
        {GROUP_ORDER.map((g) => (
          <div key={g} className={`fb-ev-tile fb-ev-group-${g}`}>
            <span className="fb-ev-count">{groups[g].length}</span>
            <h3>{e.groups[g].title}</h3>
            <p>{groups[g].map((i) => i.label).join(" · ")}</p>
          </div>
        ))}
      </div>
      <button type="button" className="fb-button fb-button-ink" onClick={onOpen}>
        {e.open}
      </button>
    </section>
  );
}
