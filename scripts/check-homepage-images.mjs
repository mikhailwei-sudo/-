// Static QA for the home page's editorial imagery. Node.js, no dependencies or network.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const js = read('tea-home-editorial.js');
const css = read('tea-home-editorial.css');
const errors = [];

const section = (from, to) => {
  const start = js.indexOf(from);
  const end = js.indexOf(to, start);
  if (start < 0 || end < 0) throw new Error('Cannot find JS section: ' + from);
  return js.slice(start, end);
};

const covers = [...section('const entries = [', 'const nav =').matchAll(/img:'([^']+)'/g)].map(m => m[1]);
const stages = [...section('const stageHtml=[', 'const el=document.createElement').matchAll(/\['step[123]','([^']+)'\]/g)].map(m => m[1]);
const artwork = [...section('<figure class="eh-artwork', "'</div></section>+'").matchAll(/<figure class="eh-artwork[^>]+><img src="([^"]+)"/g)].map(m => m[1]);
const photos = [...covers, ...stages, ...artwork];
if (covers.length !== 3 || stages.length !== 3 || artwork.length !== 3) errors.push('Expected 3 covers + 3 stage illustrations + 3 hero photos');
if (new Set(photos).size !== photos.length) errors.push('Repeated photo in editorial home: ' + photos.join(', '));
for (const path of [...photos, 'game-assets/nik-portrait.png', 'game-assets/chaer-portrait.png']) {
  if (/^(?:https?:)?\/\//.test(path)) errors.push('Not local: ' + path);
  if (!existsSync(resolve(root, path))) errors.push('Missing asset: ' + path);
  if (path.endsWith('.webp') && !existsSync(resolve(root, path.replace(/\.webp$/, '.jpg')))) errors.push('Missing JPEG fallback for: ' + path);
}
if (/CMIT2026_submission\/|game-assets\/(?:nik|chaer)\.svg/.test(js)) errors.push('Homepage still uses QA screenshots or simplified mascots');
if (/route-05\.webp/.test(css)) errors.push('Hero background repeats waypoint photograph route-05.webp');
if (!js.includes("gameScene:'ЧАЙНЫЙ КВЕСТ") || !js.includes("gameScene:'TEA QUEST")) errors.push('Game card missing translations');
if (errors.length) {
  console.error(errors.map(error => 'FAIL: ' + error).join('\n'));
  process.exitCode = 1;
} else {
  console.log('PASS: nine unique editorial photos, original mascots, all assets local, JPEG fallbacks available.');
}
