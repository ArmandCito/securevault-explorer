import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useFileTree } from '../useFileTree'

const mockTreeData = [
  {
    id: '1',
    name: 'Folder 1',
    type: 'folder',
    children: [
      { id: '1-1', name: 'File 1-1', type: 'file' },
      { id: '1-2', name: 'Folder 1-2', type: 'folder', children: [] }
    ]
  },
  { id: '2', name: 'File 2', type: 'file' }
]

describe('useFileTree', () => {
  it('should initialize with empty expandedIds and correct flatVisibleList', () => {
    const { result } = renderHook(() => useFileTree(mockTreeData))
    
    expect(result.current.expandedIds.size).toBe(0)
    // Only top-level items should be visible initially
    expect(result.current.flatVisibleList).toHaveLength(2)
    expect(result.current.flatVisibleList[0].id).toBe('1')
    expect(result.current.flatVisibleList[1].id).toBe('2')
  })

  it('should toggle folder expansion', () => {
    const { result } = renderHook(() => useFileTree(mockTreeData))
    
    act(() => {
      result.current.toggleFolder('1')
    })
    
    expect(result.current.expandedIds.has('1')).toBe(true)
    // Folder 1 expanded, children should now be visible
    expect(result.current.flatVisibleList).toHaveLength(4)
    expect(result.current.flatVisibleList[1].id).toBe('1-1')
    
    act(() => {
      result.current.toggleFolder('1')
    })
    
    expect(result.current.expandedIds.has('1')).toBe(false)
    expect(result.current.flatVisibleList).toHaveLength(2)
  })

  it('should expand and collapse folders explicitly', () => {
    const { result } = renderHook(() => useFileTree(mockTreeData))
    
    act(() => {
      result.current.expandFolder('1')
    })
    expect(result.current.expandedIds.has('1')).toBe(true)
    
    act(() => {
      result.current.expandFolder('1') // Should stay expanded
    })
    expect(result.current.expandedIds.has('1')).toBe(true)
    
    act(() => {
      result.current.collapseFolder('1')
    })
    expect(result.current.expandedIds.has('1')).toBe(false)
  })

  it('should correctly calculate depth in flatVisibleList', () => {
    const { result } = renderHook(() => useFileTree(mockTreeData))
    
    act(() => {
      result.current.expandFolder('1')
    })
    
    const list = result.current.flatVisibleList
    expect(list[0].depth).toBe(0) // Folder 1
    expect(list[1].depth).toBe(1) // File 1-1
    expect(list[2].depth).toBe(1) // Folder 1-2
    expect(list[3].depth).toBe(0) // File 2
  })
})
