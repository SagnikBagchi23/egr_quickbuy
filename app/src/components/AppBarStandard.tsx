import { IconView } from './IconView';

interface Props {
  title: string;
  onBack: () => void;
}

export function AppBarStandard({ title, onBack }: Props) {
  return (
    <div style={{
      height: 48,
      padding: '0 8px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--backgroundPrimary)',
      flexShrink: 0,
      borderBottom: '1px solid var(--borderPrimary)',
    }}>
      <button
        onClick={onBack}
        style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', background: 'none', border: 'none',
          color: 'var(--contentPrimary)',
        }}
      >
        <IconView icon="gh-standard-arrow-left-01" color="var(--contentPrimary)" />
      </button>
      <span style={{
        fontFamily: "'Sohne', sans-serif",
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
        color: 'var(--contentPrimary)',
        flex: 1,
      }}>
        {title}
      </span>
    </div>
  );
}
