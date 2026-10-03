# Data Hack Library — architecture direction

## Architectural principle

The library should be a **small evidence-production layer**, not another mapping application.

~~~
sources
  ↓
adapters
  ↓
evidence candidates
  ↓
review / validation
  ↓
accepted evidence + unresolved tasks
  ↓
Street Evidence Passport
~~~

The common abstraction is a **Hack Runner**:

~~~
HackDefinition
  + SiteContext
  + SourceEvidence[]
        ↓
      execute
        ↓
HackResult
  ├─ candidate_evidence[]
  ├─ conflicts[]
  ├─ tasks[]
  └─ diagnostics[]
~~~

This can remain conceptual during the hackathon. The important design decision is that hacks emit the same family of outputs.

---

## Suggested module boundary

~~~
data-hack-library/
  definitions/
    find-the-drain
    rain-walk
    find-the-disagreement

  contracts/
    source-evidence
    candidate-evidence
    conflict
    verification-task

  runners/
    deterministic
    vision
    capture

  review/
    review-state-machine
    reviewer-actions

  adapters/
    data-charter
    imagery
    rain-walk
    street-xray

  ui/
    library
    hack-detail
    review-queue
~~~

Do not build this entire directory layout until the prototype needs code reuse; it is the target separation of concerns.

---

## Core contracts

### SourceEvidence

Something the system was given, for example:

- OGD feature;
- image;
- field observation;
- PDF citation;
- operator response.

Required ideas: source ID, source type, date, provenance, geometry/site reference, access/evidence class.

### CandidateEvidence

A derived observation that has not yet become authoritative.

Required ideas: candidate ID, hack ID, source evidence IDs, claim, confidence/uncertainty, review state, limitations, location uncertainty.

### Conflict

A disagreement between two evidence items.

Required ideas: both inputs, conflict type, why it was flagged, possible explanations, unresolved/resolved state.

### VerificationTask

The cheapest useful next action.

Examples:

- review image;
- take second photo;
- field visit;
- request cadastral extract;
- ask operator;
- run soil test.

Required ideas: question being resolved, action, expected evidence, gatekeeper, effort class, decision blocked.

---

## Review state machine

~~~
candidate
  ├─→ rejected
  ├─→ image_reviewed
  │      ├─→ field_observed
  │      │      └─→ authority_confirmed
  │      └─→ needs_field_check
  └─→ unknown
~~~

Do not force every item to authority confirmation. The required state depends on the decision.

Examples:

- explanatory map → image reviewed may be enough;
- intervention layout → field observed may be required;
- excavation clearance → authority/operator confirmation required.

---

## Model boundary

AI is an optional adapter inside the architecture.

~~~
deterministic first
   ↓ unresolved visual / semantic task
bounded model call
   ↓
typed candidate
   ↓
validation
~~~

Use deterministic software for file handling, IDs, timestamps, geometry, spatial joins, source comparison, state transitions and task routing.

Use AI for visual object suggestions, bounded image classification, messy-document extraction and observation-label suggestions.

Do not use AI as source of truth, whole-workflow planner, hidden confidence calculator or authority on underground infrastructure.

---

## Storage

For the hackathon, JSON is enough.

~~~
data/
  sources/
  candidates/
  conflicts/
  tasks/
  sessions/
~~~

Every record should be versioned enough that the demo can explain:

> "This candidate came from these two images on this date, was reviewed by a person, and still needs operator confirmation."

A database is unnecessary until multiple users or concurrent workflows require one.

---

## Spatial strategy

Use a shared site ID / street-segment identifier as the primary join.

Prefer:

1. exact shared site ID;
2. geometry intersection;
3. nearest feature within an explicit tolerance.

Never silently snap evidence across large distances. Every inferred point should be able to carry an uncertainty radius.

---

## UI architecture

The existing prototype remains the catalogue.

Add later:

### Library
What hacks exist?

### Run
What inputs does this hack need for this site?

### Review queue
Which candidate observations need a human decision?

### Verification queue
What field/gatekeeper actions remain?

### Evidence Passport handoff
Which reviewed records are ready to appear in Street X-Ray?

The strongest demo path is:

~~~
select street
→ see evidence gap
→ run/inspect one hack
→ review candidate
→ generate verification task
→ return to Evidence Passport
~~~

---

## Definition of done

The architecture is sufficient when:

- all three hacks can emit the same basic evidence/task structures;
- every derived result points back to source evidence;
- every result has an explicit status;
- unsupported engineering conclusions stay unknown;
- validation can strengthen evidence without overwriting provenance;
- Street X-Ray can consume reviewed evidence without knowing how it was produced.
