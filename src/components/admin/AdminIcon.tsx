import React from 'react'

export function AdminIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'relative',
        width: '30px',
        height: '30px',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: '4px',
          border: '1.5px solid var(--hf-primary, #8c2f1b)',
          transform: 'rotate(45deg)',
        }}
      />
      <span
        style={{
          position: 'relative',
          fontFamily: "var(--font-serif, 'Literata', Georgia, serif)",
          fontWeight: 700,
          fontSize: '12px',
          lineHeight: 1,
          color: 'var(--hf-primary, #8c2f1b)',
        }}
      >
        H
      </span>
    </span>
  )
}
