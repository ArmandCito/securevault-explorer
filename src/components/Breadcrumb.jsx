import { IconChevronRight, IconFolder, IconFile } from './Icons.jsx'
import styles from './Breadcrumb.module.css'


export function Breadcrumb({ path, onNavigate }) {
  if (!path || path.length === 0) return null

  return (
    <nav className={styles.breadcrumb} aria-label="File path">
      <ol className={styles.list}>
        {path.map((node, index) => {
          const isLast = index === path.length - 1

          return (
            <li key={node.id} className={styles.item}>
              {!isLast ? (
                <>
                  <button
                    className={styles.segment}
                    onClick={() => onNavigate(node)}
                    title={`Go to ${node.name}`}
                    type="button"
                  >
                    <span className={styles.segmentIcon}>
                      <IconFolder open={false} size={11} />
                    </span>
                    <span className={styles.segmentName}>{node.name}</span>
                  </button>
                  <span className={styles.separator} aria-hidden="true">
                    <IconChevronRight size={8} />
                  </span>
                </>
              ) : (
                <span className={styles.current}>
                  <span className={styles.segmentIcon}>
                    <IconFile size={11} />
                  </span>
                  <span className={styles.currentName}>{node.name}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
