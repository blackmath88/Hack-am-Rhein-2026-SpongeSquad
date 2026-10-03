// Runs every module's own checks plus the website link check.
//   npm test   (expects a built dist/ for the link check; run npm run build first)
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const node = process.execPath;
const [major, minor] = process.versions.node.split('.').map(Number);
// Street Lab's own script uses --test-isolation=none (Node ≥ 23.6). Older Node 22 names it --experimental-test-isolation.
const isolation = major > 23 || (major === 23 && minor >= 6) ? '--test-isolation=none' : '--experimental-test-isolation=none';
const checks = [
  ['Street Lab model tests', node, ['--experimental-strip-types', '--no-warnings', '--test', isolation, 'test/model.test.ts'], 'wrapper/street-workspace'],
  ['Street Lab type-check', node, ['node_modules/typescript/bin/tsc', '--noEmit'], 'wrapper/street-workspace'],
  ['Site scoping type-check', node, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.json', '--noEmit', '--incremental', 'false'], 'basel-site-scoping-tool'],
  ['Data Charter build', node, ['scripts/build.mjs'], 'wrapper/data-charter-map'],
  ['Data Charter smoke test', node, ['scripts/smoke.mjs'], 'wrapper/data-charter-map'],
  ['Sponge catalogue validation', node, ['scripts/build-doc.mjs', '--check'], 'wrapper/sponge-catalogue'],
  ['Sponge Street prototype smoke test', node, ['smoke.mjs'], 'wrapper/prototypes/sponge-street'],
  ['Candidate → Street Lab adapter contract', node, ['--experimental-strip-types', '--no-warnings', 'scripts/test-adapter.mjs'], '.'],
  ['Website link check', node, ['scripts/check-site.mjs'], '.'],
];
const failed = [];
for (const [label, cmd, args, cwd] of checks) {
  if (label === 'Website link check' && !existsSync(join(root, 'dist/index.html'))) { failed.push(`${label} (no dist/, run npm run build)`); continue; }
  console.log(`\n▸ ${label}`);
  const r = spawnSync(cmd, args, { cwd: join(root, cwd), stdio: 'inherit' });
  if (r.status !== 0) failed.push(label);
}
console.log(failed.length ? `\nFailed: ${failed.join(', ')}` : '\nAll checks passed.');
process.exit(failed.length ? 1 : 0);
