import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApplicationDraft } from '../hooks/useApplicationDraft'
import { Application } from '../types'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', mockLocalStorage)

describe('useApplicationDraft', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should save draft to localStorage', async () => {
    const { result } = renderHook(() => useApplicationDraft())
    mockLocalStorage.getItem.mockReturnValue('{}')

    const draftData: Partial<Application> = {
      collegeName: 'Test University',
      program: 'Computer Science',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        dateOfBirth: '2000-01-01',
        citizenship: 'US',
        address: {
          street: '123 Main St',
          city: 'City',
          state: 'State',
          zipCode: '12345',
          country: 'US',
        },
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Mother',
          phone: '123-456-7891',
        },
      },
    }

    let savedId: string | undefined
    await act(async () => {
      savedId = await result.current.saveDraft(draftData)
    })

    expect(savedId).toBeDefined()
    expect(mockLocalStorage.setItem).toHaveBeenCalled()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should load draft from localStorage', () => {
    const mockDraft = {
      id: 'test-id',
      collegeName: 'Test University',
      status: 'draft',
    }
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
      'test-id': mockDraft
    }))

    const { result } = renderHook(() => useApplicationDraft())

    const loadedDraft = result.current.loadDraft('test-id')
    
    expect(loadedDraft).toEqual(mockDraft)
  })

  it('should return null when draft not found', () => {
    mockLocalStorage.getItem.mockReturnValue('{}')

    const { result } = renderHook(() => useApplicationDraft())

    const loadedDraft = result.current.loadDraft('non-existent-id')
    
    expect(loadedDraft).toBeNull()
  })

  it('should load all drafts from localStorage', () => {
    const mockDrafts = {
      'draft1': { id: 'draft1', collegeName: 'University 1' },
      'draft2': { id: 'draft2', collegeName: 'University 2' },
    }
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockDrafts))

    const { result } = renderHook(() => useApplicationDraft())

    const allDrafts = result.current.loadAllDrafts()
    
    expect(allDrafts).toHaveLength(2)
    expect(allDrafts).toContain(mockDrafts.draft1)
    expect(allDrafts).toContain(mockDrafts.draft2)
  })

  it('should delete draft from localStorage', () => {
    const mockDrafts = {
      'draft1': { id: 'draft1', collegeName: 'University 1' },
      'draft2': { id: 'draft2', collegeName: 'University 2' },
    }
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockDrafts))

    const { result } = renderHook(() => useApplicationDraft())

    act(() => {
      result.current.deleteDraft('draft1')
    })
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'college_application_drafts',
      JSON.stringify({ draft2: mockDrafts.draft2 })
    )
  })

  it('should handle localStorage errors gracefully', async () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('Storage error')
    })

    const { result } = renderHook(() => useApplicationDraft())

    const draftData: Partial<Application> = {
      collegeName: 'Test University',
    }

    await act(async () => {
      try {
        await result.current.saveDraft(draftData)
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.isLoading).toBe(false)
  })
})