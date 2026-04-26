import { useState, useMemo, useCallback } from 'react'

/**
 * useSearch
 * Filters the file tree by a query string.
 * Returns matched node IDs and ancestor IDs (folders that must be expanded).
 */
export function useSearch(treeData) {
  const [query, setQuery] = useState('')

  const handleQueryChange = useCallback((val) => {
    setQuery(val)
  }, [])

  /**
   * Recursively search for nodes matching the query.
   * Returns { matchedIds, ancestorIds } so the tree can:
   *  - highlight matched nodes
   *  - force-expand ancestor folders
   */
  const searchResult = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { matchedIds: new Set(), ancestorIds: new Set(), active: false }

    const matchedIds = new Set()
    const ancestorIds = new Set()

    function walk(nodes, ancestorChain) {
      let anyMatch = false
      for (const node of nodes) {
        const nameMatch = node.name.toLowerCase().includes(q)
        const currentChain = [...ancestorChain, node.id]

        let childMatch = false
        if (node.type === 'folder' && node.children?.length) {
          childMatch = walk(node.children, currentChain)
        }

        if (nameMatch || childMatch) {
          if (nameMatch) matchedIds.add(node.id)
          // All ancestors of a match must be expanded
          for (const aid of ancestorChain) {
            ancestorIds.add(aid)
          }
          anyMatch = true
        }
      }
      return anyMatch
    }

    walk(treeData, [])
    return { matchedIds, ancestorIds, active: true }
  }, [query, treeData])

  return {
    query,
    handleQueryChange,
    searchResult,
  }
}
