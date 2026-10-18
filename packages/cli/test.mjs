// One end-to-end check: init + add against the local registry in a throwaway app (no network, no install).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const cli = fileURLToPath(new URL('./bin/uix-ui.mjs', import.meta.url));
const registry = fileURLToPath(new URL('../../registry/r', import.meta.url));

test('init + add write a themed, alias-free setup', () => {
  const app = mkdtempSync(join(process.env.TMPDIR ?? tmpdir(), 'uix-ui-test-'));
  mkdirSync(join(app, 'src'));
  writeFileSync(join(app, 'package.json'), JSON.stringify({ dependencies: { tailwindcss: '^4.1.0' } }));
  writeFileSync(join(app, 'index.html'), '<html><head>\n  </head><body></body></html>');
  const run = (...a) => execFileSync('node', [cli, ...a, '--no-install'], { cwd: app, encoding: 'utf8' });

  run('init', '--preset', 'beetroot-harrow', '--registry', registry);
  assert.match(readFileSync(join(app, 'src/index.css'), 'utf8'), /@import "tailwindcss";\n@import "\.\/styles\/uix\.css";/);
  assert.match(readFileSync(join(app, 'src/styles/uix.css'), 'utf8'), /Beetroot Harrow/);
  assert.match(readFileSync(join(app, 'index.html'), 'utf8'), /family=Familjen\+Grotesk/);
  const cfg = JSON.parse(readFileSync(join(app, 'components.json'), 'utf8'));
  assert.equal(cfg.registries['@uix'], `${registry}/{name}.json`);

  const out = run('add', 'alert');
  assert.match(out, /Install: npm install clsx tailwind-merge class-variance-authority/);
  const alert = readFileSync(join(app, 'src/components/ui/alert.tsx'), 'utf8');
  assert.ok(alert.includes('from "../../lib/utils"') && alert.includes('from "./icons"') && !alert.includes('"@/'));
  assert.ok(existsSync(join(app, 'src/components/ui/icons.tsx')));

  run('theme', 'uix');
  assert.doesNotMatch(readFileSync(join(app, 'src/styles/uix.css'), 'utf8'), /Beetroot/);
  assert.equal(readFileSync(join(app, 'index.html'), 'utf8').match(/uix-fonts -->/g).length, 2, 'fonts block replaced, not duplicated');
});
