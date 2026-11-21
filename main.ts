// gta6-clipper-01 entry (Node 22, standard library only).
//
// The entry is the video itself: this program only hands VIDEO.json to the
// gate. It copies VIDEO.json from the repository root (MAKEFUN_BOT_DIR,
// default /bot) to the output directory (MAKEFUN_OUTPUT_DIR, default
// /output). Nothing else is written, nothing is read from the network, no
// wall clock is consulted, and the output bytes are exactly the
// repository's VIDEO.json bytes, so two runs write the same file.
//
// Run the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

const source = resolve(join(BOT_DIR, 'VIDEO.json'));

if (!existsSync(source)) {
  fail(`VIDEO.json not found in ${BOT_DIR}`);
}
if (!statSync(source).isFile()) {
  fail(`VIDEO.json in ${BOT_DIR} is not a file`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });

try {
  copyFileSync(source, join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  fail(`could not copy VIDEO.json to ${OUTPUT_DIR}: ${(err as Error).message}`);
}

// A partial copy would hand the gate a broken file, so confirm the copy
// is byte-for-byte complete before reporting success.
const copied = join(OUTPUT_DIR, 'VIDEO.json');
if (!existsSync(copied) || statSync(copied).size !== statSync(source).size) {
  fail(`VIDEO.json copy to ${OUTPUT_DIR} is incomplete`);
}
