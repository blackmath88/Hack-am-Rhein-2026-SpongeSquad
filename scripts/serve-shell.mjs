import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.SHELL_PORT || 5172);
const redirects = [
  ['/data/site-scoping-tool', 5173],
  ['/wrapper/street-workspace', 5174],
  ['/wrapper/data-charter-map', 5175],
];
const pages = new Map([
  ['/', 'integration/index.html'],
  ['/frontend/', 'frontend/index.html'],
  ['/data/', 'data/index.html'],
  ['/explainer-videos-context/', 'explainer-videos-context/index.html'],
  ['/presentation-story/', 'presentation-story/index.html'],
  ['/wrapper/', 'wrapper/index.html'],
  ['/wrapper/prototypes/sponge-street/', 'wrapper/prototypes/sponge-street/index.html'],
]);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const redirect = redirects.find(([prefix]) => url.pathname.startsWith(prefix));
  if (redirect) {
    response.writeHead(302, { Location: `http://localhost:${redirect[1]}${url.pathname}${url.search}` }).end();
    return;
  }

  let relative = pages.get(url.pathname);
  if (!relative && url.pathname.startsWith('/assets/')) {
    relative = join('integration', url.pathname);
  }
  if (!relative && url.pathname.startsWith('/wrapper/prototypes/sponge-street/')) {
    relative = url.pathname.slice(1);
  }
  if (!relative) {
    response.writeHead(404).end('Not found');
    return;
  }

  const file = normalize(join(root, relative));
  if (!file.startsWith(root)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Shared shell: http://localhost:${port}/`);
});
