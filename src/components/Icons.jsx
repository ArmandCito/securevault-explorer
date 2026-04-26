/* ──────── All SVG icons used throughout SecureVault Explorer ────────── */

export function IconFolder({ open = false, size = 14 }) {
  return open ? (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.5 3.5A1 1 0 012.5 2.5H6l1.5 1.5H13.5a1 1 0 011 1V12a1 1 0 01-1 1h-11a1 1 0 01-1-1V3.5z"
        fill="var(--accent-primary)"
        fillOpacity="0.25"
        stroke="var(--accent-primary)"
        strokeWidth="1"
      />
      <path d="M1.5 6h13" stroke="var(--accent-primary)" strokeWidth="1" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.5 3.5A1 1 0 012.5 2.5H6l1.5 1.5H13.5a1 1 0 011 1V12a1 1 0 01-1 1h-11a1 1 0 01-1-1V3.5z"
        fill="var(--text-disabled)"
        fillOpacity="0.2"
        stroke="var(--text-secondary)"
        strokeWidth="1"
      />
    </svg>
  )
}

export function IconFile({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"
        fill="var(--bg-elevated)"
        stroke="var(--text-secondary)"
        strokeWidth="1"
      />
      <path d="M10 2v3h3" stroke="var(--text-secondary)" strokeWidth="1" />
      <path d="M5 8h6M5 10.5h4" stroke="var(--text-disabled)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

export function IconChevronRight({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M3.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconChevronDown({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconSearch({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconLock({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="8" y="18" width="24" height="18" rx="3" stroke="var(--text-disabled)" strokeWidth="1.5" fill="none" />
      <path
        d="M13 18v-5a7 7 0 0114 0v5"
        stroke="var(--text-disabled)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="20" cy="27" r="2" fill="var(--text-disabled)" />
    </svg>
  )
}

export function IconShield({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 2L3 4.5v5C3 13 6 16 9 17c3-1 6-4 6-7.5v-5L9 2z"
        fill="var(--accent-primary)"
        fillOpacity="0.15"
        stroke="var(--accent-primary)"
        strokeWidth="1.2"
      />
      <path d="M6.5 9l2 2 3-3" stroke="var(--accent-primary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconX({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconSearchLarge({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="21" cy="21" r="13" stroke="var(--text-disabled)" strokeWidth="2" />
      <path d="M31 31L42 42" stroke="var(--text-disabled)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function IconKeyboard({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="4" width="13" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 7h1M7 7h1M10 7h1M5.5 10h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
