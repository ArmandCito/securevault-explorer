import { useState, useCallback, useMemo } from 'react'

/**
 * useFileTree
 * Manages the expand/collapse state of folders and
 * computes the flat ordered list of VISIBLE nodes for keyboard navigation.
 */
export function useFileTree(treeData) {
  const [expandedIds, setExpandedIds] = useState(new Set())

  const toggleFolder = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const expandFolder = useCallback((id) => {
    setExpandedIds(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const collapseFolder = useCallback((id) => {
    setExpandedIds(prev => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  /**
   * Recursively build the flat list of visible nodes.
   * A node is visible if all its ancestors are expanded.
   */
  const flatVisibleList = useMemo(() => {
    const list = []

    function walk(nodes, depth) {
      for (const node of nodes) {
        list.push({ ...node, depth })
        if (node.type === 'folder' && expandedIds.has(node.id) && node.children?.length) {
          walk(node.children, depth + 1)
        }
      }
    }

    walk(treeData, 0)
    return list
  }, [treeData, expandedIds])

  return {
    expandedIds,
    toggleFolder,
    expandFolder,
    collapseFolder,
    flatVisibleList,
  }
}
