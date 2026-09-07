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
/**
 * Claude activity mark for the ACTIVE Thinking / Writing indicator only.
 * Uses the supplied genuinely-animated orange starburst GIF directly (682
 * frames, infinite loop) — no CSS animation is applied on top. Under reduced
 * motion, callers pass `static` to swap to the still supplied starburst
 * (claude-star.png), which does not move.
 */
export function ClaudeThinkingMark({ static: isStatic, alt, ...p }: IconProps & { static?: boolean; alt?: string }) {
  const src = isStatic ? '/logos/claude-star.png' : '/logos/claude-thinking.gif';
  return <LogoImg src={src} alt={alt ?? 'Claude'} {...p} />;
}
/** Supplied "Claude" wordmark for the web sidebar (upper-left). */
export function ClaudeWordmark({ size = 22, className, style }: IconProps) {
  // 138×44 asset → keep aspect (width ≈ 3.14× height); size sets the height.
  return (
    <img
      src="/logos/claude-wordmark.png"
      alt="Claude"
      height={size}
      className={className}
      style={{ height: size, width: 'auto', display: 'block', objectFit: 'contain', ...style }}
    />
  );
}
/** Supplied static orange starburst — home greeting mark + reduced-motion mark. */
export function ClaudeStar(p: IconProps & { alt?: string }) {
  const { alt, ...rest } = p;
  return <LogoImg src="/logos/claude-star.png" alt={alt ?? ''} {...rest} />;
}
export function SonyLogo(p: IconProps) {
  return <LogoImg src="/logos/sony.png" alt="Sony" {...p} />;
}
export function SlackbotLogo(p: IconProps & { alt?: string }) {
  const { alt, ...rest } = p;
  return <LogoImg src="/logos/slackbot.webp" alt={alt ?? 'Slackbot'} {...rest} />;
}
/** Supplied high-resolution Sony IP360 Advisor connected-node icon. */
export function AdvisorIcon(p: IconProps & { alt?: string }) {
  const { alt, ...rest } = p;
  return <LogoImg src="/logos/advisor.png" alt={alt ?? 'Sony IP360 Advisor'} {...rest} />;
}

/* ---- Genuine Microsoft Teams UI assets (from the supplied captures) ------ */
/* Copied to /icons/teams; used with object-fit contain, never stretched. */
function TeamsAsset({ file, alt, size, className, style }: IconProps & { file: string; alt: string }) {
  const s = size ?? 20;
  return (
    <img
      src={`/icons/teams/${file}`}
      alt={alt}
      width={s}
      height={s}
      className={className}
      style={{ width: s, height: s, objectFit: 'contain', display: 'block', ...style }}
    />
  );
}
export const TeamsCopilotAsset = (p: IconProps) => <TeamsAsset file="copilot.png" alt="Copilot" {...p} />;
export const TeamsChatAsset = (p: IconProps) => <TeamsAsset file="chat.png" alt="Chat" {...p} />;
export const TeamsVideoAsset = (p: IconProps) => <TeamsAsset file="video.png" alt="Meet" {...p} />;
export const TeamsTeamsAsset = (p: IconProps) => <TeamsAsset file="teams.png" alt="Teams" {...p} />;
export const TeamsActivityAsset = (p: IconProps) => <TeamsAsset file="activity.png" alt="Activity" {...p} />;
export const TeamsCalendarAsset = (p: IconProps) => <TeamsAsset file="calendar.png" alt="Calendar" {...p} />;
export const TeamsSearchAsset = (p: IconProps) => <TeamsAsset file="search.png" alt="" {...p} />;
export const TeamsComposeAsset = (p: IconProps) => <TeamsAsset file="compose.png" alt="" {...p} />;
export const TeamsOverflowAsset = (p: IconProps) => <TeamsAsset file="overflow.png" alt="" {...p} />;
export const TeamsCaretAsset = (p: IconProps) => <TeamsAsset file="caret.png" alt="" {...p} />;
export const TeamsCheckAsset = (p: IconProps) => <TeamsAsset file="check-circle.png" alt="Sent" {...p} />;
export const TeamsImageAsset = (p: IconProps) => <TeamsAsset file="image.png" alt="" {...p} />;
/** Genuine right-facing Teams send icon (supplied). Not the diagonal SVG. */
export const TeamsSendAsset = (p: IconProps) => <TeamsAsset file="send.png" alt="Send" {...p} />;
/** Genuine purple circular Chat speech-bubble for the rail (supplied). */
export const TeamsChatRailAsset = (p: IconProps) => <TeamsAsset file="chat-rail.png" alt="Chat" {...p} />;

/* Composer glyphs not present in the supplied ZIP — inline SVG (currentColor). */
export function EmojiIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="0.6" fill="currentColor" /><circle cx="15" cy="10" r="0.6" fill="currentColor" /><path d="M8.5 14.5a4 4 0 0 0 7 0" />
    </svg>
  );
}
export function PaperclipIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7.5-7.5" />
    </svg>
  );
}
export function LoopIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
/** Thin outline paper airplane pointing right (Teams send). Never filled. */
export function SendArrowIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M3.4 11.9 20 4.2a0.4 0.4 0 0 1 .55.5l-6.2 15.9a0.4 0.4 0 0 1-.74.02l-3-6.2a0.5 0.5 0 0 0-.23-.23z" />
      <path d="M10.6 13.9 20.3 4.4" />
    </svg>
  );
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
export function CalendarIcon({ size = 20, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <line x1="3.5" y1="9" x2="20.5" y2="9" />
      <line x1="8" y1="2.5" x2="8" y2="6" /><line x1="16" y1="2.5" x2="16" y2="6" />
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

/* ---- HX-6V-L: neutral glyphs for the Claude web-chat chrome --------------- */
export function MicIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" />
    </svg>
  );
}
export function ChevronDownIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
export function DownloadIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 19h14" />
    </svg>
  );
}
export function SidebarToggleIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" />
    </svg>
  );
}
export function SlidersIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M4 7h10" /><path d="M18 7h2" /><circle cx="16" cy="7" r="2" />
      <path d="M4 17h2" /><path d="M10 17h10" /><circle cx="8" cy="17" r="2" />
    </svg>
  );
}
export function PaletteIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1 .8-1.5 1.5-1.5H17a4 4 0 0 0 4-4c0-5-4-9-9-9z" />
      <circle cx="7.5" cy="11" r="0.8" fill="currentColor" /><circle cx="10" cy="7.5" r="0.8" fill="currentColor" /><circle cx="14.5" cy="7.5" r="0.8" fill="currentColor" />
    </svg>
  );
}
export function CloseIcon({ size = 14, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="m6 6 12 12" /><path d="m18 6-12 12" />
    </svg>
  );
}
export function ShareIcon({ size = 15, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M12 15V4" /><path d="m8 8 4-4 4 4" /><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}
/* Small outline Claude control shown at the top-right of the web start screen. */
export function ClaudeFaceIcon({ size = 18, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M5 12a7 7 0 0 1 14 0v6l-2.2-1.4a2 2 0 0 0-1.1-.3H9a4 4 0 0 1-4-4z" />
      <circle cx="9.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
/* ---- Suggestion-chip glyphs — CodeIcon reused for "Code". ----------------- */
export function PencilIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17z" /><path d="M14.5 6.5 17.5 9.5" />
    </svg>
  );
}
export function TrendIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M4 16l4-5 4 3 5-7" /><path d="M17 7h3v3" />
    </svg>
  );
}
export function GradCapIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M12 4 2 9l10 5 10-5z" /><path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
    </svg>
  );
}
export function CoffeeIcon({ size = 16, className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} style={{ ...base(size), ...style }} aria-hidden="true">
      <path d="M4 8h13v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /><path d="M17 9h2a2 2 0 0 1 0 4h-2" /><path d="M7 3v2M11 3v2" />
    </svg>
  );
}
