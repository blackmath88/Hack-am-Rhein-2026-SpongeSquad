import { copy } from "../data/copy.en.ts";
import { precedents } from "../data/precedents.ts";
import { PrecedentCard } from "./PrecedentCard.tsx";

export function ReferenceLibrary() {
  const r = copy.references;
  return (
    <section className="fb-chapter" id="references" aria-labelledby="references-h">
      <p className="fb-kicker">04 — {r.kicker}</p>
      <h2 id="references-h" className="fb-display fb-display-s">
        {r.title}
      </h2>
      <p className="fb-lede">{r.lede}</p>
      <div className="fb-precedents">
        {precedents.map((p) => (
          <PrecedentCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
