export function StatusBar() {
  return (
    <div style={{
      height: 28,
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      background: 'var(--backgroundPrimary)',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: "'GrowwSans', sans-serif",
        fontWeight: 500,
        fontSize: 12,
        color: 'var(--contentPrimary)',
      }}>
        <span style={{ fontSize: 14 }}>
          <i className="gh-standard-wifi" style={{ fontSize: 14 }} />
        </span>
        <span style={{ fontSize: 14 }}>
          <i className="gh-standard-signal" style={{ fontSize: 14 }} />
        </span>
        <span style={{ letterSpacing: '0.5px' }}>12:30</span>
      </div>
    </div>
  );
}
