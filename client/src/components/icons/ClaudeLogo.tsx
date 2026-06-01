interface Props {
  size?: number;
  color?: string;
}

export function ClaudeLogo({ size = 20, color = '#D97757' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        const rad = (angle * Math.PI) / 180;
        const cx = 12 + Math.sin(rad) * 7;
        const cy = 12 - Math.cos(rad) * 7;
        return (
          <line
            key={i}
            x1={12 + Math.sin(rad) * 3}
            y1={12 - Math.cos(rad) * 3}
            x2={cx}
            y2={cy}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
