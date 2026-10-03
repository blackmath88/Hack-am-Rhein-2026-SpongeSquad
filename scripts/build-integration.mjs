import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const apps = [
  ['data/site-scoping-tool', 'data/site-scoping-tool'],
  ['wrapper/street-workspace', 'wrapper/street-workspace'],
  ['wrapper/data-charter-map', 'wrapper/data-charter-map'],
];
const workstreamPages = [
  'frontend',
  'data',
  'explainer-videos-context',
  'presentation-story',
  'wrapper',
];
const shellOnly = process.argv.includes('--shell-only');

if (!shellOnly) {
  for (const [source] of apps) {
    const result = spawnSync(npm, ['run', 'build', '--prefix', source], {
      cwd: root,
      stdio: 'inherit',
    });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}

const output = join(root, 'dist');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(join(root, 'integration/index.html'), join(output, 'index.html'));
cpSync(join(root, 'integration/assets'), join(output, 'assets'), { recursive: true });
for (const page of workstreamPages) {
  const destination = join(output, page);
  mkdirSync(destination, { recursive: true });
  cpSync(join(root, page, 'index.html'), join(destination, 'index.html'));
}
if (!shellOnly) {
  for (const [source, target] of apps) {
    const destination = join(output, target);
    mkdirSync(destination, { recursive: true });
    cpSync(join(root, source, 'dist'), destination, { recursive: true });
  }
}
cpSync(
  join(root, 'wrapper/prototypes/sponge-street'),
  join(output, 'wrapper/prototypes/sponge-street'),
  { recursive: true },
);
cpSync(
  join(root, 'wrapper/street-xray'),
  join(output, 'wrapper/street-xray'),
  { recursive: true },
);
console.log(`Integrated static build: ${output}`);
