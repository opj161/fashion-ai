import { useContext } from 'react';
import { EditorContext } from './editorContextState';

// Custom hook for using the editor context
export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}