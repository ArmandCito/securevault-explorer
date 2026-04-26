import { useRef, useEffect } from 'react'
import { useFileTree } from '../hooks/useFileTree.js'
import { useKeyboardNav } from '../hooks/useKeyboardNav.js'
import {
  IconFolder,
  IconFile,
  IconChevronRight,
  IconChevronDown,
} from './Icons.jsx'
import { getExtColor } from '../utils/fileUtils.js'
import styles from './FileTree.module.css'
import nodeStyles from './TreeNode.module.css'

/**
 * FileTree
 * ─────────────────────────────────────────────────────────────
 * Props:
 *   data              — JSON root table
 *   selectedId        — id of the selected file
 *   onSelectFile      — callback when a file is selected
 *   searchResult      — Result of useSearch (matched, ancestor ids)
 *   breadcrumbTarget  — id of a folder on which scroller/focuser
 *                       (initiated by a clickon the breadcrumb)
 */
export function FileTree({
  data,
  selectedId,
  onSelectFile,
  searchResult,
  breadcrumbTarget,
}) {
  const containerRef = useRef(null)

  const {
    expandedIds,
    toggleFolder,
    expandFolder,
    collapseFolder,
    flatVisibleList,
  } = useFileTree(data)

  const { focusedId, setFocusedId } = useKeyboardNav({
    flatVisibleList,
    expandedIds,
    expandFolder,
    collapseFolder,
    toggleFolder,
    onSelectFile,
    containerRef,
  })

  // When a user clicks on a breadcrumb element :
  // we expand that folder + keyboard focus
  useEffect(() => {
    if (!breadcrumbTarget) return
    expandFolder(breadcrumbTarget)
    setFocusedId(breadcrumbTarget)
    // Scroll vers l'élément dans le DOM
    const el = containerRef.current?.querySelector(`[data-id="${breadcrumbTarget}"]`)
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [breadcrumbTarget, expandFolder, setFocusedId])

  const effectiveExpandedIds = searchResult?.active
    ? new Set([...expandedIds, ...searchResult.ancestorIds])
    : expandedIds

  return (
    <div
      ref={containerRef}
      className={styles.treeContainer}
      role="tree"
      aria-label="File vault"
      tabIndex={0}
    >
      <p className={styles.vaultLabel}>VAULT</p>

      {data.map(node => (
        <RecursiveNode
          key={node.id}
          node={node}
          depth={0}
          expandedIds={effectiveExpandedIds}
          selectedId={selectedId}
          focusedId={focusedId}
          searchResult={searchResult}
          onToggle={toggleFolder}
          onSelectFile={onSelectFile}
          onFocus={setFocusedId}
        />
      ))}
    </div>
  )
}

/* ── RecursiveNode ── */
function RecursiveNode({
  node, depth, expandedIds, selectedId, focusedId,
  searchResult, onToggle, onSelectFile, onFocus,
}) {
  const isExpanded = node.type === 'folder' && expandedIds.has(node.id)
  const isSelected = node.id === selectedId
  const isFocused  = node.id === focusedId

  return (
    <>
      <TreeNodeRow
        node={node}
        depth={depth}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isFocused={isFocused}
        searchResult={searchResult}
        onToggle={onToggle}
        onSelectFile={onSelectFile}
        onFocus={onFocus}
      />
      {node.type === 'folder' && isExpanded && node.children?.length > 0 && (
        <div role="group">
          {node.children.map(child => (
            <RecursiveNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              focusedId={focusedId}
              searchResult={searchResult}
              onToggle={onToggle}
              onSelectFile={onSelectFile}
              onFocus={onFocus}
            />
          ))}
        </div>
      )}
    </>
  )
}

/* ── TreeNodeRow: View only ── */
function TreeNodeRow({
  node, depth, isExpanded, isSelected, isFocused,
  searchResult, onToggle, onSelectFile, onFocus,
}) {
  const rowRef     = useRef(null)
  const isFolder   = node.type === 'folder'
  const isSearchActive = searchResult?.active
  const isMatched  = isSearchActive && searchResult.matchedIds.has(node.id)
  const isDimmed   = isSearchActive && !isMatched && !searchResult.ancestorIds.has(node.id)

  useEffect(() => {
    if (isFocused && rowRef.current) {
      rowRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [isFocused])

  function handleClick(e) {
    e.stopPropagation()
    onFocus(node.id)
    if (isFolder) { onToggle(node.id) } else { onSelectFile(node) }
  }

  const rowClass = [
    nodeStyles.row,
    isFolder   ? nodeStyles.folder   : nodeStyles.file,
    isSelected ? nodeStyles.selected : '',
    isFocused  ? nodeStyles.focused  : '',
    isDimmed   ? nodeStyles.dimmed   : '',
    isMatched  ? nodeStyles.matched  : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={rowRef}
      className={rowClass}
      style={{ paddingLeft: `${8 + depth * 16}px` }}
      onClick={handleClick}
      role="treeitem"
      aria-expanded={isFolder ? isExpanded : undefined}
      aria-selected={isSelected}
      tabIndex={-1}
      data-id={node.id}
    >
      <span className={nodeStyles.chevron}>
        {isFolder
          ? isExpanded
            ? <IconChevronDown size={10} />
            : <IconChevronRight size={10} />
          : <span style={{ display: 'inline-block', width: 10 }} />
        }
      </span>

      <span className={nodeStyles.icon}>
        {isFolder
          ? <IconFolder open={isExpanded} size={14} />
          : <span className={nodeStyles[getExtColor(node.name)] || ''}>
              <IconFile size={14} />
            </span>
        }
      </span>

      <span className={nodeStyles.name}>
        {isMatched
          ? <HighlightMatch name={node.name} query={searchResult?.query} />
          : node.name
        }
      </span>

      {!isFolder && node.size && (
        <span className={nodeStyles.size}>{node.size}</span>
      )}
    </div>
  )
}

function HighlightMatch({ name, query }) {
  if (!query) return name
  const q   = query.trim().toLowerCase()
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
