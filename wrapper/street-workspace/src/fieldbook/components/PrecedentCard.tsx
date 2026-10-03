import { copy } from "../data/copy.en.ts";
import type { Precedent } from "../data/precedents.ts";
import { ImagePlaceholder } from "./ImagePlaceholder.tsx";

const l = copy.references.labels;

export function PrecedentCard({ p }: { p: Precedent }) {
  return (
    <article className="fb-precedent" id={`ref-${p.id}`} aria-labelledby={`ref-h-${p.id}`}>
      <ImagePlaceholder alt={p.imageAlt} credit="Credited project photograph to be curated." />
      <span className="fb-badge">{copy.references.badge}</span>
      <h3 id={`ref-h-${p.id}`}>{p.title}</h3>
      <p className="fb-precedent-meta">
        {p.practices}
        <br />
        {p.place} · {p.year ?? copy.references.yearUnknown}
      </p>
      <dl>
        <div>
          <dt>{l.move}</dt>
          <dd className="fb-precedent-move">{p.move}</dd>
        </div>
        <div>
          <dt>{l.spatial}</dt>
          <dd>{p.spatial}</dd>
        </div>
        <div>
          <dt>{l.water}</dt>
          <dd>{p.water}</dd>
        </div>
        <div>
          <dt>{l.borrow}</dt>
          <dd>{p.borrow}</dd>
        </div>
        <div>
          <dt>{l.source}</dt>
          <dd>
            {p.source.url ? (
              <a href={p.source.url} target="_blank" rel="noreferrer">
                {p.source.label}
              </a>
            ) : (
              p.source.label
            )}
          </dd>
        </div>
      </dl>
    </article>
  );
}
