import { copy } from "../data/copy.en.ts";
import { designMoves } from "../data/issue01.ts";

export function MovesPalette() {
  return (
    <div className="fb-moves" aria-labelledby="moves-h">
      <p className="fb-kicker">{copy.moves.kicker}</p>
      <h3 id="moves-h">{copy.moves.title}</h3>
      <ol>
        {designMoves.map((m, i) => (
          <li key={m.name}>
            <span className="fb-moves-n">{String(i + 1).padStart(2, "0")}</span>
            <strong>{m.name}</strong>
            <span className="fb-moves-feel">{m.feel}</span>
            <span className="fb-moves-tech">{m.translation}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
