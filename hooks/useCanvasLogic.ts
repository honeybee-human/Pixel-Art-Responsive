import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_HISTORY_SIZE } from '../constants/settings';
import { DrawAction, Tool, PixelChange } from 'types';

export function useCanvasLogic(gridSize: number, canvasSize: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pixels, setPixels] = useState<string[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Action-based undo/redo stacks
  const [undoStack, setUndoStack] = useState<DrawAction[]>([]);
  const [redoStack, setRedoStack] = useState<DrawAction[]>([]);
  
  // Ref to track changes for the current continuous action (e.g., a single pencil stroke)
  const currentDrawActionRef = useRef<DrawAction | null>(null);

  const cellSize = canvasSize / gridSize;

  // Initialize or reset the canvas and history
  useEffect(() => {
    const newPixels = Array(gridSize).fill(null).map(() => Array(gridSize).fill('transparent'));
    setPixels(newPixels);
    setUndoStack([]);
    setRedoStack([]);
    currentDrawActionRef.current = null;
  }, [gridSize]);

  // Save a completed action to the undo stack
  const saveAction = useCallback((action: DrawAction) => {
    if (action.changes.length === 0) return;
    setUndoStack(prev => {
      const newStack = [...prev, action];
      // Trim history if it exceeds the max size
      return newStack.length > MAX_HISTORY_SIZE ? newStack.slice(newStack.length - MAX_HISTORY_SIZE) : newStack;
    });
    // A new action clears the redo stack
    setRedoStack([]);
  }, []);

  // --- Functions to be called by the component's event handlers ---

  // Call this on mouseDown for pencil/eraser
  const startDrawing = useCallback((tool: Tool) => {
    const actionType = tool === 'pencil' ? 'draw' : 'erase';
    currentDrawActionRef.current = { type: actionType, changes: [] };
  }, []);

  // Call this on mouseUp/mouseLeave
  const endDrawing = useCallback(() => {
    if (currentDrawActionRef.current && currentDrawActionRef.current.changes.length > 0) {
      saveAction(currentDrawActionRef.current);
    }
    currentDrawActionRef.current = null;
  }, [saveAction]);


  // --- Internal functions for modifying pixels ---

  const applyChangesToPixels = (
    currentPixels: string[][],
    changes: PixelChange[],
    direction: 'forward' | 'backward'
  ) => {
    const newPixels = currentPixels.map(row => [...row]);
    const changesToApply = direction === 'forward' ? changes : [...changes].reverse();

    changesToApply.forEach(change => {
      const { x, y } = change;
      newPixels[y][x] = direction === 'forward' ? change.newColor : change.oldColor;
    });
    return newPixels;
  };

  const changePixel = useCallback((x: number, y: number, newColor: string) => {
    // This function now only handles the visual change and tracking, not history saving.
    setPixels(prevPixels => {
      const oldColor = prevPixels[y][x];
      if (oldColor === newColor) return prevPixels;

      // If we are in a drawing action, record the change in the ref.
      if (currentDrawActionRef.current) {
        // To save memory, only store the *first* state of the pixel for this action.
        const hasChangedBefore = currentDrawActionRef.current.changes.some(c => c.x === x && c.y === y);
        if (!hasChangedBefore) {
          currentDrawActionRef.current.changes.push({ x, y, oldColor, newColor });
        }
      }

      const newPixels = prevPixels.map(row => [...row]);
      newPixels[y][x] = newColor;
      return newPixels;
    });
  }, []);
  
  const floodFill = useCallback((startX: number, startY: number, newColor: string) => {
    const targetColor = pixels[startY][startX];
    if (targetColor === newColor) return;

    const fillAction: DrawAction = { type: 'fill', changes: [] };
    const newPixels = pixels.map(row => [...row]);
    const stack = [{ x: startX, y: startY }];

    while (stack.length > 0) {
      const { x, y } = stack.pop()!;
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize || newPixels[y][x] !== targetColor) continue;
      
      // Record the change and update the pixel
      fillAction.changes.push({ x, y, oldColor: targetColor, newColor });
      newPixels[y][x] = newColor;

      stack.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
    }

    if (fillAction.changes.length > 0) {
      setPixels(newPixels);
      saveAction(fillAction); // Flood fill is a single, atomic action
    }
  }, [pixels, gridSize, saveAction]);


  // --- Public API for the component ---

  const drawPixel = useCallback((x: number, y: number, tool: Tool, color: string) => {
    if (tool === 'fill') {
      floodFill(x, y, color);
      return;
    }
    const newColor = tool === 'eraser' ? 'transparent' : color;
    changePixel(x, y, newColor);
  }, [floodFill, changePixel]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastAction]);
    
    setPixels(prev => applyChangesToPixels(prev, lastAction.changes, 'backward'));
  }, [undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    
    const actionToRedo = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, actionToRedo]);
    
    setPixels(prev => applyChangesToPixels(prev, actionToRedo.changes, 'forward'));
  }, [redoStack]);

  const clearCanvas = useCallback(() => {
    const changes: PixelChange[] = [];
    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color !== 'transparent') {
          changes.push({ x, y, oldColor: color, newColor: 'transparent' });
        }
      });
    });
    
    if (changes.length > 0) {
      setPixels(Array(gridSize).fill(null).map(() => Array(gridSize).fill('transparent')));
      saveAction({ type: 'erase', changes });
    }
  }, [pixels, gridSize, saveAction]);

  // New function to manually set pixels and create a history entry.
  // Useful for loading presets.
  const setPixelsWithHistory = useCallback((newPixels: string[][]) => {
      const changes: PixelChange[] = [];
      for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
              if (pixels[y][x] !== newPixels[y][x]) {
                  changes.push({ x, y, oldColor: pixels[y][x], newColor: newPixels[y][x] });
              }
          }
      }
      if (changes.length > 0) {
          setPixels(newPixels);
          saveAction({ type: 'draw', changes });
      }
  }, [pixels, gridSize, saveAction]);


  // ... The rest of the hook is for drawing, no changes needed here ...
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      });
    });
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
  
  // The new public API for our hook
  return {
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
    setPixelsWithHistory, // New function for presets
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}