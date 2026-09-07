import { useState } from 'react';
import type { PipelineTitle } from 'shared/src/sonyActivation';
import { resolvePropertyAsset, propertyInitials } from './propertyAssets';

interface Props {
  /** Pictures Pipeline (CURRENT/FUTURE badges). */
  pictures: PipelineTitle[];
  /** PlayStation Catalog Anchors (no badge). */
  playstation: PipelineTitle[];
}

/**
 * HX-7H — compact Spider-Man pipeline title tiles: two labeled rows of three
 * equal-width tiles. Each tile shows a small poster (packaged WebP resolved by
 * propertyKey, object-fit: cover in a reserved frame) with a two-line title
 * clamp; Pictures titles carry a CURRENT/FUTURE badge. Deterministic, decorative
 * — no links, no hover-only content, no click behavior. A failed or unknown
 * asset falls back to fixed-size initials (never a broken-image icon).
 */
function Tile({ item, showBadge }: { item: PipelineTitle; showBadge: boolean }) {
  const asset = resolvePropertyAsset(item.propertyKey);
  const [failed, setFailed] = useState(false);
  const useImage = asset !== null && !failed;

  return (
    <div className="sony-tile" data-prop={item.propertyKey}>
      <span className="sony-tile-poster" aria-hidden={useImage ? undefined : 'true'}>
        {useImage ? (
          <img
            className="sony-tile-img"
            src={asset!.src}
            alt={asset!.alt}
            width={36}
            height={50}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
          />
        ) : (
          <span className="sony-tile-fallback">{propertyInitials(item.title)}</span>
        )}
      </span>
      <span className="sony-tile-title">{item.title}</span>
      {showBadge && item.status && (
        <span className={`sony-tile-badge sony-tile-badge-${item.status.toLowerCase()}`}>{item.status}</span>
      )}
    </div>
  );
}

export function PipelineTiles({ pictures, playstation }: Props) {
  return (
    <div className="sony-tiles">
      <div className="sony-tiles-group">
        <span className="sony-tiles-label">Pictures Pipeline</span>
        <div className="sony-tiles-row">
          {pictures.map((t) => (
            <Tile key={t.propertyKey} item={t} showBadge />
          ))}
        </div>
      </div>
      <div className="sony-tiles-group">
        <span className="sony-tiles-label">PlayStation Catalog Anchors</span>
        <div className="sony-tiles-row">
          {playstation.map((t) => (
            <Tile key={t.propertyKey} item={t} showBadge={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
