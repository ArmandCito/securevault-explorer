import { useState, useCallback } from 'react'
import { FileTree } from './components/FileTree.jsx'
import { PropertiesPanel } from './components/PropertiesPanel.jsx'
import { SearchBar } from './components/SearchBar.jsx'
import { SearchStatus } from './components/SearchStatus.jsx'
import { IconShield } from './components/Icons.jsx'
import { useSearch } from './hooks/useSearch.js'
import { countItems } from './utils/fileUtils.js'
import treeData from './data.json'
import styles from './App.module.css'

export default function App() {
  const [selectedFile, setSelectedFile]         = useState(null)
  // focusedFolderFromBreadcrumb : id du dossier sur lequel naviguer depuis le breadcrumb
  const [breadcrumbTarget, setBreadcrumbTarget] = useState(null)

  const { query, handleQueryChange, searchResult } = useSearch(treeData)
  const { total } = countItems(treeData)

  const searchResultWithQuery = searchResult.active
    ? { ...searchResult, query }
    : searchResult

  const handleSelectFile = useCallback((node) => {
    setSelectedFile(node)
    setBreadcrumbTarget(null)
  }, [])

  /**
   * handleBreadcrumbNavigate
   * Déclenché quand l'utilisateur clique un segment du breadcrumb.
   * On efface la sélection de fichier et on signale au FileTree
   * de mettre le focus + scroll sur ce dossier.
   */
  const handleBreadcrumbNavigate = useCallback((node) => {
    setSelectedFile(null)
    setBreadcrumbTarget(node.id)
    // On reset après un tick pour que FileTree puisse le consommer
    setTimeout(() => setBreadcrumbTarget(null), 100)
  }, [])

  const showSearch = searchResult.active

  return (
    <div className={styles.app}>

      {/* ──────── Top Bar ────────── */}
      <header className={styles.topBar}>
        <div className={styles.topLeft}>
          <IconShield size={18} />
          <h1 className={styles.appTitle}>SecureVault Explorer</h1>
        </div>
        <div className={styles.topCenter}>
          <SearchBar query={query} onChange={handleQueryChange} />
        </div>
        <div className={styles.topRight}>
          <span className={styles.itemCount}>{total} items</span>
        </div>
      </header>

      {/* ─────── Main Layout ──────── */}
      <main className={styles.main}>

        {/* Left : File Tree */}
        <aside className={styles.sidebar}>
          <FileTree
            data={treeData}
            selectedId={selectedFile?.id}
            onSelectFile={handleSelectFile}
            searchResult={searchResultWithQuery}
            breadcrumbTarget={breadcrumbTarget}
          />
        </aside>

        <div className={styles.divider} />

        {/* Right : Properties Panel or Search Status */}
        <section className={styles.detailPane} aria-label="File properties">
          {showSearch ? (
            <SearchStatus
              query={query}
              matchedIds={searchResult.matchedIds}
            />
          ) : (
            <PropertiesPanel
              selectedFile={selectedFile}
              treeData={treeData}
              onNavigate={handleBreadcrumbNavigate}
            />
          )}
        </section>

      </main>
    </div>
  )
}
