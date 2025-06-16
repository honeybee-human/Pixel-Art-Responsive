import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { EditorStateProvider } from '../contexts/EditorStateContext';
import { EditorActionsProvider } from '../contexts/EditorActionsContext';
import { useCanvasLogic } from '../hooks/useCanvasLogic';
import { useEditorState } from '../hooks/useEditorState';
import { PixelArtEditorProps } from '../types';
import { WALLPAPERS } from '../constants/wallpapers';
import { PRESET_TEMPLATES } from '../constants/templates';
import { CANVAS_SIZE_LIMITS } from '../constants/settings';

// Use React.memo for expensive components
export const PixelArtEditor = React.memo(function PixelArtEditor({ className }: PixelArtEditorProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = React.useState(600);

  // Editor state management
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

  // Canvas logic management
  const {
    canvasRef,
    pixels,
    setPixels,
    isDrawing,
    setIsDrawing,
    getPixelCoordinates,
    drawPixel,
    saveToHistory,
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo
  } = useCanvasLogic(gridSize, canvasSize);

  // Calculate canvas size based on available space
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const container = canvasContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const availableSize = Math.min(containerRect.width, containerRect.height) - CANVAS_SIZE_LIMITS.PADDING;
        const newSize = Math.max(CANVAS_SIZE_LIMITS.MIN, Math.min(CANVAS_SIZE_LIMITS.MAX, availableSize));
        setCanvasSize(newSize);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Get wallpaper style
  const getWallpaperStyle = () => {
    const wallpaperConfig = WALLPAPERS[wallpaper];
    const style: React.CSSProperties = {};
    
    if ('pattern' in wallpaperConfig) {
      style.backgroundImage = wallpaperConfig.pattern;
      style.backgroundSize = wallpaper === 'dots' ? '40px 40px' : 'auto';
      style.backgroundRepeat = 'repeat';
    }
    
    return style;
  };

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getPixelCoordinates(event);
    if (coords) {
      // Save current state before making changes (for non-fill tools)
      if (currentTool !== 'fill') {
        saveToHistory(pixels);
      }
      
      setIsDrawing(true);
      drawPixel(coords.x, coords.y, currentTool, currentColor);
    }
  }, [getPixelCoordinates, currentTool, saveToHistory, pixels, setIsDrawing, drawPixel, currentColor]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getPixelCoordinates(event);
    if (coords && currentTool !== 'fill') {
      drawPixel(coords.x, coords.y, currentTool, currentColor);
    }
  }, [isDrawing, getPixelCoordinates, currentTool, drawPixel, currentColor]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, [setIsDrawing]);

  const loadPreset = useCallback((presetName: keyof typeof PRESET_TEMPLATES) => {
    // Save current state before loading preset
    saveToHistory(pixels);
    
    const template = PRESET_TEMPLATES[presetName];
    if (template && template.length === 16) {
      // Scale template to current grid size
      const scaledTemplate = Array(gridSize).fill(null).map((_, y) => 
        Array(gridSize).fill(null).map((_, x) => {
          const templateY = Math.floor(y * 16 / gridSize);
          const templateX = Math.floor(x * 16 / gridSize);
          return template[templateY][templateX];
        })
      );
      setPixels(scaledTemplate);
    }
  }, [saveToHistory, pixels, gridSize, setPixels]);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas without the grid
    const downloadCanvas = document.createElement('canvas');
    const downloadCtx = downloadCanvas.getContext('2d');
    if (!downloadCtx) return;

    downloadCanvas.width = gridSize;
    downloadCanvas.height = gridSize;

    // Draw only the pixels (no grid)
    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color !== 'transparent') {
          downloadCtx.fillStyle = color;
          downloadCtx.fillRect(x, y, 1, 1);
        }
      });
    });

    // Download the image
    const link = document.createElement('a');
    link.download = `pixel-art-${gridSize}x${gridSize}-${Date.now()}.png`;
    link.href = downloadCanvas.toDataURL();
    link.click();
  }, [canvasRef, gridSize, pixels]);

  // Create context values
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
    onLoadPreset: loadPreset
  };

  return (
    <EditorStateProvider value={editorStateValue}>
      <EditorActionsProvider value={{
        ...editorActionsValue,
        onLoadPreset: (preset: string) =>
          editorActionsValue.onLoadPreset(preset as keyof typeof PRESET_TEMPLATES)
      }}>
        <div 
          className={`w-screen h-screen overflow-hidden ${WALLPAPERS[wallpaper].style} ${className}`}
          style={getWallpaperStyle()}
        >
          {/* Header */}
          <div className="flex items-center justify-center py-4 px-6 glass-header">
            <div className="text-center">
              <h1 className="mb-1">Pixel Art Editor</h1>
              <p className="text-xs text-muted-foreground">
                Create amazing pixel art with tools, colors, and templates
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex h-[calc(100vh-80px)]">
            {/* Tools Sidebar */}
            <Sidebar />

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div 
                ref={canvasContainerRef}
                className="w-full h-full flex items-center justify-center"
              >
                <Canvas
                  ref={canvasRef}
                  canvasSize={canvasSize}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
            </div>
          </div>
        </div>
      </EditorActionsProvider>
    </EditorStateProvider>
  );
});
