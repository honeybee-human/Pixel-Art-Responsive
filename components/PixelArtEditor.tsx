import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { EditorStateProvider } from '../contexts/EditorStateContext';
import { EditorActionsProvider } from '../contexts/EditorActionsContext';
import { useCanvasLogic } from '../hooks/useCanvasLogic';
import { useEditorState } from '../hooks/useEditorState';
import { useTheme } from '../contexts/ThemeContext';
import { PixelArtEditorProps, Tool } from '../types';
import { WALLPAPERS } from '../constants/wallpapers';
import { PRESET_TEMPLATES } from '../constants/templates';
import { CANVAS_SIZE_LIMITS } from '../constants/settings';
import { ThemeToggle } from './ui/theme-toggle';

export const PixelArtEditor = React.memo(function PixelArtEditor({ className }: PixelArtEditorProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(600);
  
  const { updatePrimaryForWallpaper } = useTheme();

  // Editor state management from its own hook
  const {
    gridSize,
    currentColor,
    currentTool,
    customColor,
    wallpaper,
    setGridSize,
    setCurrentColor,
    setCurrentTool,
    setWallpaper,
    handleCustomColorChange
  } = useEditorState();

  // Canvas logic management from the new, corrected hook
  const {
    canvasRef,
    pixels,
    isDrawing,
    setIsDrawing,
    getPixelCoordinates,
    drawPixel,
    startDrawing,
    endDrawing,
    undo,
    redo,
    clearCanvas,
    setPixelsWithHistory,
    canUndo,
    canRedo
  } = useCanvasLogic(gridSize, canvasSize);

  // Calculate canvas size based on available space
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const container = canvasContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const availableWidth = containerRect.width - 48; // p-6 padding on each side
        const availableHeight = containerRect.height - 48; // p-6 padding on each side
        const maxSize = Math.min(availableWidth, availableHeight, CANVAS_SIZE_LIMITS.MAX);
        const newSize = Math.max(maxSize, CANVAS_SIZE_LIMITS.MIN);
        setCanvasSize(newSize);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Update primary theme color when wallpaper changes
  useEffect(() => {
    updatePrimaryForWallpaper(wallpaper);
  }, [wallpaper, updatePrimaryForWallpaper]);

  // Get wallpaper style from constants
  const getWallpaperStyle = (): React.CSSProperties => {
    const wallpaperConfig = WALLPAPERS[wallpaper];
    const style: React.CSSProperties = {};
    
    if ('pattern' in wallpaperConfig) {
      style.backgroundImage = wallpaperConfig.pattern;
      style.backgroundSize = wallpaper === 'dots' ? '40px 40px' : 'auto';
      style.backgroundRepeat = 'repeat';
    }
    
    return style;
  };

  // --- Mouse Event Handlers ---

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    // For tools that support click-and-drag, start a new drawing action.
    if (currentTool === 'pencil' || currentTool === 'eraser') {
      startDrawing(currentTool as Tool);
    }
    const coords = getPixelCoordinates(event);
    if (coords) {
      // This will handle fill immediately, or start tracking for pencil/eraser.
      drawPixel(coords.x, coords.y, currentTool, currentColor);
    }
  }, [setIsDrawing, startDrawing, getPixelCoordinates, drawPixel, currentColor, currentTool]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && (currentTool === 'pencil' || currentTool === 'eraser')) {
      const coords = getPixelCoordinates(event);
      if (coords) {
        // Continue the current drawing action.
        drawPixel(coords.x, coords.y, currentTool, currentColor);
      }
    }
  }, [isDrawing, getPixelCoordinates, drawPixel, currentColor, currentTool]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      // For click-and-drag tools, end the drawing action to save it to history.
      if (currentTool === 'pencil' || currentTool === 'eraser') {
        endDrawing();
      }
    }
  }, [isDrawing, setIsDrawing, endDrawing, currentTool]);


  // --- Action Functions ---

  const loadPreset = useCallback((presetName: keyof typeof PRESET_TEMPLATES) => {
    const template = PRESET_TEMPLATES[presetName];
    if (template && template.length === 16) {
      const scaledTemplate = Array(gridSize).fill(null).map((_, y) => 
        Array(gridSize).fill(null).map((_, x) => {
          const templateY = Math.floor(y * 16 / gridSize);
          const templateX = Math.floor(x * 16 / gridSize);
          return template[templateY][templateX];
        })
      );
      // Use the new function to make this action undoable
      setPixelsWithHistory(scaledTemplate);
    }
  }, [gridSize, setPixelsWithHistory]);

  const downloadImage = useCallback(() => {
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = gridSize;
    downloadCanvas.height = gridSize;
    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;
    
    // Disable image smoothing to get crisp pixels
    ctx.imageSmoothingEnabled = false;

    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      });
    });

    const link = document.createElement('a');
    link.download = `pixel-art-${gridSize}x${gridSize}-${Date.now()}.png`;
    link.href = downloadCanvas.toDataURL('image/png');
    link.click();
  }, [gridSize, pixels]);

  // Create context values to pass down to children (Sidebar, etc.)
  const editorStateValue = {
    currentTool,
    currentColor,
    customColor,
    gridSize,
    wallpaper,
    onToolChange: setCurrentTool,
    onColorChange: setCurrentColor,
    onCustomColorChange: handleCustomColorChange,
    onGridSizeChange: setGridSize,
    onWallpaperChange: setWallpaper,
  };

  const editorActionsValue = {
    canUndo,
    canRedo,
    onUndo: undo,
    onRedo: redo,
    onClear: clearCanvas,
    onDownload: downloadImage,
    onLoadPreset: loadPreset,
  };

  return (
    <EditorStateProvider value={editorStateValue}>
      <EditorActionsProvider value={{
        ...editorActionsValue,
        onLoadPreset: (preset: string) =>
          editorActionsValue.onLoadPreset(preset as keyof typeof PRESET_TEMPLATES)
      }}>
        <div 
          className={`w-screen h-screen overflow-hidden theme-overlay ${WALLPAPERS[wallpaper].style} ${className || ''}`}
          style={getWallpaperStyle()}
        >
          <div className="flex h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between py-4 px-6 glass-header">
                <div></div>
                <div className="text-center">
                  <h1 className="mb-1">Pixel Art Editor</h1>
                  <p className="text-md dark:text-white">
                    Made this because I can't draw for my life
                  </p>
                </div>
                <div className="flex items-center">
                  <ThemeToggle />
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-6" ref={canvasContainerRef}>
                  <Canvas
                    ref={canvasRef}
                    canvasSize={canvasSize}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp} // Also end drawing if mouse leaves canvas
                  />
              </div>
            </div>
          </div>
        </div>
      </EditorActionsProvider>
    </EditorStateProvider>
  );
});