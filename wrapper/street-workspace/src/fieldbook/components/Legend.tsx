import { copy } from "../data/copy.en.ts";
import { Mark } from "./SvgDefs.tsx";

export function Legend() {
  return (
    <div className="fb-legend">
      <h3>{copy.legend.title}</h3>
      <ul>
        {copy.legend.items.map((i) => (
          <li key={i.mark}>
            <Mark kind={i.mark} />
            <span>{i.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
