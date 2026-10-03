// Validate data/catalogue.json and write docs/CATALOGUE.md.
// --check: validate and fail if docs/CATALOGUE.md is out of date.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));
const cat = read("data/catalogue.json");
const potential = read("data/potential.json");
const charter = read("../data-charter-map/data/data-charter.json");

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const findings = new Map(cat.city_findings.map((f) => [f.id, f]));
const claims = new Set(charter.claims.map((c) => c.id));

function checkSources(where, list = []) {
  for (const s of list) if (!cat.sources[s]) fail(where, `unknown source '${s}'`);
}

// An evidence item: observed needs a source or observed finding; derived needs a
// finding, a Data Charter claim or a source; assumed text is marked ≈; unknown
// says what is missing and cites nothing as if it were data.
function checkItem(where, it) {
  if (!cat.evidence[it.evidence]) return fail(where, `unknown evidence class '${it.evidence}'`);
  checkSources(where, it.sources);
  if (it.finding && !findings.has(it.finding)) fail(where, `unknown finding '${it.finding}'`);
  if (it.claim && !claims.has(it.claim)) fail(where, `unknown Data Charter claim '${it.claim}'`);
  const backed = it.finding || it.claim || it.sources?.length;
  if ((it.evidence === "observed" || it.evidence === "derived") && !backed) fail(where, `${it.evidence} item without finding, claim or source`);
  if (it.finding && findings.get(it.finding).evidence !== it.evidence) fail(where, `evidence '${it.evidence}' differs from finding '${it.finding}'`);
  if (it.evidence === "assumed" && !it.text.startsWith("≈")) fail(where, "assumed text must start with ≈");
  if (it.evidence !== "assumed" && it.text.startsWith("≈")) fail(where, "only assumed text starts with ≈");
  if (it.evidence === "unknown" && backed) fail(where, "unknown item cites data");
}

for (const f of cat.city_findings) {
  checkItem(`finding ${f.id}`, f);
  if (f.evidence === "derived" && (!f.method || !f.limitations?.length)) fail(`finding ${f.id}`, "derived finding needs method and limitations");
}

const ids = new Set();
for (const a of cat.actions) {
  const w = `action ${a.id}`;
  if (ids.has(a.id)) fail(w, "duplicate id");
  ids.add(a.id);
  for (const k of ["name", "what", "sketch"]) if (!a[k]) fail(w, `missing ${k}`);
  for (const c of a.context) if (!cat.segments.context[c]) fail(w, `unknown context '${c}'`);
  for (const o of a.owner) if (!cat.segments.owner[o]) fail(w, `unknown owner '${o}'`);
  if (!a.basel.length) fail(w, "row 2 is empty; use status none-found");
  for (const b of a.basel) {
    if (!cat.basel_status[b.status]) fail(w, `unknown status '${b.status}'`);
    if (b.status === "none-found" ? b.sources?.length : !b.sources?.length) fail(w, `status '${b.status}' and sources disagree`);
    checkSources(w, b.sources);
  }
  if (!a.potential.length) fail(w, "row 3 is empty");
  a.potential.forEach((p, i) => checkItem(`${w} potential[${i}]`, p));
}
for (const l of cat.levers) {
  if (l.evidence !== "assumed") fail(`lever ${l.id}`, "levers are proposals (assumed)");
}

// Derived figures must match what scripts/compute_potential.py produced.
const sealed = potential["sealed-by-parcel"], heat = potential["suitable-in-heat"], works = potential["works-near-suitable"];
const figures = {
  "sealed-by-parcel": [sealed.sealed_ha.allmend, sealed.sealed_ha["other-parcels"], sealed.area_ha["other-parcels"].building, sealed.area_ha["other-parcels"]["paved-other"], sealed.area_ha["other-parcels"].road],
  "suitable-in-heat": [heat.suitable_km_in_fokus_or_verbessern, heat.suitable_km_by_heat_area.Fokus, heat.suitable_km_by_heat_area.Verbessern],
  "works-near-suitable": [works.near_suitable_in_heat, works.upcoming],
};
const fmt = (n) => n.toLocaleString("en-US");
for (const [id, nums] of Object.entries(figures)) {
  for (const n of nums) if (!findings.get(id).text.includes(fmt(n))) fail(`finding ${id}`, `text does not carry computed figure ${fmt(n)}`);
}

// Wording rules shared with the Data Charter.
const all = JSON.stringify(cat);
for (const [re, why] of [
  [/dig window/i, "say 'active or upcoming works'"],
  [/no open data exists/i, "say 'no open data found in the reviewed Basel and federal sources'"],
]) if (re.test(all)) fail("wording", why);

if (errors.length) {
  console.error(errors.map((e) => `Error: ${e}`).join("\n"));
  process.exit(1);
}

// ---- docs/CATALOGUE.md ----
const src = (list = []) => list.map((s) => `[${s}](${cat.sources[s].url})`).join(", ");
const ev = (it) => {
  const ref = [it.finding && `finding \`${it.finding}\``, it.claim && `Data Charter claim \`${it.claim}\``, it.sources?.length && src(it.sources)].filter(Boolean).join("; ");
  return `*${it.evidence}*${ref ? ` (${ref})` : ""}`;
};
const lines = [
  `<!-- generated by scripts/build-doc.mjs from data/catalogue.json; do not edit -->`,
  `# ${cat.title}`, "", cat.purpose, "",
  `Updated ${cat.updated}. Derived figures: explaining and screening only, not validated.`, "",
  "## Evidence classes", "", ...Object.entries(cat.evidence).map(([k, v]) => `- **${k}**: ${v}`), "",
  "## City findings", "",
];
for (const f of cat.city_findings) {
  lines.push(`### ${f.id}`, "", `${f.text} — ${ev(f)}`, "");
  if (f.method) lines.push(`- Method: ${f.method}`);
  for (const l of f.limitations ?? []) lines.push(`- Limitation: ${l}`);
  if (f.method || f.limitations) lines.push("");
}
lines.push("## Actions", "", "| Action | New / existing | Owner | Basel today |", "|---|---|---|---|");
for (const a of cat.actions) lines.push(`| [${a.name}](#${a.id}) | ${a.context.join(", ")} | ${a.owner.join(", ")} | ${[...new Set(a.basel.map((b) => b.status))].join(", ")} |`);
lines.push("");
for (const a of cat.actions) {
  lines.push(`### ${a.id}`, "", `**${a.name}** (${a.de}). ${a.what}`, "", `Context: ${a.context.join(", ")} · Owner: ${a.owner.join(", ")} · Mechanisms: ${a.mechanisms.join(", ")}`, "", "Basel today:", "");
  for (const b of a.basel) lines.push(`- **${b.status}**: ${b.text}${b.sources?.length ? ` (${src(b.sources)})` : ""}`);
  lines.push("", "Potential:", "");
  for (const p of a.potential) lines.push(`- ${p.text} — ${ev(p)}`);
  lines.push("");
}
lines.push("## How to get there (proposals)", "", ...cat.levers.map((l) => `- **${l.name}**: ${l.text}`), "");
lines.push("## Sources", "", ...Object.entries(cat.sources).map(([k, s]) => `- \`${k}\`: [${s.label}](${s.url})`), "");
const md = lines.join("\n");
const out = join(root, "docs/CATALOGUE.md");
if (process.argv.includes("--check")) {
  if (!existsSync(out) || readFileSync(out, "utf8") !== md) {
    console.error("Error: docs/CATALOGUE.md is out of date; run npm run doc");
    process.exit(1);
  }
  console.log(`catalogue ok: ${cat.actions.length} actions, ${cat.city_findings.length} findings, ${cat.levers.length} levers`);
} else {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, md);
  console.log("wrote docs/CATALOGUE.md");
}
