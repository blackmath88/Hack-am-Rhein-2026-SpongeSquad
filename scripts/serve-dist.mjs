import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4173);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

createServer(async (request, response) => {
  let path = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(root, path));
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
  console.log(`Integrated preview: http://localhost:${port}/`);
});
