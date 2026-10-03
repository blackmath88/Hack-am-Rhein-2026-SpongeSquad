# End-to-end integration branch

This branch joins Andy's site-scoping prototype to Achim's Street Lab without changing either contributor's source branch.

## Run

Install each app once:

```sh
npm ci --prefix data/site-scoping-tool
npm ci --prefix wrapper/street-workspace
```

Then start both development servers:

```sh
npm run dev
```

Open `http://localhost:5173/data/site-scoping-tool/`, choose a candidate and select **Explore in Street Lab**. A static deployable bundle can be produced with `npm run build`; its entry point is `dist/index.html`.

## Borrowed from Basel Spatial Graph

- **Normalize once, consume through a narrow contract.** The cross-app payload is versioned in `contracts/candidate-site-context.v1.schema.json`.
- **Keep structures optimized for their job.** The scoping model, street graph and simulation remain separate; the handoff references a candidate rather than merging models.
- **Carry provenance.** The handoff is explicitly `illustrative`, with evidence leads, missing data and a note about what was not transferred.
- **Separate prepared facts from dynamic calculations.** Candidate context is static input; the storm result is computed in Street Lab for the selected controls.
- **Degrade explicitly.** Street Lab still works without a payload and rejects malformed or unknown handoff versions.

We did not borrow the graph database, query language or backend. They solve a larger problem than this vertical slice requires.
