import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas } from './Canvas';
import { Sidebar } from './Sidebar';
import { ToolsSection } from './sidebar/ToolsSection';
import { EditorStateProvider } from '../contexts/EditorStateContext';
import { EditorActionsProvider } from '../contexts/EditorActionsContext';
import { useCanvasLogic } from '../hooks/useCanvasLogic';
import { useEditorState } from '../hooks/useEditorState';
import { useTheme } from '../contexts/ThemeContext';
import { PixelArtEditorProps, Tool } from '../types';
import { WALLPAPERS, Wallpaper, Theme } from '../constants/wallpapers';
import { PRESET_TEMPLATES } from '../constants/templates';
import { CANVAS_SIZE_LIMITS } from '../constants/settings';
import { ThemeToggle } from './ui/theme-toggle';
import { Button } from './ui/button';
import { Menu, X, Undo2, Redo2, Pencil, Eraser, Paintbrush } from 'lucide-react';

export const PixelArtEditor = React.memo(function PixelArtEditor({ className }: PixelArtEditorProps) {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(600);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { theme, updatePrimaryForWallpaper } = useTheme();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.getElementById('menu-button');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            menuButton && !menuButton.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

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
        const padding = isMobile ? 16 : 48;
        const availableWidth = containerRect.width - padding;
        const availableHeight = containerRect.height - padding;
        const maxSize = Math.min(availableWidth, availableHeight, CANVAS_SIZE_LIMITS.MAX);
        const newSize = Math.max(maxSize, CANVAS_SIZE_LIMITS.MIN);
        setCanvasSize(newSize);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [isMobile]);

  // Update primary theme color when wallpaper changes
  useEffect(() => {
    updatePrimaryForWallpaper(wallpaper);
  }, [wallpaper, updatePrimaryForWallpaper]);

  // Get wallpaper style from constants
  const getWallpaperStyle = (): React.CSSProperties => {
    const wallpaperConfig = WALLPAPERS[wallpaper as Wallpaper];
    const themeConfig = wallpaperConfig[theme as Theme];
    const style: React.CSSProperties = {};
    
    // For gradient wallpaper, use CSS class instead of inline styles
    if (wallpaper === 'gradient') {
      return {}; // Let the CSS class handle the styling
    }
    
    // Set background
    if (themeConfig.background) {
      style.background = themeConfig.background;
    }
    
    // Set pattern if exists (type-safe check)
    if ('pattern' in themeConfig && themeConfig.pattern) {
      style.backgroundImage = themeConfig.pattern;
      style.backgroundRepeat = 'repeat';
    }
    
    // Set animation if exists (type-safe check)
    if ('animation' in themeConfig && themeConfig.animation) {
      style.animation = themeConfig.animation;
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <EditorStateProvider value={editorStateValue}>
      <EditorActionsProvider value={{
        ...editorActionsValue,
        onLoadPreset: (preset: string) =>
          editorActionsValue.onLoadPreset(preset as keyof typeof PRESET_TEMPLATES)
      }}>
        <div 
          className={`w-screen h-screen overflow-hidden theme-overlay ${
            wallpaper === 'gradient' 
              ? 'bg-rainbow-gradient' 
              : WALLPAPERS[wallpaper as Wallpaper][theme as Theme].style
          } ${className || ''}`}
          style={getWallpaperStyle()}
        >
          <div className="flex h-screen relative">
            {/* Sidebar - Desktop: Always visible, Mobile: Drawer overlay */}
            <div className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
              ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
              transition-transform duration-300 ease-in-out
            `}>
              <Sidebar 
                isMobile={isMobile} 
                onClose={() => setIsSidebarOpen(false)} 
              />
            </div>

            {/* Backdrop for mobile drawer */}
            {isMobile && isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
              <div className="flex items-center justify-between py-2 px-4 md:px-6 glass-header shrink-0">
                <div className="flex items-center">
                  {isMobile && (
                    <Button
                      id="menu-button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleSidebar}
                      className="mr-2"
                    >
                      {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                  )}
                </div>
                
                <div className="text-center">
                  <h1 className="mb-1 text-lg md:text-xl">Pixel Art Editor</h1>
                  <p className="text-sm md:text-md dark:text-white hidden sm:block">
                    Made this because I can't draw for my life
                  </p>
                </div>
                
                <div className="flex items-center">
                  <ThemeToggle />
                </div>
              </div>

              {/* Tools and Actions Bar - Above Canvas */}
              <ToolsSection />

              <div className="flex-1 flex items-center justify-center p-2 md:p-6 min-h-0" ref={canvasContainerRef}>
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