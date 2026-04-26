import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useKeyboardNav } from '../useKeyboardNav'

describe('useKeyboardNav', () => {
  const mockFlatVisibleList = [
    { id: '1', name: 'Folder 1', type: 'folder' },
    { id: '1-1', name: 'File 1-1', type: 'file' },
    { id: '2', name: 'File 2', type: 'file' }
  ]

  const setup = () => {
    const expandFolder = vi.fn()
    const collapseFolder = vi.fn()
    const toggleFolder = vi.fn()
    const onSelectFile = vi.fn()
    const containerRef = { current: document.createElement('div') }

    const { result } = renderHook(() => useKeyboardNav({
      flatVisibleList: mockFlatVisibleList,
      expandedIds: new Set(),
      expandFolder,
      collapseFolder,
      toggleFolder,
      onSelectFile,
      containerRef
    }))

    return {
      result,
      expandFolder,
      collapseFolder,
      toggleFolder,
      onSelectFile,
      containerRef
    }
  }

  it('should start with null focusedId', () => {
    const { result } = setup()
    expect(result.current.focusedId).toBe(null)
  })

  it('should move focus down on ArrowDown', () => {
    const { result, containerRef } = setup()
    
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      containerRef.current.dispatchEvent(event)
    })
    expect(result.current.focusedId).toBe('1')

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
      containerRef.current.dispatchEvent(event)
    })
    expect(result.current.focusedId).toBe('1-1')
  })

  it('should move focus up on ArrowUp', () => {
    const { result, containerRef } = setup()
    
    // Move down to '1-1'
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    })
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    })
    expect(result.current.focusedId).toBe('1-1')

    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    })
    expect(result.current.focusedId).toBe('1')
  })

  it('should call expandFolder on ArrowRight for folders', () => {
    const { result, containerRef, expandFolder } = setup()
    
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })) // Focus Folder 1
    })
    
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    })
    
    expect(expandFolder).toHaveBeenCalledWith('1')
  })

  it('should call onSelectFile on Enter for files', () => {
    const { result, containerRef, onSelectFile } = setup()
    
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })) // 1
    })
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })) // 1-1
    })
    
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    })
    
    expect(onSelectFile).toHaveBeenCalledWith(mockFlatVisibleList[1])
  })

  it('should call toggleFolder on Enter for folders', () => {
    const { result, containerRef, toggleFolder } = setup()
    
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' })) // Focus Folder 1
    })
    
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    })
    
    expect(toggleFolder).toHaveBeenCalledWith('1')
  })

  it('should clear focusedId on blur', () => {
    const { result, containerRef } = setup()
    
    act(() => {
      containerRef.current.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    })
    expect(result.current.focusedId).toBe('1')

    act(() => {
      containerRef.current.dispatchEvent(new FocusEvent('blur'))
    })
    expect(result.current.focusedId).toBe(null)
  })
})
