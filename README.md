# SpongeSquad · Make Basel a Sponge

Hack am Rhein 2026. One website that connects the team's work into a single demo:

```text
landing → FIND → UNDERSTAND → DESIGN → TEST → SEE → DECIDE
                  + Sources & Research   + Team
```

## Start

Requires Node.js 22.18 or newer and npm. The first run needs network access to install dependencies.

```sh
npm start
```

Open **http://localhost:4173/**. The command installs any missing module dependencies (`npm ci` per app), builds every module, and serves the result. Use `PORT=8080 npm start` for another port.

| Command | What it does |
| --- | --- |
| `npm start` | Install if needed, build everything, serve `dist/` |
| `npm run build` | Install if needed and build everything into `dist/` |
| `npm run build:shell` | Rebuild only the shell pages and documents (modules must be built once) |
| `npm run preview` | Serve an existing `dist/` |
| `npm test` | Every module's checks plus the website link check |

`dist/` is a static folder with relative links only. It can be copied to any static host or subpath. Nothing is deployed automatically.

## Website map

| Route | Content | Source |
| --- | --- | --- |
| `/` | Problem, entry into the demo, status, workstreams | `integration/index.html` |
| `/find/` | Stage page with Andy's site-scoping tool embedded | `integration/find/` + `basel-site-scoping-tool/` |
| `/understand/` | Candidate evidence, unknowns, city-wide data, gatekeepers | `integration/understand/` |
| `/lab/#design`, `#test`, `#see` | Stage explanations around the running Street Lab | `integration/lab/` + `wrapper/street-workspace/` |
| `/decide/` | Actors, missing evidence, investigations, participation | `integration/decide/` |
| `/research/` | Sources & Research hub and rendered documents | `integration/research/`, `research/`, `wrapper/**/docs/` |
| `/team/` | Workstreams, weekend plan, Observatory status, records, how to contribute | `integration/team/`, `team/` |
| `/frontend/`, `/data/`, `/explainer-videos-context/`, `/presentation-story/`, `/wrapper/` | One page per workstream | `<folder>/index.html` |
| `/basel-site-scoping-tool/`, `/wrapper/street-workspace/`, `/wrapper/data-charter-map/`, `/wrapper/prototypes/sponge-street/` | The built modules, full screen | their folders |
| `/view/?m=street-xray`, `/view/?m=rain-walk`, `/view/?m=sponge-street`, `/view/?m=data-charter` | Standalone modules shown with the site header | `integration/view/` |
| `/wrapper/street-xray/`, `/wrapper/street-workspace/rain-walk/` | Street X-Ray evidence gate and Rain Walk campaign, full screen | `wrapper/street-xray/`, `wrapper/street-workspace/public/rain-walk/` |

## Where to change things

- **Routes, stages, workstream status and module builds:** `integration/routes.json`. It is the single configuration file; navigation and the build both read it.
- **Shared look:** `integration/assets/site.css` and `site.js`.
- **Your workstream page:** your folder's `index.html`. Replace the template freely and keep the header and footer slots. Then set your `status` in `integration/routes.json`.
- **Candidate → Street Lab handoff:** `integration/assets/street-lab-adapter.js`. It follows `integration/contracts/candidate-site-context.v1.schema.json`, which the Street Lab validates.

## Evidence rules for contributors

- Keep measured, derived, assumed, illustrative and unknown values distinguishable.
- Never turn an area score into street geometry, soil or drainage values.
- Unknown never silently becomes good, zero or safe.
- State a Basel procedure only when a Basel source supports it.

## Workstreams

See [WORKSTREAMS.md](WORKSTREAMS.md). Andy's `basel-site-scoping-tool/` is built and shown unchanged; the website reads its candidate fixture at build time without modifying it.

## Imported material

The research library, resource catalogue and weekend plan come from the team's earlier repository. See [research/MIGRATION.md](research/MIGRATION.md) for source commit and destinations.

## Build notes

- Each app keeps its own `package.json` and lockfile. The root has no dependencies.
- Apps are built with a relative base (`./`) instead of the absolute bases in their own Vite configs, so the site works under any subpath. Each app's own `npm run dev` is unchanged.
- The Street Lab is built with Rollup tree-shaking off. Rollup 4.64, pinned by its lockfile, otherwise takes several minutes on this app; the bundle grows by about 0.1 %.
- Street X-Ray uses absolute links to `/` for its brand link, so it expects the site at the domain root; everything else works under a subpath.
- The Street Lab's own `npm test` script needs Node 23.6 or newer. `npm test` at the root picks the matching flag for Node 22.
