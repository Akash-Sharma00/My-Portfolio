export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '28px 0',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--accent)' }}>A</span>kash Sharma
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          Built with React + TypeScript · Mumbai, India
        </span>
      </div>
    </footer>
  )
}
