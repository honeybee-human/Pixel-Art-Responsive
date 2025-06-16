import { useCallback } from 'react';
import { useCanvasLogic } from './useCanvasLogic';
import { PRESET_TEMPLATES } from '../constants/templates';

export function useEditorActions(canvasLogic: ReturnType<typeof useCanvasLogic>, gridSize: number) {
  const { pixels, setPixels, saveToHistory, undo, redo, clearCanvas, canUndo, canRedo, canvasRef } = canvasLogic;

  const loadPreset = useCallback((presetName: keyof typeof PRESET_TEMPLATES) => {
    saveToHistory(pixels);
    const template = PRESET_TEMPLATES[presetName];
    if (template && template.length === 16) {
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

    const downloadCanvas = document.createElement('canvas');
    const downloadCtx = downloadCanvas.getContext('2d');
    if (!downloadCtx) return;

    downloadCanvas.width = gridSize;
    downloadCanvas.height = gridSize;

    pixels.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color !== 'transparent') {
          downloadCtx.fillStyle = color;
          downloadCtx.fillRect(x, y, 1, 1);
        }
      });
    });

    const link = document.createElement('a');
    link.download = `pixel-art-${gridSize}x${gridSize}-${Date.now()}.png`;
    link.href = downloadCanvas.toDataURL();
    link.click();
  }, [canvasRef, gridSize, pixels]);

  return {
    // History actions
    undo,
    redo,
    canUndo,
    canRedo,
    
    // Canvas actions
    clearCanvas,
    downloadImage,
    loadPreset
  };
}