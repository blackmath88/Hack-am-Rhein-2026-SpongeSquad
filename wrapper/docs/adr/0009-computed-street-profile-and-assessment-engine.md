# ADR 0009: Computed street profile and deterministic assessment engine for Street X-Ray

- Status: Proposed (engine built in `wrapper/street-xray/engine/`; the page does not use it yet)
- Date: 2026-10-04

## Context

ADR 0008 makes Street X-Ray an evidence gate. The page (`wrapper/street-xray/index.html`) runs on a hand-built fixture: an illustrative Klybeck study segment in `data/street-evidence-profile.v0.json`. Its verification toggles rehearse how answers move an intervention from `requires-investigation` to `candidate`.

Two things are not covered yet:

- **computed facts for a real street:** street choice, corridor surface, works nearby;
- **a tested rule set behind the toggles:** today a stand-in for an unknown could slip through unnoticed.

## Decision (proposed)

1. `engine/scripts/select_street.py` picks a street by rule:
   - rated sponge-suitable by traffic;
   - in a Fokus heat area;
   - named;
   - the most active or upcoming permits within 60 m (ties: longer segment).

   It gathers open inputs: a corridor land-cover sample, cadastre trees, the nearest groundwater station and the protection zone. On the 3 October 2026 snapshot this gives Kanonengasse, 241 m, with 24 utility permits.
2. `engine/src/profile.mjs` builds `computed-street-profile/0.1`. Each field carries an evidence class, access state, sources, and method, limitations, validation and permitted use. An unknown is `null` with gatekeepers and a next action. Scenarios are ranges from typed assumptions, and an unknown input gives an unknown result.
3. `assess(profile, answers)` is a pure rule table over declared gatekeeper outcomes. It covers five intervention families (space below, shallow, no-dig):
   - a fact that says no excludes;
   - an unresolved fact keeps the intervention under investigation;
   - undeclared answers are rejected.

   No LLM is involved.
4. Twelve tests enforce that unknown never becomes zero, safe or suitable, and that the rules behave as stated.
5. The schema name differs on purpose from the page's `street-evidence-profile/0.1`. Two names, two objects, until the owners decide how they converge.
6. `integration/contracts/` and the Street Lab are unchanged.

## Open questions for the module owner

- Should the page read the engine's profile for a second, computed street, or should the engine adopt the page's claim shape (`layer`, `origin`, `title`)?
- Should the page's verification toggles call `assess()`, so the rehearsal and the rules cannot drift apart?

## Consequences

- Street X-Ray can show one illustrative street and one computed street without mixing their claim levels.
- The constraint simulator gets a tested engine. Gatekeeper answers remain hypotheses.
