import { IconView } from './IconView';

export function AppBarL0() {
  return (
    <div style={{
      height: 80,
      padding: '24px 16px 0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--backgroundPrimary)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img
          src="https://mint-design-system.vercel.app/logos/stocks/GROWW.png"
          alt="Groww"
          style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'contain' }}
        />
        <span style={{
          fontFamily: "'Sohne', sans-serif",
          fontWeight: 500,
          fontSize: 18,
          lineHeight: '28px',
          color: 'var(--contentPrimary)',
        }}>
          Stocks
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconView icon="gh-standard-search-01" color="var(--contentPrimary)" />
        <IconView icon="gh-standard-qr-code" color="var(--contentPrimary)" />
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--backgroundTertiary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--contentSecondary)',
        }}>
          <IconView icon="gh-standard-user" />
        </div>
      </div>
    </div>
  );
}
