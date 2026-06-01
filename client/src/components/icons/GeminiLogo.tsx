interface Props {
  size?: number;
}

export function GeminiLogo({ size = 20 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gemini-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF4040" />
          <stop offset="25%" stopColor="#F5C518" />
          <stop offset="50%" stopColor="#34A853" />
          <stop offset="75%" stopColor="#00B8D4" />
          <stop offset="100%" stopColor="#4285F4" />
        </linearGradient>
      </defs>
      <path
        d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z"
        fill="url(#gemini-grad)"
      />
    </svg>
  );
}
