import { useState, useCallback } from 'react';
import { Application } from '../types';

const STORAGE_KEY = 'college_application_drafts';

export const useApplicationDraft = (applicationId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveDraft = useCallback(async (application: Partial<Application>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const existingDrafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const id = applicationId || `draft_${Date.now()}`;
      
      const updatedApplication = {
        ...application,
        id,
        updatedAt: new Date(),
        status: 'draft' as const,
      };

      existingDrafts[id] = updatedApplication;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingDrafts));
      
      return id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save draft';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  const loadDraft = useCallback((id: string): Application | null => {
    try {
      const drafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return drafts[id] || null;
    } catch {
      return null;
    }
  }, []);

  const loadAllDrafts = useCallback((): Application[] => {
    try {
      const drafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Object.values(drafts);
    } catch {
      return [];
    }
  }, []);

  const deleteDraft = useCallback((id: string) => {
    try {
      const drafts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      delete drafts[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete draft');
    }
  }, []);

  return {
    saveDraft,
    loadDraft,
    loadAllDrafts,
    deleteDraft,
    isLoading,
    error,
  };
};