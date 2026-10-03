// Static demo data for Issue 01. Nothing here is read from a real Basel
// dataset; "stand-in" sources name the record the value would come from.
import type { DesignFuture, EvidenceItem } from "../evidence.ts";
import { formatRange, interval, runoffVolume, shadeShare, storageVolume, sum, toScenario } from "../screening.ts";

const DEMO = "Demonstration value";

export const assumptions = {
  rainfallMm: interval(30),
  sealedAreaM2: interval(320, 470),
  runoffCoefficient: interval(0.7, 0.95),
  interventionAreaM2: interval(12),
  activeDepthM: interval(0.25, 0.45),
  voidFraction: interval(0.2, 0.35),
  shallowDepthM: interval(0.1, 0.2),
  shallowPondingM: interval(0.02, 0.05),
  roofAreaM2: interval(180, 260),
  roofRetentionM: interval(0.008, 0.015),
  exposedStripM: 7,
} as const;

const a = assumptions;
export const runoff = runoffVolume(a);
const deepStorage = storageVolume({ areaM2: a.interventionAreaM2, activeDepthM: a.activeDepthM, voidFraction: a.voidFraction });
const shallowStorage = sum(
  storageVolume({ areaM2: a.interventionAreaM2, activeDepthM: a.shallowDepthM, voidFraction: a.voidFraction }),
  storageVolume({ areaM2: a.interventionAreaM2, activeDepthM: a.shallowPondingM, voidFraction: interval(1) }),
);
const roofStorage = storageVolume({ areaM2: a.roofAreaM2, activeDepthM: a.roofRetentionM, voidFraction: interval(1) });

// Shadow widths on the 7 m sun-side strip, read from the section at one sun angle.
const shade = {
  existing: shadeShare(interval(1.5, 2.5), a.exposedStripM),
  deep: shadeShare(interval(4, 5.5), a.exposedStripM),
  shallow: shadeShare(interval(3, 4.5), a.exposedStripM),
  no_dig: shadeShare(interval(3, 4), a.exposedStripM),
};

const runoffLimit = "Uniform rain, no infiltration losses on sealed surfaces, no timing. Not a drainage design or a flood-reduction promise.";
const storageLimit = "Volume available in the stated layer if empty at the start. Not a drainage design or a flood-reduction promise.";
const shadeLimit = "One section, one sun angle (≈ 55°, mid-July afternoon), mature canopy, overlaps ignored. Geometric shade scenario, not a temperature prediction.";

export const runoffScenario = toScenario(
  "Estimated local runoff under this stated scenario",
  runoff,
  "m³",
  "V = P × A × C · P 30 mm · A 320–470 m² · C 0.70–0.95",
  runoffLimit,
);

export const futures: DesignFuture[] = [
  {
    id: "deep",
    title: "A — Space below",
    proposition: "Where there is room below ground, rain can reach roots and soil.",
    moves: ["Root", "Store", "Overflow beautifully"],
    scenarioEffects: [
      toScenario("Temporary storage scenario", deepStorage, "m³", "12 m² trench × 0.25–0.45 m active depth × 0.20–0.35 voids", storageLimit),
      toScenario("Shade on sun-side strip", shade.deep, "%", "Two trench trees, mature crown 4–5.5 m across a 7 m strip", shadeLimit),
    ],
    mustVerify: ["Utility clearance", "Excavation depth", "Soil permeability", "Groundwater level", "Overflow route"],
    precedentIds: ["lysbuchel", "sponge-garden"],
  },
  {
    id: "shallow",
    title: "B — Shallow sponge",
    proposition: "Where depth is constrained, water can still slow down at the surface.",
    moves: ["Slow", "Spread", "Reveal"],
    scenarioEffects: [
      toScenario("Temporary storage scenario", shallowStorage, "m³", "12 m² × 0.10–0.20 m substrate × 0.20–0.35 voids, plus 0.02–0.05 m surface ponding", storageLimit),
      toScenario("Shade on sun-side strip", shade.shallow, "%", "Smaller trees in raised beds, crown 3–4.5 m", shadeLimit),
    ],
    mustVerify: ["Utility clearance", "Accessibility of the edge", "Drainage path", "Maintenance"],
    precedentIds: ["tasinge", "benthemplein"],
  },
  {
    id: "no_dig",
    title: "C — No-dig shade room",
    proposition: "Where digging is impossible, the street can still become cooler and more generous.",
    moves: ["Catch", "Shade", "Repair"],
    scenarioEffects: [
      toScenario("Roof retention scenario", roofStorage, "m³", "180–260 m² roof × 8–15 mm retained", storageLimit + " On private roofs, subject to structure."),
      toScenario("Shade on sun-side strip", shade.no_dig, "%", "Shade structure and mobile planting, 3–4 m", shadeLimit),
    ],
    mustVerify: ["Ownership", "Structural capacity", "Operations and access", "Roof and drainage route"],
    precedentIds: ["benthemplein", "lysbuchel"],
  },
];

export const existingShade = toScenario("Shade on sun-side strip, existing", shade.existing, "%", "One existing tree, crown 1.5–2.5 m across the 7 m strip", shadeLimit);

export const evidence: EvidenceItem[] = [
  {
    id: "surface",
    label: "Surface condition",
    value: "Asphalt roadway, concrete-slab pavement, one tree pit",
    status: "official_record",
    confidence: "medium",
    source: `${DEMO} — stands in for the cadastral land-cover record (Amtliche Vermessung, Bodenbedeckung). Not read from the real dataset.`,
    observedAt: "Demo snapshot",
    canEstablish: ["Which surfaces are sealed at ground level"],
    cannotEstablish: ["Build-up below the surface", "Condition of sub-base", "What lies beneath"],
  },
  {
    id: "tree",
    label: "Existing street tree",
    value: "One tree, crown ≈ 5 m",
    status: "official_record",
    confidence: "medium",
    source: `${DEMO} — stands in for the cantonal tree register (Baumkataster).`,
    canEstablish: ["Position and approximate crown"],
    cannotEstablish: ["Root extent", "Soil volume available"],
  },
  {
    id: "downpipes",
    label: "Façade downpipes",
    value: "Two candidate downpipes on the north façade",
    status: "ai_candidate",
    confidence: "low",
    method: "Automated reading of street-level imagery (illustrative)",
    canEstablish: ["Where to look on a site visit"],
    cannotEstablish: ["Whether pipes are active", "Where they connect underground"],
    nextAction: "Confirm on site and photograph the base of each downpipe.",
  },
  {
    id: "catchment",
    label: "Sealed catchment",
    value: "320–470 m²",
    status: "derived",
    confidence: "medium",
    method: "Roof and street areas draining toward the planted strip; range covers uncertain roof falls.",
    canEstablish: ["Order of magnitude of surface feeding this place"],
    cannotEstablish: ["Actual falls and levels", "Internal roof drainage"],
    nextAction: "Check against a levels survey.",
  },
  {
    id: "runoff",
    label: "Estimated local runoff under this stated scenario",
    value: formatRange(runoffScenario),
    status: "derived",
    method: runoffScenario.basis,
    canEstablish: ["Scale of the water story for one stated storm"],
    cannotEstablish: ["Flood risk", "Sewer relief", "Timing of flows"],
  },
  {
    id: "storage",
    label: "Temporary storage scenario (Future A)",
    value: formatRange(futures[0].scenarioEffects[0]),
    status: "derived",
    method: futures[0].scenarioEffects[0].basis,
    canEstablish: ["Whether the planted zone is meaningful relative to the runoff range"],
    cannotEstablish: ["Infiltration into native soil", "Drain-down time", "Performance in successive storms"],
  },
  {
    id: "shade",
    label: "Geometric shade, sun-side strip",
    value: `${formatRange(existingShade)} existing → ${formatRange(futures[0].scenarioEffects[1])} (Future A)`,
    status: "derived",
    method: "Shadow widths read from the section at one sun angle.",
    canEstablish: ["Relative gain in shaded ground"],
    cannotEstablish: ["Surface or air temperature", "Thermal comfort"],
  },
  {
    id: "rain-event",
    label: "Rain event",
    value: "30 mm representative summer storm",
    status: "assumption",
    canEstablish: [],
    cannotEstablish: ["Return period or design-storm equivalence"],
    nextAction: "Agree the design storm with the drainage engineer.",
  },
  {
    id: "coefficients",
    label: "Runoff coefficient",
    value: "0.70–0.95",
    status: "assumption",
    canEstablish: [],
    cannotEstablish: ["Losses on real surfaces"],
  },
  {
    id: "substrate",
    label: "Active depth and void fraction",
    value: "0.25–0.45 m · 0.20–0.35",
    status: "assumption",
    canEstablish: [],
    cannotEstablish: ["Achievable depth on this street"],
    nextAction: "Replace with specialist substrate specification once depth is known.",
  },
  {
    id: "utilities",
    label: "Utility clearance",
    status: "unknown",
    canEstablish: [],
    cannotEstablish: ["Whether excavation is possible here"],
    nextAction: "Request a Leitungskataster extract and operator responses for the strip.",
  },
  {
    id: "sewer",
    label: "Sewer capacity and connection",
    status: "unknown",
    canEstablish: [],
    cannotEstablish: ["Whether overflow may connect", "Whether relief matters at this location"],
    nextAction: "Ask the Tiefbauamt drainage team about the receiving system.",
  },
  {
    id: "soil",
    label: "Soil permeability, groundwater and contamination",
    status: "unknown",
    canEstablish: [],
    cannotEstablish: ["Whether local infiltration is permitted or plausible"],
    nextAction: "Commission a geotechnical desk study and check groundwater-protection and contaminated-site registers.",
  },
  {
    id: "maintenance",
    label: "Maintenance and ownership",
    status: "unknown",
    canEstablish: [],
    cannotEstablish: ["Who cares for the planted zone and its inlets"],
    nextAction: "Name the responsible party before the concept is fixed.",
  },
];

export const confirmations = [
  "Utility / Leitungskataster coordination for the planted strip",
  "IWB / operator enquiry where networks run in the verge",
  "Drainage and overflow route with the Tiefbauamt",
  "Soil, groundwater and contamination review",
  "Maintenance and ownership responsibility",
];

export const stakeholders = [
  "Leitungskataster / relevant utility operators",
  "IWB where relevant",
  "Tiefbauamt drainage team",
  "Groundwater / environmental authority",
  "Landscape architect · civil engineer · geotechnical specialist",
  "Property owner / maintenance responsible party",
];

export const designMoves: { name: string; feel: string; translation: string }[] = [
  { name: "Catch", feel: "Let rain arrive", translation: "Roof and ground catchment, visible collection" },
  { name: "Slow", feel: "Give water time", translation: "Roughness, planting, shallow detention" },
  { name: "Spread", feel: "Make water useful", translation: "Distribute runoff to several planted zones" },
  { name: "Root", feel: "Give trees a reservoir", translation: "Continuous soil volume, tree trench" },
  { name: "Shade", feel: "Make a cooler room", translation: "Canopy, trellis, façade or roof vegetation" },
  { name: "Store", feel: "Keep water for the dry day", translation: "Cistern, blue roof, subsurface storage" },
  { name: "Reveal", feel: "Make the cycle visible", translation: "Rills, channels, rain chains" },
  { name: "Overflow beautifully", feel: "Design the moment it fills", translation: "Safe, visible route to an approved system" },
  { name: "Repair", feel: "Start with what exists", translation: "Clear inlets, restore planting, unseal small areas" },
  { name: "Adapt", feel: "Keep a second future open", translation: "Deep / shallow / no-dig branches" },
];
