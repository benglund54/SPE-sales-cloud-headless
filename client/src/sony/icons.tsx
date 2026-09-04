/**
 * Inline SVG icons for the reference-exact shells. No downloaded assets, fonts,
 * or logos — all are simple accessible inline SVGs drawn with CSS currentColor
 * so they inherit each shell's palette. Brand marks are geometric approximations
 * (not official logo files) sufficient for immediate app recognition.
 */
import type { CSSProperties } from 'react';

interface IconProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const base = (size: number): CSSProperties => ({ width: size, height: size, display: 'block' });

/* ---- Supplied brand logos (real PNGs in /logos, transparency preserved) --- */
/* Served from client/public/logos by Vite at the site root. Not redrawn,
   stretched, or distorted — object-fit: contain, square box. */
function LogoImg({ src, alt, size, className, style }: IconProps & { src: string; alt: string }) {
  const s = size ?? 20;
  return (
    <img
      src={src}
      alt={alt}
      width={s}
      height={s}
      className={className}
      style={{ width: s, height: s, objectFit: 'contain', display: 'block', ...style }}
    />
  );
}
export function SlackLogo(p: IconProps) {
  return <LogoImg src="/logos/slack.png" alt="Slack" {...p} />;
}
export function TeamsLogo(p: IconProps) {
  return <LogoImg src="/logos/teams.png" alt="Microsoft Teams" {...p} />;
}
export function ClaudeLogo(p: IconProps) {
  return <LogoImg src="/logos/claude.png" alt="Claude" {...p} />;
}
export function SonyLogo(p: IconProps) {
  return <LogoImg src="/logos/sony.png" alt="Sony" {...p} />;
}
export function SlackbotLogo(p: IconProps & { alt?: string }) {
  const { alt, ...rest } = p;
  return <LogoImg src="/logos/slackbot.webp" alt={alt ?? 'Slackbot'} {...rest} />;
}

/* ---- Generic UI glyphs (stroke, currentColor) ------------------------- */
export function SearchIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
export function ChevronLeft({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
export function ChevronRight({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
export function ClockIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
export function HelpIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 1.75-2 3" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </svg>
  );
}
export function PlusIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
export function SendIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

/* ---- Sony IP360 Advisor app identity (distinct from Slack/Teams logos) --- */
/** Connected-nodes mark for the Sony IP360 Advisor app avatar. */
export function SonyAdvisorMark({ size = 22, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <defs>
        <linearGradient id="ip360grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5b8def" />
          <stop offset="100%" stopColor="#8b6cf0" />
        </linearGradient>
      </defs>
      <circle cx="6" cy="7" r="2.4" fill="url(#ip360grad)" />
      <circle cx="17.5" cy="6" r="2.1" fill="url(#ip360grad)" opacity="0.85" />
      <circle cx="12" cy="17" r="2.6" fill="url(#ip360grad)" />
      <path d="M6 7 12 17 17.5 6" stroke="url(#ip360grad)" strokeWidth="1.4" fill="none" opacity="0.7" />
    </svg>
  );
}

/* ---- Slack rail / sidebar glyphs -------------------------------------- */
/** Slack four-color hash mark (geometric approximation). */
export function SlackMark({ size = 20, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path fill="#36C5F0" d="M9 3.2a1.9 1.9 0 1 0 0 3.8h1.9V5.1A1.9 1.9 0 0 0 9 3.2z" />
      <path fill="#2EB67D" d="M20.8 9a1.9 1.9 0 1 0-3.8 0v1.9h1.9A1.9 1.9 0 0 0 20.8 9z" />
      <path fill="#ECB22E" d="M15 20.8a1.9 1.9 0 1 0 0-3.8h-1.9v1.9A1.9 1.9 0 0 0 15 20.8z" />
      <path fill="#E01E5A" d="M3.2 15a1.9 1.9 0 1 0 3.8 0v-1.9H5.1A1.9 1.9 0 0 0 3.2 15z" />
      <path fill="#36C5F0" d="M8.9 8.9h6.2v6.2H8.9z" opacity="0.85" />
    </svg>
  );
}
export function HomeIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z" />
    </svg>
  );
}
export function ChatBubbleIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
    </svg>
  );
}
export function BellIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}
export function DotsIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}
export function ThreadsIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M22 12a10 10 0 1 1-4.5-8.4" /><path d="M22 4v5h-5" />
    </svg>
  );
}
export function HeadphonesIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="2.5" y="13" width="4" height="6" rx="1.5" /><rect x="17.5" y="13" width="4" height="6" rx="1.5" />
    </svg>
  );
}
export function RecapIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M4 5h16M4 12h10M4 19h16" /><circle cx="18" cy="12" r="2.5" />
    </svg>
  );
}
export function DirectoryIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2" /><line x1="9" y1="4" x2="9" y2="20" />
    </svg>
  );
}
export function StarIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z" />
    </svg>
  );
}
export function ComposeIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}
export function GearIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

/* ---- Teams rail glyphs ------------------------------------------------ */
/** Microsoft Teams "T" mark (geometric approximation, brand purple). */
export function TeamsMark({ size = 22, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="17.5" cy="5.5" r="2.5" fill="#5b5fc7" />
      <rect x="10" y="8" width="11" height="11" rx="2.5" fill="#7b83eb" />
      <rect x="2.5" y="6.5" width="10" height="12" rx="2" fill="#5b5fc7" />
      <text x="7.5" y="15.4" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff" fontFamily="Segoe UI, Arial, sans-serif">T</text>
    </svg>
  );
}
export function TeamsChatIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M20 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3v3l4-3h9a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    </svg>
  );
}
export function VideoIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m22 8-6 4 6 4V8z" />
    </svg>
  );
}
export function PeopleIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.4" opacity="0.7" />
    </svg>
  );
}

/* ---- Claude glyphs ---------------------------------------------------- */
/** Claude sunburst mark (Anthropic-style radial), brand orange. */
export function ClaudeMark({ size = 20, className, style }: IconProps) {
  const rays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
  return (
    <svg viewBox="0 0 24 24" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      {rays.map((deg) => (
        <rect key={deg} x="11.2" y="3" width="1.6" height="7" rx="0.8" fill="#d97757" transform={`rotate(${deg} 12 12)`} />
      ))}
    </svg>
  );
}
export function CoworkIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <line x1="4" y1="7" x2="14" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="12" y2="17" />
    </svg>
  );
}
export function CodeIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" />
    </svg>
  );
}
export function FolderIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
export function ArtifactIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" /><path d="M12 3v18" /><path d="m4 7.5 8 4.5 8-4.5" />
    </svg>
  );
}
