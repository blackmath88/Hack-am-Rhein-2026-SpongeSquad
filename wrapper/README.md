# Wrapper and integration

Achim's workspace for bringing the SpongeSquad modules together.

This folder contains the complete latest state from the fork's `feature/street-lab-ui` branch:

- `docs/ARCHITECTURE.md` — product spine, module boundaries and integration contract;
- `docs/TODO-DATA-GAP-TO-DECISION.md` — broader evidence-profile and gap-investigator direction, deliberately kept outside tonight's MVP;
- `data-charter-map/` — city-wide evidence charter, gap-filling research and real/inferred/missing Basel map;
- `street-xray/` — one-street evidence gate, verification rehearsal and printable Evidence Passport;
- `prototypes/sponge-street/` — original standalone explainer;
- `street-workspace/` — typed React, TypeScript and SVG Street Lab.

The source branch already includes the structured street-world work and the subsequent Street Lab UI improvements, so older overlapping branches are not copied separately.

## Integration boundary

Andy's hot-spot finder remains unchanged at `../basel-site-scoping-tool/`. The intended seam is:

```text
Data Charter / inference claims
→ CandidateArea
→ Street X-Ray / Evidence Passport
→ example StreetScenarioSeed
→ Street Lab
→ explanation and comparison
```

Integration must not turn illustrative area scores into measured street geometry, soil or drainage facts.

## Shared shell

The repository root now builds a shared landing page plus a linked page for every
team workstream. These pages are routing templates, not replacements for the
workstream implementations. Add or replace a card when a team exposes a stable
entry point.
