import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

// Keep the untouched Higgsfield PNGs and alpha; only resize/encode for delivery.
const variants = { hero: [480, 960], workflow: [320, 640], contact: [240, 480] };
await mkdir('public/images/mascot', { recursive: true });
for (const [pose, widths] of Object.entries(variants)) {
  const input = `assets/mascot/originals/${pose}.png`;
  const meta = await sharp(input).metadata();
  const alpha = (await sharp(input).stats()).channels[3];
  if (!meta.hasAlpha || !alpha || alpha.min !== 0 || alpha.max === 0) {
    throw new Error(`${pose}: expected genuine transparent and visible pixels`);
  }
  for (const width of widths) {
    const output = `public/images/mascot/${pose}-${width}.webp`;
    await sharp(input).resize({ width, withoutEnlargement: true })
      .webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile(output);
    console.log(`${output}: ${Math.round((await stat(output)).size / 1024)} KiB`);
  }
}
