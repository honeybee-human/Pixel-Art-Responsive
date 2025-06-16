import React, { createContext, useContext } from 'react';

interface EditorActionsContextType {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
  onLoadPreset: (preset: string) => void;
}

const EditorActionsContext = createContext<EditorActionsContextType | undefined>(undefined);

export function EditorActionsProvider({ children, value }: { children: React.ReactNode; value: EditorActionsContextType }) {
  return (
    <EditorActionsContext.Provider value={value}>
      {children}
    </EditorActionsContext.Provider>
  );
}

export function useEditorActions() {
  const context = useContext(EditorActionsContext);
  if (context === undefined) {
    throw new Error('useEditorActions must be used within an EditorActionsProvider');
  }
  return context;
}