import { useState, useCallback } from 'react';
import { Tool } from '../types';
import { Wallpaper } from '../constants/wallpapers';

export function useEditorState() {
  const [gridSize, setGridSize] = useState(16);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [customColor, setCustomColor] = useState('#000000');
  const [wallpaper, setWallpaper] = useState<Wallpaper>('default');

  const handleCustomColorChange = useCallback((color: string) => {
    setCustomColor(color);
    setCurrentColor(color);
  }, []);

  return {
    // State
    gridSize,
    currentColor,
    currentTool,
    customColor,
    wallpaper,
    
    // Setters
    setGridSize,
    setCurrentColor,
    setCurrentTool,
    setWallpaper,
    
    // Handlers
    handleCustomColorChange
  };
}
