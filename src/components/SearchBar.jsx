import { useRef } from 'react'
import { IconSearch, IconX } from './Icons.jsx'
import styles from './SearchBar.module.css'

/**
 * SearchBar
 * Controlled search input with a clear button.
 * Matching items deep inside folders force those folders to expand
 * (handled in useSearch hook + FileTree via ancestorIds).
 */
export function SearchBar({ query, onChange }) {
  const inputRef = useRef(null)

  function handleClear() {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className={`${styles.wrapper} ${query ? styles.active : ''}`}>
      <span className={styles.icon}>
        <IconSearch size={14} />
      </span>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder="Search files..."
        value={query}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
        aria-label="Search files"
      />
      {query && (
        <button
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <IconX size={10} />
        </button>
      )}
    </div>
  )
}
