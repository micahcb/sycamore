#!/usr/bin/env node
'use strict';

const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname);

function prefixStream(stream, label) {
  return (data) => {
    const lines = String(data).trim().split('\n').filter(Boolean);
    for (const line of lines) {
      console.log(`[${label}] ${line}`);
    }
  };
}

const backend = spawn('npm', ['start'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, FORCE_COLOR: '1' },
});

const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(root, 'frontend'),
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, FORCE_COLOR: '1' },
});

backend.stdout.on('data', prefixStream(backend.stdout, 'api'));
backend.stderr.on('data', prefixStream(backend.stderr, 'api'));
frontend.stdout.on('data', prefixStream(frontend.stdout, 'frontend'));
frontend.stderr.on('data', prefixStream(frontend.stderr, 'frontend'));

backend.on('error', (err) => {
  console.error('[api] failed to start:', err.message);
});
frontend.on('error', (err) => {
  console.error('[frontend] failed to start:', err.message);
});

backend.on('exit', (code, signal) => {
  if (code != null && code !== 0) console.error('[api] exited with code', code);
  if (signal) console.error('[api] killed by signal', signal);
});
frontend.on('exit', (code, signal) => {
  if (code != null && code !== 0) console.error('[frontend] exited with code', code);
  if (signal) console.error('[frontend] killed by signal', signal);
});

function killAll() {
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);

console.log('Starting API (port 3001) and frontend (port 3000)...');
console.log('  API:       http://localhost:3001');
console.log('  Frontend:  http://localhost:3000');
console.log('Press Ctrl+C to stop both.\n');
