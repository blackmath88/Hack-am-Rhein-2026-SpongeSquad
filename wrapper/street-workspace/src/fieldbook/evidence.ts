// Evidence model for the Fieldbook. Every visible claim carries one status;
// the status decides how it is drawn and which drawer heading it belongs to.

export type EvidenceStatus =
  | "official_record"
  | "measured"
  | "derived"
  | "community_observation"
  | "ai_candidate"
  | "image_reviewed"
  | "field_observed"
  | "authority_confirmed"
  | "assumption"
  | "unknown";

export type EvidenceItem = {
  id: string;
  label: string;
  value?: string;
  status: EvidenceStatus;
  confidence?: "high" | "medium" | "low";
  source?: string;
  observedAt?: string;
  method?: string;
  canEstablish: string[];
  cannotEstablish: string[];
  nextAction?: string;
};

export type ScenarioRange = {
  label: string;
  minimum: number;
  maximum: number;
  unit: string;
  basis: string;
  limitation: string;
};

export type DesignFuture = {
  id: "deep" | "shallow" | "no_dig";
  title: string;
  proposition: string;
  moves: string[];
  scenarioEffects: ScenarioRange[];
  mustVerify: string[];
  precedentIds: string[];
};

/** The four drawer headings. */
export type EvidenceGroup = "know" | "compute" | "assume" | "ask";

/** Line language shared by the section drawing, legend and drawer. */
export type EvidenceMark = "solid" | "dashed" | "ring" | "dotted" | "hatch" | "gate";

type StatusMeta = { label: string; group: EvidenceGroup; mark: EvidenceMark; meaning: string };

export const STATUS_META: Record<EvidenceStatus, StatusMeta> = {
  official_record: { label: "Official record", group: "know", mark: "solid", meaning: "Published by an authority; describes what was recorded, not what is buildable." },
  measured: { label: "Measured", group: "know", mark: "solid", meaning: "Instrument or survey measurement with a stated date." },
  field_observed: { label: "Field observed", group: "know", mark: "solid", meaning: "Seen on site by a named person on a stated date." },
  authority_confirmed: { label: "Authority confirmed", group: "know", mark: "gate", meaning: "Confirmed in writing by the responsible authority or operator." },
  image_reviewed: { label: "Image reviewed", group: "know", mark: "ring", meaning: "Seen in imagery by a person; still needs a site visit." },
  community_observation: { label: "Community observation", group: "know", mark: "ring", meaning: "Reported by residents; useful, not verified." },
  ai_candidate: { label: "Image / AI candidate", group: "know", mark: "ring", meaning: "Suggested by automated image reading. A prompt to look, never a fact." },
  derived: { label: "Computed", group: "compute", mark: "dashed", meaning: "Calculated from stated inputs. A scenario range, not a prediction." },
  assumption: { label: "Assumption", group: "assume", mark: "dotted", meaning: "Chosen by the study to make a scenario possible. Replace with evidence." },
  unknown: { label: "Not yet known", group: "ask", mark: "hatch", meaning: "Cannot be established from this evidence. Someone must be asked." },
};

export const GROUP_ORDER: EvidenceGroup[] = ["know", "compute", "assume", "ask"];

export const groupOf = (item: EvidenceItem): EvidenceGroup => STATUS_META[item.status].group;

export const byGroup = (items: EvidenceItem[]): Record<EvidenceGroup, EvidenceItem[]> => {
  const out: Record<EvidenceGroup, EvidenceItem[]> = { know: [], compute: [], assume: [], ask: [] };
  for (const item of items) out[groupOf(item)].push(item);
  return out;
};
