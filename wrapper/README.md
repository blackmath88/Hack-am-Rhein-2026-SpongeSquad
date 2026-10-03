# Wrapper and integration

Home for Achim's work bringing the SpongeSquad modules together.

This folder contains the complete latest state consolidated from the fork's `feature/street-lab-ui` branch:

- `docs/ARCHITECTURE.md` — product spine, module boundaries and integration contract;
- `docs/TODO-DATA-GAP-TO-DECISION.md` — broader evidence-profile and gap-investigator direction, deliberately kept outside tonight's MVP;
- `data-charter-map/` — city-wide evidence charter, gap-filling research and real/inferred/missing Basel map;
- `prototypes/sponge-street/` — original standalone explainer;
- `street-workspace/` — typed React, TypeScript and SVG Street Lab.

That source already includes the structured street-world work and subsequent UI improvements, so older overlapping branch versions are not duplicated.

## Integration boundary

Andy's hot-spot finder remains unchanged on `feature/hot-spot-map`. The intended seam is:

```text
Data Charter / inference claims
→ CandidateArea
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
