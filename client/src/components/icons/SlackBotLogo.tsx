interface Props {
  size?: number;
}

export function SlackBotLogo({ size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="slack-clip">
          <rect width="100" height="100" rx="18" />
        </clipPath>
      </defs>
      <g clipPath="url(#slack-clip)">
        {/* Four color quadrants */}
        <rect x="0" y="0" width="50" height="50" fill="#36C5F0" />
        <rect x="50" y="0" width="50" height="50" fill="#2EB67D" />
        <rect x="0" y="50" width="50" height="50" fill="#E01E5A" />
        <rect x="50" y="50" width="50" height="50" fill="#ECB22E" />
        {/* White 4-pointed star reaching edges */}
        <path d="M50 0 C42 25 25 42 0 50 C25 58 42 75 50 100 C58 75 75 58 100 50 C75 42 58 25 50 0z" fill="#ffffff" />
        {/* Eyes */}
        <circle cx="36" cy="45" r="7" fill="white" />
        <circle cx="64" cy="45" r="7" fill="white" />
        <circle cx="36" cy="45" r="4.5" fill="#2D2050" />
        <circle cx="64" cy="45" r="4.5" fill="#2D2050" />
        {/* Eyebrows */}
        <ellipse cx="30" cy="32" rx="5.5" ry="3" fill="#2D2050" transform="rotate(-20 30 32)" />
        <ellipse cx="70" cy="32" rx="5.5" ry="3" fill="#2D2050" transform="rotate(20 70 32)" />
        {/* Smile */}
        <path d="M40 58 Q50 69 60 58" stroke="#2D2050" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Chin highlight */}
        <ellipse cx="50" cy="66" rx="4" ry="2" fill="rgba(255,255,255,0.4)" />
      </g>
    </svg>
  );
}
