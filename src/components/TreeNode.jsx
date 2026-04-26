import { useRef, useEffect } from 'react'
import {
  IconFolder,
  IconFile,
  IconChevronRight,
  IconChevronDown,
} from './Icons.jsx'
import { getExtColor } from '../utils/fileUtils.js'
import styles from './TreeNode.module.css'

/**
 * TreeNode : recursive component.
 *
 * Recursive Strategy:
 *  Each TreeNode renders itself, then : if it is an expanded folder :
 *  maps over its children and renders a <TreeNode> for each one.
 *  This pattern works for ANY depth (2 levels or 20 levels).
 *  The `depth` prop controls the left-indent (depth × 16px per the design spec).
 */
export function TreeNode({
  node,
  depth,
  isExpanded,
  isSelected,
  isFocused,
  searchResult,
  onToggle,
  onSelectFile,
  onFocus,
}) {
  const rowRef = useRef(null)

  // Auto-scroll focused item into view
  useEffect(() => {
    if (isFocused && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [isFocused])

  const isFolder = node.type === 'folder'
  const isSearchActive = searchResult?.active
  const isMatched = isSearchActive && searchResult.matchedIds.has(node.id)

  // When search is active, dim items that are neither matched nor ancestors
  const isDimmed =
    isSearchActive &&
    !isMatched &&
    !searchResult.ancestorIds.has(node.id)

  function handleClick(e) {
    e.stopPropagation()
    onFocus(node.id)
    if (isFolder) {
      onToggle(node.id)
    } else {
      onSelectFile(node)
    }
  }

  function handleKeyDown(e) {
    // Native keyboard events are handled by useKeyboardNav on the container.
    // This prevents duplicate handling from native focus events.
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
    }
  }

  const rowClass = [
    styles.row,
    isFolder ? styles.folder : styles.file,
    isSelected ? styles.selected : '',
    isFocused ? styles.focused : '',
    isDimmed ? styles.dimmed : '',
    isMatched ? styles.matched : '',
  ]
    .filter(Boolean)
    .join(' ')

  const indentPx = depth * 16 // 16px per depth level per design spec

  return (
    <div className={styles.nodeWrapper}>
      {/* ──────── The row itself ────────── */}
      <div
        ref={rowRef}
        className={rowClass}
        style={{ paddingLeft: `${8 + indentPx}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={isFolder ? 'treeitem' : 'treeitem'}
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={-1}
        data-id={node.id}
      >
        {/* Chevron for folders : space placeholder for files keeps alignment */}
        <span className={styles.chevron}>
          {isFolder ? (
            isExpanded ? (
              <IconChevronDown size={10} />
            ) : (
              <IconChevronRight size={10} />
            )
          ) : (
            <span style={{ display: 'inline-block', width: 10 }} />
          )}
        </span>

        {/* Icon */}
        <span className={styles.icon}>
          {isFolder ? (
            <IconFolder open={isExpanded} size={14} />
          ) : (
            <span className={`${styles.fileIcon} ${styles[getExtColor(node.name)]}`}>
              <IconFile size={14} />
            </span>
          )}
        </span>

        {/* Name */}
        <span className={styles.name}>
          {isMatched ? <HighlightMatch name={node.name} query={searchResult?.query} /> : node.name}
        </span>

        {/* Size badge for files */}
        {!isFolder && node.size && (
          <span className={styles.size}>{node.size}</span>
        )}
      </div>

      {/* ────── Children (recursive) ────── */}
      {isFolder && isExpanded && node.children?.length > 0 && (
        <div
          className={styles.children}
          role="group"
        >
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isExpanded={isExpanded /* will be recalculated per child */}
              isSelected={false /* passed from parent context via App */}
              isFocused={false}
              searchResult={searchResult}
              onToggle={onToggle}
              onSelectFile={onSelectFile}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Highlights the matching substring in yellow */
function HighlightMatch({ name, query }) {
  if (!query) return name
  const q = query.trim().toLowerCase()
  const idx = name.toLowerCase().indexOf(q)
  if (idx === -1) return name
  return (
    <>
      {name.slice(0, idx)}
      <mark>{name.slice(idx, idx + q.length)}</mark>
      {name.slice(idx + q.length)}
    </>
  )
}
