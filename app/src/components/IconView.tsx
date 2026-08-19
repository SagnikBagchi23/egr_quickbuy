type Size = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

const sizeMap: Record<Size, number> = {
  xsmall: 12, small: 16, medium: 20, large: 24, xlarge: 28,
};

interface Props {
  icon: string;
  size?: Size;
  color?: string;
  style?: React.CSSProperties;
}

export function IconView({ icon, size = 'medium', color, style }: Props) {
  const px = sizeMap[size];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: px,
        height: px,
        fontSize: px,
        color: color ?? 'inherit',
        ...style,
      }}
    >
      <i className={icon} />
    </span>
  );
}
