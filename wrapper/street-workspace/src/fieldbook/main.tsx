import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { copy } from "./data/copy.en.ts";
import type { FutureId, NoteKey, Weather } from "./state.ts";
import { ChapterSpine } from "./components/ChapterSpine.tsx";
import { CoordinationTearout } from "./components/CoordinationTearout.tsx";
import { Cover } from "./components/Cover.tsx";
import { EvidenceChapter, EvidenceDrawer } from "./components/EvidenceDrawer.tsx";
import { FuturesSpread } from "./components/FuturesSpread.tsx";
import { MovesPalette } from "./components/MovesPalette.tsx";
import { ReferenceLibrary } from "./components/ReferenceLibrary.tsx";
import { SectionPlate } from "./components/SectionPlate.tsx";
import { SiteStory } from "./components/SiteStory.tsx";
import { SvgDefs } from "./components/SvgDefs.tsx";
import { ThresholdPlate } from "./components/ThresholdPlate.tsx";
import "./fieldbook.css";

function Fieldbook() {
  const [weather, setWeather] = useState<Weather>("dry");
  const [future, setFuture] = useState<FutureId | null>(null);
  const [note, setNote] = useState<NoteKey | null>(null);
  const [drawer, setDrawer] = useState(false);
  const drawInSection = (f: FutureId) => {
    setFuture(f);
    setWeather("rain");
    document.getElementById("weather")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <>
      <SvgDefs />
      <a className="fb-skip" href="#site">
        Skip to content
      </a>
      <Cover />
      <div className="fb-book">
        <ChapterSpine onEvidence={() => setDrawer(true)} />
        <main className="fb-pages">
          <SiteStory />
          <SectionPlate weather={weather} onWeather={setWeather} future={future} onFuture={setFuture} note={note} onNote={setNote} />
          <FuturesSpread future={future} onDraw={drawInSection} />
          <MovesPalette />
          <ReferenceLibrary />
          <ThresholdPlate />
          <EvidenceChapter onOpen={() => setDrawer(true)} />
          <CoordinationTearout future={future} />
          <footer className="fb-colophon">
            <h2>{copy.firstRain.title}</h2>
            <p>{copy.firstRain.body}</p>
            <p className="fb-lede">{copy.firstRain.invite}</p>
            <p className="fb-disclaimer">{copy.disclaimer}</p>
          </footer>
        </main>
      </div>
      <EvidenceDrawer open={drawer} onClose={() => setDrawer(false)} />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Fieldbook />
  </StrictMode>,
);
