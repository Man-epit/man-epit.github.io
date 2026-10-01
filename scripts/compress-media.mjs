// Compress raw media from inbox/<slug>/ into src/assets/media/<slug>/.
//   photos → <name>.webp, max 2000px, quality 82
//   videos → <name>.mp4 (12 s max, 1280px wide, no audio) + <name>.poster.webp (frame at 3 s)
// Originals are moved to originals/<slug>/ (both folders are git-ignored).
// Usage: npm run media
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const PHOTO = /\.(jpe?g|png|webp|avif|heic|tiff?)$/i;
const VIDEO = /\.(mp4|mov|m4v|webm|mkv|avi)$/i;
const inbox = 'inbox';

if (!fs.existsSync(inbox)) {
  console.log('Nothing to do: create inbox/<slug>/ and drop files in it.');
  process.exit(0);
}

for (const slug of fs.readdirSync(inbox)) {
  const dir = path.join(inbox, slug);
  if (!fs.statSync(dir).isDirectory()) continue;
  const out = path.join('src/assets/media', slug);
  const keep = path.join('originals', slug);
  fs.mkdirSync(out, { recursive: true });
  fs.mkdirSync(keep, { recursive: true });

  for (const f of fs.readdirSync(dir)) {
    const src = path.join(dir, f);
    const name = path.parse(f).name;
    let entry;
    if (PHOTO.test(f)) {
      await sharp(src).rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 }).toFile(path.join(out, `${name}.webp`));
      entry = `- type: image\n    src: ${name}.webp`;
    } else if (VIDEO.test(f)) {
      const mp4 = path.join(out, `${name}.mp4`);
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-t', '12', '-vf', 'scale=1280:-2', '-c:v', 'libx264',
        '-crf', '28', '-preset', 'slow', '-an', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
      const frame = execFileSync('ffmpeg', ['-loglevel', 'error', '-ss', '3', '-i', mp4, '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], { maxBuffer: 64 * 1024 * 1024 });
      await sharp(frame).webp({ quality: 82 }).toFile(path.join(out, `${name}.poster.webp`));
      entry = `- type: clip\n    src: ${name}.mp4`;
    } else {
      console.warn(`skipped ${src} (unknown type)`);
      continue;
    }
    fs.renameSync(src, path.join(keep, f));
    const kb = (p) => Math.round(fs.statSync(p).size / 1024);
    console.log(`${src} → ${out}/  (${kb(path.join(keep, f))} KB → ${kb(path.join(out, entry.split('src: ')[1]))} KB)\n  ${entry}`);
  }
  fs.rmdirSync(dir);
}
