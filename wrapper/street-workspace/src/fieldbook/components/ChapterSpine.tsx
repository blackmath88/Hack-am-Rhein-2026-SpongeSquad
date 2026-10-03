import { useEffect, useState } from "react";
import { copy } from "../data/copy.en.ts";

export function ChapterSpine({ onEvidence }: { onEvidence: () => void }) {
  const [active, setActive] = useState<string>(copy.chapters[0].id);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current: string = copy.chapters[0].id;
      for (const ch of copy.chapters) {
        const el = document.getElementById(ch.id);
        if (el && el.getBoundingClientRect().top <= line) current = ch.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <nav className="fb-spine" aria-label="Chapters">
      <a className="fb-spine-mark" href="#cover">
        SCF <span>01</span>
      </a>
      <ol>
        {copy.chapters.map((ch) => (
          <li key={ch.id}>
            <a href={`#${ch.id}`} aria-current={active === ch.id ? "location" : undefined}>
              <span className="fb-spine-n">{ch.n}</span>
              <span className="fb-spine-t">{ch.title}</span>
            </a>
          </li>
        ))}
      </ol>
      <button type="button" className="fb-spine-evidence" onClick={onEvidence}>
        Evidence
      </button>
      <div className="fb-modes" aria-label="Modes">
        <span aria-current="page">{copy.modes.fieldbook}</span>
        <a href="./index.html">{copy.modes.workspace}</a>
        <span className="fb-mode-off" title="Site scoping map lives on the hot-spot branch">
          {copy.modes.map}
        </span>
      </div>
    </nav>
  );
}
