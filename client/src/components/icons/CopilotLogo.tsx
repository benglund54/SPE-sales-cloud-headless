interface Props {
  size?: number;
}

export function CopilotLogo({ size = 20 }: Props) {
  return (
    <img
      src="/logos/copilot.png"
      alt="Copilot"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
}
