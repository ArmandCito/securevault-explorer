import { useState, useCallback, useEffect } from 'react'

/**
 * useKeyboardNav
 *
 * HOW IT WORKS (explanation for the reader):
 * ─────────────────────────────────────────
 * 1. The <FileTree> container has tabIndex={0}, so it can receive browser focus.
 * 2. When the user clicks on the panel OR presses Tab to it, the container gets focus.
 * 3. We attach a keydown listener to that container element.
 * 4. `focusedId` tracks which node has the keyboard highlight (the teal/blue bar).
 *    It is SEPARATE from `selectedId` (the green bar = file actually selected).
 * 5. ArrowDown/Up moves focusedId through the `flatVisibleList` (the ordered
 *    list of every visible node, recomputed whenever folders expand/collapse).
 * 6. ArrowRight expands the focused folder. ArrowLeft collapses it.
 * 7. Enter on a FILE → calls onSelectFile (sets the green bar + Properties Panel).
 *    Enter on a FOLDER → toggles expand/collapse.
 * 8. When the container loses focus, focusedId is cleared so the keyboard
 *    highlight disappears cleanly.
 *
 * WHY focusedId starts as null:
 *   The first ArrowDown sets it to list[0] (first visible item).
 *   This prevents an invisible "ghost" focus on load.
 */
export function useKeyboardNav({
  flatVisibleList,
  expandedIds,
  expandFolder,
  collapseFolder,
  toggleFolder,
  onSelectFile,
  containerRef,
}) {
  const [focusedId, setFocusedId] = useState(null)

  const handleKeyDown = useCallback(
    (e) => {
      const list = flatVisibleList
      if (!list.length) return

      // If nothing is focused yet, ArrowDown/Up starts at the first/last item
      const currentIndex = focusedId != null
        ? list.findIndex(n => n.id === focusedId)
        : -1

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          // If nothing focused yet → jump to index 0
          const nextIndex = currentIndex === -1
            ? 0
            : Math.min(currentIndex + 1, list.length - 1)
          setFocusedId(list[nextIndex].id)
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (currentIndex <= 0) break
          setFocusedId(list[currentIndex - 1].id)
          break
        }
        case 'ArrowRight': {
          e.preventDefault()
          if (currentIndex === -1) break
          const nodeR = list[currentIndex]
          if (nodeR?.type === 'folder') expandFolder(nodeR.id)
          break
        }
        case 'ArrowLeft': {
          e.preventDefault()
          if (currentIndex === -1) break
          const nodeL = list[currentIndex]
          if (nodeL?.type === 'folder' && expandedIds.has(nodeL.id)) {
            collapseFolder(nodeL.id)
          }
          break
        }
        case 'Enter': {
          e.preventDefault()
          if (currentIndex === -1) break
          const nodeE = list[currentIndex]
          if (nodeE?.type === 'file') {
            onSelectFile(nodeE)
          } else if (nodeE?.type === 'folder') {
            toggleFolder(nodeE.id)
          }
          break
        }
        default:
          break
      }
    },
    [flatVisibleList, focusedId, expandedIds, expandFolder, collapseFolder, toggleFolder, onSelectFile]
  )

  // Clear the keyboard focus highlight when the container loses focus
  const handleBlur = useCallback((e) => {
    // Only clear if focus truly left the container (not moved to a child)
    if (!containerRef?.current?.contains(e.relatedTarget)) {
      setFocusedId(null)
    }
  }, [containerRef])

  useEffect(() => {
    const el = containerRef?.current
    if (!el) return
    el.addEventListener('keydown', handleKeyDown)
    el.addEventListener('blur', handleBlur, true) // capture phase
    return () => {
      el.removeEventListener('keydown', handleKeyDown)
      el.removeEventListener('blur', handleBlur, true)
    }
  }, [containerRef, handleKeyDown, handleBlur])

  return { focusedId, setFocusedId }
}
