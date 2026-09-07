/**
 * HX-7H — fixed allowlist mapping each stable Salesforce external key
 * (`propertyKey`) to LOCAL packaged artwork + accessible alt text.
 *
 * The Headless browser NEVER receives an authenticated Salesforce Files URL,
 * record ID, or `imageUrl`. Artwork is resolved here from a closed allowlist —
 * paths are never constructed from unvalidated input. Alt text is the plain
 * title with no release year (the executive brief forbids year strings).
 */
export interface PropertyAsset {
  /** Root-relative path to the packaged 96×128 WebP (served from public/). */
  src: string;
  /** Accessible alt text — plain title, no year. */
  alt: string;
}

const PROPERTY_ASSETS: Readonly<Record<string, PropertyAsset>> = Object.freeze({
  'PROP-BND': { src: '/assets/properties/PROP-BND.webp', alt: 'Spider-Man: Brand New Day' },
  'PROP-SPIDER-NOIR': { src: '/assets/properties/PROP-SPIDER-NOIR.webp', alt: 'Spider-Noir' },
  'PROP-BTSV': { src: '/assets/properties/PROP-BTSV.webp', alt: 'Spider-Man: Beyond the Spider-Verse' },
  'PROP-MSM': { src: '/assets/properties/PROP-MSM.webp', alt: 'Marvel’s Spider-Man' },
  'PROP-MSM2': { src: '/assets/properties/PROP-MSM2.webp', alt: 'Marvel’s Spider-Man 2' },
  'PROP-MSMM': { src: '/assets/properties/PROP-MSMM.webp', alt: 'Marvel’s Spider-Man: Miles Morales' },
});

/** Resolve a propertyKey to its packaged asset, or null when unknown (→ fallback). */
export function resolvePropertyAsset(propertyKey: string): PropertyAsset | null {
  return Object.prototype.hasOwnProperty.call(PROPERTY_ASSETS, propertyKey)
    ? PROPERTY_ASSETS[propertyKey]
    : null;
}

/** Two-letter-ish initials for the fixed-size fallback tile (no image). */
export function propertyInitials(title: string): string {
  const words = title.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
