import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const services = [
  {
    label: 'Shared shell',
    url: 'http://localhost:5172/',
    args: ['run', 'shell:dev'],
  },
  {
    label: 'Site scoping',
    url: 'http://localhost:5173/data/site-scoping-tool/',
    args: ['run', 'dev', '--prefix', 'data/site-scoping-tool', '--', '--host', '0.0.0.0', '--port', '5173', '--strictPort'],
  },
  {
    label: 'Street Lab',
    url: 'http://localhost:5174/wrapper/street-workspace/',
    args: ['run', 'dev', '--prefix', 'wrapper/street-workspace', '--', '--host', '0.0.0.0', '--port', '5174', '--strictPort'],
  },
  {
    label: 'Data Charter',
    url: 'http://localhost:5175/wrapper/data-charter-map/',
    args: ['run', 'dev', '--prefix', 'wrapper/data-charter-map'],
  },
];

const children = services.map(({ label, url, args }) => {
  console.log(`${label}: ${url}`);
  return spawn(npm, args, { stdio: 'inherit' });
});

function stop(signal) {
  for (const child of children) child.kill(signal);
}

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));

const exitCodes = await Promise.all(children.map((child) => new Promise((resolve) => {
  child.on('exit', (code) => resolve(code ?? 1));
})));
process.exit(exitCodes.find((code) => code !== 0) ?? 0);
