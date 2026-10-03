# Data Hack Library prototype

A small standalone prototype for SpongeSquad's **data-gap → evidence → gatekeeper → next action** pattern.

The library deliberately does **not** treat AI output as authoritative city data. Each hack creates candidate evidence with provenance, uncertainty, validation and an explicit limit.

## Prototype hacks

1. **Find the Drain** — detect visible drainage clues in imagery and turn them into review / field tasks.
2. **Rain Walk** — guided street observation before or after rain to create current, human-confirmed evidence.
3. **Find the Disagreement** — compare two imperfect sources and turn conflicts into verification tasks instead of conclusions.

## Shared card contract

Each hack describes:

- data gap;
- hack / method;
- inputs;
- candidate output;
- confidence / uncertainty;
- validation;
- gatekeeper;
- explicit limit;
- next action.

## Execution design

- [Execution plans](EXECUTION-PLANS.md) — MVP pipeline, acceptance tests and implementation order for each hack.
- [Architecture](ARCHITECTURE.md) — shared evidence contracts, review state machine, model boundary and integration with Street X-Ray.

## Run

Serve this directory with any static web server, for example:

```bash
python3 -m http.server 8080 -d wrapper/prototypes/data-hack-library
```

Then open `http://localhost:8080/`.

The prototype is intentionally dependency-free so it can be reviewed or integrated without adding another build system.
