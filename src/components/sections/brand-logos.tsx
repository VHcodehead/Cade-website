import { readdirSync } from 'node:fs';
import path from 'node:path';
import { BrandLogosMarquee, type LogoItem } from './brand-logos-marquee';

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg']);

/**
 * Known pre-rendered brand logos in /public/assets/brands/.
 * These need the brightness-invert treatment (white === true) or are
 * already colour-correct (white === false).
 */
const KNOWN_BRAND_FLAGS: Record<string, boolean> = {
  'nike.png': true,
  'disney.png': true,
  'lululemon.png': true,
  'chase.png': false,
  'columbia.png': true,
  'bfgoodrich.png': false,
  'kith.png': true,
  'brex.png': true,
  'bronner.png': false,
  'oldnavy.png': false,
};

function humanName(filename: string): string {
  const base = path.basename(filename, path.extname(filename));
  // strip trailing timestamp added by uploadLogo (e.g. "-1711234567890")
  const cleaned = base.replace(/-\d{10,}$/, '');
  // convert hyphens/underscores to spaces, then title-case
  return cleaned
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function scanBrandLogos(): LogoItem[] {
  const brandsDir = path.join(process.cwd(), 'public', 'assets', 'brands');
  try {
    return readdirSync(brandsDir)
      .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .map((f) => ({
        name: humanName(f),
        src: `/assets/brands/${f}`,
        white: KNOWN_BRAND_FLAGS[f] ?? false,
      }));
  } catch {
    return [];
  }
}

function scanUploadedLogos(): LogoItem[] {
  const uploadsDir = '/tmp/uploads/logos';
  try {
    return readdirSync(uploadsDir)
      .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .map((f) => ({
        name: humanName(f),
        src: `/api/uploads/logos/${f}`,
        white: false,
      }));
  } catch {
    return [];
  }
}

export async function BrandLogos() {
  const preRendered = scanBrandLogos();
  const uploaded = scanUploadedLogos();

  // Deduplicate: if an uploaded logo has the same base name as a
  // pre-rendered one we keep the pre-rendered version (better quality).
  const preRenderedBases = new Set(
    preRendered.map((l) => path.basename(l.src))
  );
  const deduped = uploaded.filter(
    (l) => !preRenderedBases.has(path.basename(l.src))
  );

  const allLogos = [...preRendered, ...deduped];

  return <BrandLogosMarquee logos={allLogos} />;
}
