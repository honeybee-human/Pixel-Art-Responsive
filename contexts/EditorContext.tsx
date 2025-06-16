import React, { createContext, useContext } from 'react';
import { Tool } from '../types';
import { Wallpaper } from '../constants/wallpapers';

interface EditorContextType {
  // Editor state
  currentTool: Tool;
  currentColor: string;
  customColor: string;
  gridSize: number;
  wallpaper: Wallpaper;
  
  // State setters
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
  onCustomColorChange: (color: string) => void;
  onGridSizeChange: (size: number) => void;
  onWallpaperChange: (wallpaper: Wallpaper) => void;
  
  // Actions
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
  onLoadPreset: (preset: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ 
  children, 
  value 
}: { 
  children: React.ReactNode; 
  value: EditorContextType;
}) {
  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}