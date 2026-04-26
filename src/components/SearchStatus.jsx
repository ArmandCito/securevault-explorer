import { IconSearchLarge } from './Icons.jsx'
import styles from './SearchStatus.module.css'

/**
 * SearchStatus : affiché dans le detail pane quand la recherche est active.
 * Centré, carte 320px, style Figma Screen 3.
 */
export function SearchStatus({ query, matchedIds }) {
  const count = matchedIds.size
  const hasResults = count > 0

  return (
    <div className={`${styles.wrapper} ${!hasResults ? styles.noResults : ''}`}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <IconSearchLarge size={44} />
        </div>

        <p className={styles.count}>
          {hasResults
            ? `${count} ${count === 1 ? 'file matches' : 'files match'} "${query}"`
            : `No results for "${query}"`
          }
        </p>

        <p className={styles.hint}>
          {hasResults
            ? <>Matching folders expanded automatically.<br />Select a file from the tree to view its properties.</>
            : 'Try a different search term.'
          }
        </p>
      </div>
    </div>
  )
}
