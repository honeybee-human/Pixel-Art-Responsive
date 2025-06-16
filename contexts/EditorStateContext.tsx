import React, { createContext, useContext } from 'react';
import { Tool } from '../types';
import { Wallpaper } from '../constants/wallpapers';

interface EditorStateContextType {
  currentTool: Tool;
  currentColor: string;
  customColor: string;
  gridSize: number;
  wallpaper: Wallpaper;
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
  onCustomColorChange: (color: string) => void;
  onGridSizeChange: (size: number) => void;
  onWallpaperChange: (wallpaper: Wallpaper) => void;
}

const EditorStateContext = createContext<EditorStateContextType | undefined>(undefined);

export function EditorStateProvider({ children, value }: { children: React.ReactNode; value: EditorStateContextType }) {
  return (
    <EditorStateContext.Provider value={value}>
      {children}
    </EditorStateContext.Provider>
  );
}

export function useEditorState() {
  const context = useContext(EditorStateContext);
  if (context === undefined) {
    throw new Error('useEditorState must be used within an EditorStateProvider');
  }
  return context;
}