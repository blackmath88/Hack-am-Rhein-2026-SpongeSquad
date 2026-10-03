// Editorial precedent cards. Prose is interpretive; facts are limited to
// attribution and year where a source was checked (see `source`).
export type Precedent = {
  id: string;
  title: string;
  practices: string;
  place: string;
  year?: string;
  move: string;
  spatial: string;
  water: string;
  borrow: string;
  source: { label: string; url?: string };
  imageAlt: string;
};

export const precedents: Precedent[] = [
  {
    id: "lysbuchel",
    title: "Lysbüchelplatz / VoltaNord",
    practices: "Stauffer Rösch Landschaftsarchitekten with jessenvollenweider architektur",
    place: "Basel, Switzerland",
    year: "2020 (project)",
    move: "Root · Store",
    spatial: "A district square framed by a planted edge, holding a meeting place and a pavilion within a dense transformation area.",
    water: "Described by its designers as collecting rain on site following the sponge-city idea, rather than sending it straight away.",
    borrow: "A local precedent that sponge-city ambitions belong in Basel's dense new quarters — and a nearby reference for any St. Johann street.",
    source: { label: "World-Architects project page — verify details before citing", url: "https://world-architects.com/en/projects/view/lysbuchelplatz-volta-nord" },
    imageAlt: "Placeholder for a credited photograph of the planted edge of Lysbüchelplatz.",
  },
  {
    id: "benthemplein",
    title: "Water Square Benthemplein",
    practices: "De Urbanisten",
    place: "Rotterdam, Netherlands",
    year: "2013",
    move: "Store visibly",
    spatial: "Sunken basins that are a sports court and seating steps on dry days.",
    water: "Storage is placed on the surface, where it can be seen and understood, instead of hidden in a tank.",
    borrow: "Storage can be civic space. A dip in the ground can be a room, not only a reservoir.",
    source: { label: "Landezine project page", url: "https://landezine.com/water-square-benthemplein-by-de-urbanisten/" },
    imageAlt: "Placeholder for a credited photograph of the dry basins at Benthemplein.",
  },
  {
    id: "tasinge",
    title: "Tåsinge Plads",
    practices: "GHB Landskabsarkitekter with Orbicon",
    place: "Copenhagen, Denmark",
    year: "2014",
    move: "Make water civic",
    spatial: "A former traffic space turned planted square with hollows, mounds and places to sit.",
    water: "Rain from roofs and the square is led to planted areas; elements invite residents to notice it.",
    borrow: "A residential street corner can carry water and learning at once — at the scale of one block.",
    source: { label: "Klimatilpasning.dk case description", url: "https://eng.klimatilpasning.dk/examples-of-climate-adaptation/the-capital-region-of-denmark/green-rainwater-solution-creates-a-new-beautiful-urban-space-in-copenhagen" },
    imageAlt: "Placeholder for a credited photograph of planted hollows at Tåsinge Plads.",
  },
  {
    id: "sponge-garden",
    title: "Sponge Garden",
    practices: "De Urbanisten",
    place: "Rotterdam, Netherlands",
    year: "2019",
    move: "Test the ground",
    spatial: "A public garden laid out as a series of experiments: soils, depavings and plantings side by side.",
    water: "Different ways of letting water into the ground become visible and comparable.",
    borrow: "Where the ground is unknown, make testing part of the design — learn before committing to depth.",
    source: { label: "De Urbanisten project page", url: "https://www.urbanisten.nl/work/sponge-garden-dhkxw" },
    imageAlt: "Placeholder for a credited photograph of experimental planting beds at the Sponge Garden.",
  },
];

export const precedentById = (id: string) => precedents.find((p) => p.id === id);
