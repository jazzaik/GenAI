import { useState, useCallback } from 'react';
import { ACTIVE_DOCUMENT } from '../data/mockData.js';

/**
 * useDocument — manages the active document state including
 * section editing, suggestion management, comment resolution,
 * approval flow, and simulated AI generation.
 */
export function useDocument() {
  const [doc, setDoc]               = useState(ACTIVE_DOCUMENT);
  const [aiState, setAiState]       = useState('idle'); // 'idle' | 'loading' | 'error'
  const [showApproval, setShowApproval] = useState(false);
  const [showDiff, setShowDiff]         = useState(false);

  // Update a section's text (tracked as humanEdited)
  const updateSection = useCallback((sectionId, newText) => {
    setDoc(prev => ({
      ...prev,
      content: {
        ...prev.content,
        sections: prev.content.sections.map(s =>
          s.id === sectionId
            ? { ...s, text: newText, humanEdited: true }
            : s,
        ),
      },
    }));
  }, []);

  // Accept or reject an AI suggestion
  const respondToSuggestion = useCallback((suggestionId, accepted) => {
    setDoc(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s =>
        s.id === suggestionId ? { ...s, accepted } : s,
      ),
    }));
  }, []);

  // Resolve a comment thread
  const resolveComment = useCallback((commentId) => {
    setDoc(prev => ({
      ...prev,
      comments: prev.comments.map(c =>
        c.id === commentId ? { ...c, resolved: true } : c,
      ),
    }));
  }, []);

  // Simulate AI regeneration with loading state
  const regenerate = useCallback(() => {
    setAiState('loading');
    setTimeout(() => {
      setAiState('idle');
      // In production: call API, update sections with new content
    }, 2800);
  }, []);

  // Simulate AI refinement (partial update)
  const refine = useCallback((sectionId) => {
    setAiState('loading');
    setTimeout(() => {
      setAiState('idle');
      setDoc(prev => ({
        ...prev,
        content: {
          ...prev.content,
          sections: prev.content.sections.map(s =>
            s.id === sectionId
              ? { ...s, confidence: Math.min(0.99, s.confidence + 0.04) }
              : s,
          ),
        },
      }));
    }, 1800);
  }, []);

  // Approve document
  const approve = useCallback(() => {
    setDoc(prev => ({ ...prev, status: 'approved' }));
    setShowApproval(false);
  }, []);

  return {
    doc,
    aiState,
    showApproval, setShowApproval,
    showDiff,     setShowDiff,
    updateSection,
    respondToSuggestion,
    resolveComment,
    regenerate,
    refine,
    approve,
  };
}
