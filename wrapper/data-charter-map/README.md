# Data Charter map

Port of Claude's `blackmath88/sponge-city` Data Charter solution into the integration wrapper.

Source branch: `feat/data-charter-map`  
Source commit: `99ee7f669f49cf834bdd533afcc39c5057d1f5e0`

The module keeps three things separate:

- published evidence and official models;
- explicitly inferred values with their methods;
- restricted or missing inputs and the corresponding open-data ask.

## Run

```bash
npm run dev --prefix wrapper/data-charter-map
```

Open `http://localhost:5175/wrapper/data-charter-map/`.

## Verify and refresh

```bash
npm test --prefix wrapper/data-charter-map
npm run fetch --prefix wrapper/data-charter-map
```

`fetch` calls the live Basel APIs, replaces the snapshot and reruns the build and smoke test. The checked-in snapshot keeps the demo reproducible without those point-data API calls; WMS/WMTS map layers still require internet access.

## Integration boundary

The charter describes city-wide data availability. It does not directly populate Street Lab. A future adapter may transfer a site-specific evidence claim only when it declares its method, inputs, validation, permitted use and limitations.
