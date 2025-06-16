import { useCallback, useEffect, useRef, useState } from 'react';
import { Tool } from '../types';
import { MAX_HISTORY_SIZE } from '../constants/settings';

export function useCanvasLogic(gridSize: number, canvasSize: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixels, setPixels] = useState<string[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Undo/Redo state
  const [history, setHistory] = useState<string[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const cellSize = canvasSize / gridSize;

  // Save current state to history
  const saveToHistory = useCallback((newPixels: string[][]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newPixels.map(row => [...row]));
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        setHistoryIndex(prev => prev); // Don't increment if we removed from start
        return newHistory;
      }
      
      return newHistory;
    });
    setHistoryIndex(prev => {
      const newIndex = prev + 1;
      return newIndex >= MAX_HISTORY_SIZE ? MAX_HISTORY_SIZE - 1 : newIndex;
    });
  }, [historyIndex]);

  // Initialize empty canvas
  useEffect(() => {
    const newPixels = Array(gridSize).fill(null).map(() => Array(gridSize).fill('transparent'));
    setPixels(newPixels);
    
    // Reset history when grid size changes
    setHistory([newPixels.map(row => [...row])]);
    setHistoryIndex(0);
  }, [gridSize]);

  // Draw on canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw pixels
    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      });
    });

    // Draw grid
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }
  }, [pixels, gridSize, canvasSize, cellSize]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getPixelCoordinates = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      return { x, y };
    }
    return null;
  }, [cellSize, gridSize]);

  const floodFill = useCallback((startX: number, startY: number, newColor: string) => {
    const targetColor = pixels[startY][startX];
    if (targetColor === newColor) return;

    // Save current state before flood fill operation
    saveToHistory(pixels);

    const newPixels = pixels.map(row => [...row]);
    const stack = [{ x: startX, y: startY }];

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current) continue;
      
      const { x, y } = current;
      
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;
      if (newPixels[y][x] !== targetColor) continue;

      newPixels[y][x] = newColor;

      stack.push({ x: x + 1, y });
      stack.push({ x: x - 1, y });
      stack.push({ x, y: y + 1 });
      stack.push({ x, y: y - 1 });
    }

    setPixels(newPixels);
  }, [pixels, gridSize, saveToHistory]);

  const drawPixel = useCallback((x: number, y: number, currentTool: Tool, currentColor: string) => {
    if (currentTool === 'fill') {
      floodFill(x, y, currentColor);
      return;
    }
    
    const newPixels = [...pixels];
    
    if (currentTool === 'pencil') {
      newPixels[y][x] = currentColor;
    } else if (currentTool === 'eraser') {
      newPixels[y][x] = 'transparent';
    }
    
    setPixels(newPixels);
  }, [pixels, floodFill]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPixels(history[newIndex].map(row => [...row]));
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPixels(history[newIndex].map(row => [...row]));
    }
  }, [historyIndex, history]);

  const clearCanvas = useCallback(() => {
    // Save current state before clearing
    saveToHistory(pixels);
    
    const newPixels = Array(gridSize).fill(null).map(() => Array(gridSize).fill('transparent'));
    setPixels(newPixels);
  }, [pixels, gridSize, saveToHistory]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
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
  };
}