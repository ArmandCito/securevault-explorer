import { IconLock, IconFile, IconKeyboard } from './Icons.jsx'
import { Breadcrumb } from './Breadcrumb.jsx'
import { getFileTypeLabel, getModifiedDate, findPath } from '../utils/fileUtils.js'
import styles from './PropertiesPanel.module.css'

/**
 * PropertiesPanel
 *
 * EMPTY  — centered, cadenas + hint + keyboard shortcuts widget
 * FILLED — centered, breadcrumb cliquable + carte métadonnées + bouton
 *
 * Props:
 *   selectedFile  : selected node (null of nothing)
 *   treeData      : arbre complet (pour calculer le chemin breadcrumb)
 *   onNavigate    : callback(node) when user clicks on a breadcrumb path element
 */
export function PropertiesPanel({ selectedFile, treeData, onNavigate }) {
  if (!selectedFile) return <EmptyState />
  return (
    <FilledState
      file={selectedFile}
      treeData={treeData}
      onNavigate={onNavigate}
    />
  )
}

/* ─── EMPTY STATE ─── */
function EmptyState() {
  return (
    <div className={styles.panel}>
      <div className={styles.emptyContent}>
        <div className={styles.lockWrapper}>
          <IconLock size={36} />
          <p className={styles.emptyHint}>Select a file to view its properties</p>
        </div>
        <KeyboardShortcutsWidget />
      </div>
    </div>
  )
}

/* ─── FILLED STATE ─── */
function FilledState({ file, treeData, onNavigate }) {
  const fileType = getFileTypeLabel(file.name)
  const modified = getModifiedDate(file.id)

  // Calculate the path complet root → file for the breadcrumb
  const path = treeData ? findPath(treeData, file.id) : null

  return (
    <div className={styles.panel}>
      <div className={styles.filledWrapper}>

        {/* ── Wildcard Feature : Breadcrumb cliquable ── */}
        {path && path.length > 1 && (
          <Breadcrumb path={path} onNavigate={onNavigate} />
        )}

        {/* ── Card properties ── */}
        <div className={styles.filledContent}>

          {/* Header : icône + name */}
          <div className={styles.fileHeader}>
            <span className={styles.fileIconLarge}>
              <IconFile size={16} />
            </span>
            <span className={styles.fileName}>{file.name}</span>
          </div>

          {/* Metadata*/}
          <div className={styles.metaTable}>
            <MetaRow label="Name"     value={file.name} />
            <MetaRow label="Type"     value={fileType} />
            <MetaRow label="Size"     value={file.size} mono />
            <MetaRow label="Modified" value={modified} />
          </div>

          {/* Action */}
          <button className={styles.openButton} type="button">
            Open File
          </button>

        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, value, mono = false }) {
  return (
    <div className={styles.metaRow}>
      <span className={styles.metaLabel}>{label}</span>
      <span className={`${styles.metaValue} ${mono ? styles.mono : ''}`}>
        {value}
      </span>
    </div>
  )
}

/* ─────── KEYBOARD SHORTCUTS WIDGET ───────── */
function KeyboardShortcutsWidget() {
  return (
    <div className={styles.shortcutsWidget}>
      <div className={styles.shortcutsHeader}>
        <IconKeyboard size={12} />
        <span>Keyboard Shortcuts</span>
      </div>
      <div className={styles.shortcutsList}>
        <ShortcutRow keys={['↑', '↓']} action="Navigate" />
        <ShortcutRow keys={['→']}       action="Expand folder" />
        <ShortcutRow keys={['←']}       action="Collapse folder" />
        <ShortcutRow keys={['Enter']}   action="Select file" />
      </div>
    </div>
  )
}

function ShortcutRow({ keys, action }) {
  return (
    <div className={styles.shortcutRow}>
      <div className={styles.keysGroup}>
        {keys.map(k => <kbd key={k} className={styles.kbd}>{k}</kbd>)}
      </div>
      <span className={styles.shortcutAction}>{action}</span>
    </div>
  )
}
