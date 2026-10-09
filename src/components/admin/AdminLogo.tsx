import React from 'react'

export function AdminLogo() {
  const size = 52
  const s = size / 38

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        color: 'var(--fg, #2b2118)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: `${Math.round(5 * s)}px`,
            border: '2px solid var(--hf-primary, #8c2f1b)',
            transform: 'rotate(45deg)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: `${Math.round(10 * s)}px`,
            border: '1.2px solid var(--hf-primary, #8c2f1b)',
            transform: 'rotate(45deg)',
          }}
        />
        <span
          style={{
            position: 'relative',
            fontFamily: "var(--font-serif, 'Literata', Georgia, serif)",
            fontWeight: 700,
            fontSize: `${Math.round(15 * s)}px`,
            lineHeight: 1,
            color: 'var(--hf-primary, #8c2f1b)',
          }}
        >
          H
        </span>
      </span>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif, 'Literata', Georgia, serif)",
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-0.01em',
            color: 'inherit',
          }}
        >
          hisinf
          <span style={{ color: 'var(--hf-primary, #8c2f1b)' }}>.uz</span>
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)",
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted, #6b5d4f)',
          }}
        >
          Tahririyat
        </span>
      </div>
    </div>
  )
}
