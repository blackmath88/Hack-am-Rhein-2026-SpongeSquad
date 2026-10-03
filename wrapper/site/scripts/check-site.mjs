// Checks every internal link, script, stylesheet, frame and inline module import in dist/*.html resolves to a built file.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const files = [];
const walk = (dir) => readdirSync(dir).forEach((n) => {
  const p = join(dir, n);
  if (statSync(p).isDirectory()) walk(p); else if (p.endsWith('.html')) files.push(p);
});
walk(dist);
const broken = [];
let checked = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g), ...html.matchAll(/\b(?:from|import)\s*\(?\s*['"](\.{1,2}\/[^'"]+)['"]/g)];
  for (const m of refs) {
    const url = m[1];
    if (/^(https?:|mailto:|data:|javascript:|about:|#|\{)/.test(url) || url.includes('${')) continue;
    const clean = url.split('#')[0].split('?')[0];
    if (!clean) continue;
    let target = clean.startsWith('/') ? join(dist, clean) : join(dirname(file), clean);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    checked++;
    if (!existsSync(target)) broken.push(`${relative(dist, file)} → ${url}`);
  }
}
// Wording guard for the website's own pages. Rendered research documents and passages wrapped in
// <!--quoted--> ... <!--/quoted--> are quoted as written and skipped.
const shellPages = files.filter((f) => !/[\/](research|team)[\/][^\/]+[\/]index\.html$/.test(f) && !/^wrapper[\/]/.test(relative(dist, f)) && !/basel-site-scoping-tool/.test(f));
const avoid = [
  [/gatekeeper/i, 'say "who to ask next"'],
  [/\bAI (finds|detects|knows)\b/i, 'AI explains and drafts; it does not find facts'],
  [/infiltration potential/i, 'infiltration is assessed by the AUE'],
  [/sponge score/i, 'no single sponge-city score'],
];
for (const file of shellPages) {
  const text = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<!--quoted-->[\s\S]*?<!--\/quoted-->/g, '').replace(/<[^>]+>/g, ' ');
  for (const [re, why] of avoid) if (re.test(text)) broken.push(`${relative(dist, file)} uses "${text.match(re)[0]}": ${why}`);
}
if (broken.length) {
  console.error(`Broken internal references (${broken.length}):\n  ${broken.join('\n  ')}`);
  process.exit(1);
}
console.log(`Website link check passed: ${checked} internal references in ${files.length} pages.`);
