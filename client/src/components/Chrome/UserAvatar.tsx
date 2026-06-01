interface Props {
  name: string;
  shape?: 'circle' | 'rounded-square';
  className?: string;
}

export function UserAvatar({ name, shape = 'circle', className = '' }: Props) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className={`avatar avatar-${shape} ${className}`}>
      {initial}
    </div>
  );
}
