// Compress the raw files in each entry's originals/ folder into its media/ folder:
//   src/content/{projects,events}/<slug>/originals/  →  src/content/{projects,events}/<slug>/media/
//   src/content/profile/originals/                    →  src/content/profile/media/
//   photos → <name>.webp, max 2000px, quality 82
//   videos → <name>.mp4 (12 s max, fits in 1280x1280, no audio) + <name>.poster.webp (frame at 3 s)
// Also renders each public/cv/<name>.pdf to src/content/profile/media/<name>-<page>.webp (CV preview page).
// Only files whose output is missing or older than the original are processed.
// originals/ folders are git-ignored; media/ is committed.
// Usage: npm run media
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const PHOTO = /\.(jpe?g|png|webp|avif|heic|tiff?)$/i;
const VIDEO = /\.(mp4|mov|m4v|webm|mkv|avi)$/i;
const ROOT = 'src/content';

const entries = [
  ...['projects', 'events'].flatMap((kind) =>
    fs.readdirSync(path.join(ROOT, kind)).map((slug) => path.join(ROOT, kind, slug))),
  path.join(ROOT, 'profile'),
].filter((dir) => fs.existsSync(path.join(dir, 'originals')));

const newer = (a, b) => !fs.existsSync(b) || fs.statSync(a).mtimeMs > fs.statSync(b).mtimeMs;
const kb = (p) => Math.round(fs.statSync(p).size / 1024);
let done = 0;

for (const dir of entries) {
  const raw = path.join(dir, 'originals');
  const out = path.join(dir, 'media');
  fs.mkdirSync(out, { recursive: true });

  for (const f of fs.readdirSync(raw)) {
    const src = path.join(raw, f);
    const name = path.parse(f).name;
    let dest, entry;
    if (PHOTO.test(f)) {
      dest = path.join(out, `${name}.webp`);
      if (!newer(src, dest)) continue;
      await sharp(src).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 }).toFile(dest);
      entry = `- type: image\n    src: ${name}.webp`;
    } else if (VIDEO.test(f)) {
      dest = path.join(out, `${name}.mp4`);
      if (!newer(src, dest)) continue;
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-t', '12', '-vf', "scale='min(1280,iw)':'min(1280,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2", '-c:v', 'libx264',
        '-crf', '28', '-preset', 'slow', '-an', '-movflags', '+faststart', dest], { stdio: 'inherit' });
      const frame = execFileSync('ffmpeg', ['-loglevel', 'error', '-ss', '3', '-i', dest, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], { maxBuffer: 64 * 1024 * 1024 });
      await sharp(frame).webp({ quality: 82 }).toFile(path.join(out, `${name}.poster.webp`));
      entry = `- type: clip\n    src: ${name}.mp4`;
    } else {
      console.warn(`skipped ${src} (unknown type)`);
      continue;
    }
    done++;
    console.log(`${src} → ${dest}  (${kb(src)} KB → ${kb(dest)} KB)\n  ${entry}`);
  }
}
// CV previews: one image per PDF page.
const CV = 'public/cv';
const PROFILE_MEDIA = path.join(ROOT, 'profile', 'media');
for (const f of fs.readdirSync(CV).filter((f) => f.endsWith('.pdf'))) {
  const pdf = path.join(CV, f);
  const name = path.parse(f).name;
  if (!newer(pdf, path.join(PROFILE_MEDIA, `${name}-1.webp`))) continue;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-'));
  execFileSync('pdftoppm', ['-r', '200', '-png', pdf, path.join(tmp, 'p')]);
  for (const page of fs.readdirSync(tmp)) {
    const n = Number(page.match(/(\d+)\.png$/)[1]);
    await sharp(path.join(tmp, page)).webp({ quality: 90 }).toFile(path.join(PROFILE_MEDIA, `${name}-${n}.webp`));
  }
  fs.rmSync(tmp, { recursive: true });
  done++;
  console.log(`${pdf} → ${PROFILE_MEDIA}/${name}-<page>.webp`);
}

console.log(done ? `${done} file(s) compressed.` : 'Nothing to do: drop raw files in src/content/<projects|events>/<slug>/originals/.');
