import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../hooks/useTheme'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', mockLocalStorage)

// Mock matchMedia
const mockMatchMedia = vi.fn()
vi.stubGlobal('matchMedia', mockMatchMedia)

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMatchMedia.mockReturnValue({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })
    
    // Mock document.documentElement
    vi.stubGlobal('document', {
      documentElement: {
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
        },
      },
    })
  })

  it('should initialize with light theme when no preference stored', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    mockMatchMedia.mockReturnValue({ matches: false })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('should initialize with dark theme when system prefers dark', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    mockMatchMedia.mockReturnValue({ matches: true })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('should use stored theme preference', () => {
    mockLocalStorage.getItem.mockReturnValue('dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('should toggle theme from light to dark', () => {
    mockLocalStorage.getItem.mockReturnValue('light')

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
  })

  it('should toggle theme from dark to light', () => {
    mockLocalStorage.getItem.mockReturnValue('dark')

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
  })

  it('should save theme preference to localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('light')

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })
})