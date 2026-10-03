# Data Hack Library — execution plans

These plans turn the three prototype cards into implementable hackathon slices.

The common rule is:

> **AI may create candidate evidence and worklists. It does not create authoritative infrastructure truth.**

Each hack should emit traceable records that can later be attached to a Street Evidence Passport.

---

## Shared execution pattern

~~~
source evidence
   ↓
deterministic preprocessing
   ↓
candidate extraction / comparison
   ↓
typed candidate record
   ↓
human review
   ↓
field / gatekeeper escalation
   ↓
accepted evidence state
~~~

### Shared evidence states

- candidate
- image_reviewed
- field_observed
- authority_confirmed
- rejected
- unknown

### Shared minimum record

~~~json
{
  "id": "obs-...",
  "hack_id": "find-the-drain",
  "site_id": "street-segment-...",
  "status": "candidate",
  "created_at": "ISO timestamp",
  "evidence": [],
  "location": {
    "geometry": null,
    "uncertainty_m": null
  },
  "confidence": null,
  "claims": [],
  "limits": [],
  "next_action": null,
  "gatekeeper": null
}
~~~

The important part is not the exact schema yet. Every derived observation must carry **source, status, uncertainty, limits and next action**.

---

# Hack 01 — Find the Drain

## Goal

Create a reviewable list of **visible drainage clues** for one street segment.

Target classes for the first slice:

- grate / inlet;
- manhole / inspection cover;
- kerb opening / channel;
- tree pit / planted depression;
- obvious blocked drainage clue.

Do not infer underground pipe geometry.

## MVP architecture

~~~
street photos / video frames
        ↓
image metadata normalizer
        ↓
candidate object detector
        ↓
deduplicate nearby detections
        ↓
candidate observation records
        ↓
review UI
  accept / reject / unsure
        ↓
field-task / gatekeeper-task generator
~~~

### Phase 0 — no-model baseline

Before integrating CV, let a reviewer manually click an image and create a candidate.

This proves the evidence record, image provenance, review states, location uncertainty and task generation. The product value is the **evidence workflow**, not the detector alone.

### Phase 1 — detector-assisted

Use one of:

1. a general vision model with bounded structured output;
2. an open object detector if a suitable class exists;
3. a small manually labelled set + lightweight detector if time allows.

Recommended hackathon strategy: start with a general vision model over small image crops, then compare against manual review. Only train or fine-tune if the baseline is clearly insufficient.

## Core modules

~~~
capture/
  image ingestion
  metadata / timestamp / source

vision/
  candidate detector
  class vocabulary
  confidence

spatial/
  optional GPS interpolation
  uncertainty radius
  duplicate clustering

evidence/
  typed observation records
  provenance

review/
  accept / reject / unsure

tasks/
  field verification task
  authority/operator enquiry task
~~~

## Acceptance test

For one 100–250 m street segment:

- ingest 10–30 images;
- create candidate drainage observations;
- every candidate links to its source image;
- every candidate has a review state;
- reviewer can accept / reject / unsure;
- accepted candidates become Evidence Passport items;
- the UI never displays pipe connectivity or capacity unless separately confirmed.

## Nice-to-have

- multi-view clustering;
- approximate triangulation;
- compare candidates against an official/public asset layer;
- discrepancy queue when visible asset and official layer disagree.

---

# Hack 02 — Rain Walk

## Goal

Generate **current, time-specific street observations** that static GIS cannot provide.

This hack is valuable even without AI.

## MVP architecture

~~~
guided mobile capture
        ↓
step-by-step observation form
        ↓
photos / short clips + GPS + time
        ↓
AI pre-tags visible evidence
        ↓
user confirms / edits
        ↓
Rain Walk observation bundle
        ↓
Evidence Passport
        ↓
repeat observation comparison
~~~

## Guided capture sequence

Keep the user flow short:

1. street overview;
2. kerb / road edge;
3. nearest visible inlet or grate;
4. tree pit / green edge;
5. low point / ponding clue;
6. blockage / debris;
7. apparent flow direction;
8. optional after-rain photo of standing water.

The app should ask **observation questions**, not engineering questions.

Good:

- "Do you see standing water?"
- "Is this grate visibly blocked?"
- "Which way does surface water appear to move?"

Bad:

- "Is sewer capacity sufficient?"
- "Can this soil infiltrate 20 mm/h?"

## Data architecture

~~~
walk session
  ├─ site / segment
  ├─ start/end time
  ├─ weather context
  ├─ observations[]
  │   ├─ media
  │   ├─ observation type
  │   ├─ user confirmation
  │   ├─ model suggestion
  │   └─ limitations
  └─ review status
~~~

## AI role

AI should only:

- pre-label visible objects;
- suggest likely observation categories;
- extract obvious text/signage if useful;
- flag uncertain frames for review.

AI should not infer underground route, sewer capacity, infiltration rate or future storm behaviour.

## Acceptance test

A user can complete a Rain Walk for one street in under five minutes and produce:

- at least five georeferenced observations;
- source media;
- timestamp;
- user-confirmed labels;
- explicit unknowns;
- one generated next-verification list.

## Nice-to-have

- repeat the same walk before and after rainfall;
- compare repeated walks;
- compute observation persistence, not a magic suitability score;
- privacy step for faces / licence plates before persistence or sharing.

---

# Hack 03 — Find the Disagreement

## Goal

Turn **conflicting sources** into a structured verification queue.

This should be mostly deterministic.

## MVP architecture

~~~
source A records
        +
source B records
        ↓
normalise entities / geometry / dates
        ↓
matching
        ↓
comparison rules
        ↓
conflict record
        ↓
possible explanations
        ↓
verification task
~~~

## First comparison types

### Presence conflict

~~~
official layer: no object
imagery review: visible object
→ POSSIBLE_MISSING_ASSET
~~~

### Classification conflict

~~~
land cover: sealed
current reviewed image: vegetated
→ POSSIBLE_LAND_COVER_CHANGE
~~~

### Recency conflict

~~~
image evidence older than threshold
→ STALE_VISUAL_EVIDENCE
~~~

### Observation conflict

~~~
terrain model: local low point
rain walk: repeated no ponding
→ MODEL_OBSERVATION_MISMATCH
~~~

## Matching architecture

Use the cheapest method that works:

1. exact shared ID;
2. same geometry / within tolerance;
3. same street segment;
4. semantic matching only as fallback.

Avoid LLM matching when spatial joins or IDs can solve it.

## Acceptance test

For one pilot street:

- compare at least two evidence sources;
- generate traceable conflict records;
- every conflict shows both sources and dates;
- no conflict automatically chooses a winner;
- each conflict produces a verification action.

## Nice-to-have

- rank tasks by cost / decision impact;
- group repeated conflicts into one field task;
- close a conflict when stronger evidence arrives.

---

# Recommended implementation order

## Slice A — evidence contract first

Implement the shared observation / conflict records and review states before any fancy model work.

## Slice B — Find the Disagreement

Build this first technically because most of it can be deterministic and can use existing repository data immediately.

## Slice C — Rain Walk

Build the capture flow next. It creates genuinely new observations and becomes a source for the discrepancy detector.

## Slice D — Find the Drain

Add AI-assisted object detection last, on top of the already-working observation/review pipeline.

This order avoids making the entire prototype depend on computer-vision quality.

---

# Integration with SpongeSquad

~~~
Data Charter
  ↓
what is open / gated / absent
  ↓
Data Hack Library
  ↓
candidate evidence + verification tasks
  ↓
Street X-Ray / Evidence Passport
  ↓
Street Lab
  ↓
intervention exploration
~~~

The Data Hack Library should never become a parallel truth store.

Its job is to **produce evidence candidates and verification tasks** that the Evidence Passport can accept, reject or escalate.
