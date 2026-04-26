import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSearch } from '../useSearch'

const mockTreeData = [
  {
    id: '1',
    name: 'Legal Documents',
    type: 'folder',
    children: [
      { id: '1-1', name: 'Contract.pdf', type: 'file' },
      { id: '1-2', name: 'Templates', type: 'folder', children: [
        { id: '1-2-1', name: 'Invoice.xlsx', type: 'file' }
      ]}
    ]
  },
  { id: '2', name: 'Personal', type: 'folder', children: [] }
]

describe('useSearch', () => {
  it('should initialize with empty results', () => {
    const { result } = renderHook(() => useSearch(mockTreeData))
    
    expect(result.current.query).toBe('')
    expect(result.current.searchResult.active).toBe(false)
    expect(result.current.searchResult.matchedIds.size).toBe(0)
  })

  it('should find matches and their ancestors', () => {
    const { result } = renderHook(() => useSearch(mockTreeData))
    
    act(() => {
      result.current.handleQueryChange('Invoice')
    })
    
    expect(result.current.searchResult.active).toBe(true)
    expect(result.current.searchResult.matchedIds.has('1-2-1')).toBe(true)
    // Ancestors of 1-2-1 are 1 and 1-2
    expect(result.current.searchResult.ancestorIds.has('1')).toBe(true)
    expect(result.current.searchResult.ancestorIds.has('1-2')).toBe(true)
    expect(result.current.searchResult.ancestorIds.has('2')).toBe(false)
  })

  it('should be case-insensitive', () => {
    const { result } = renderHook(() => useSearch(mockTreeData))
    
    act(() => {
      result.current.handleQueryChange('contract')
    })
    
    expect(result.current.searchResult.matchedIds.has('1-1')).toBe(true)
  })

  it('should return multiple matches', () => {
    const { result } = renderHook(() => useSearch(mockTreeData))
    
    act(() => {
      result.current.handleQueryChange('e') // Matches Legal Documents, Templates, Invoice, Personal
    })
    
    expect(result.current.searchResult.matchedIds.size).toBeGreaterThan(1)
  })

  it('should reset when query is empty', () => {
    const { result } = renderHook(() => useSearch(mockTreeData))
    
    act(() => {
      result.current.handleQueryChange('Invoice')
    })
    expect(result.current.searchResult.active).toBe(true)

    act(() => {
      result.current.handleQueryChange('')
    })
    expect(result.current.searchResult.active).toBe(false)
    expect(result.current.searchResult.matchedIds.size).toBe(0)
  })
})
