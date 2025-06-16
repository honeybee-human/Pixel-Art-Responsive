import React from 'react';
import { Button } from '../ui/button';
import { useEditorState } from '../../contexts/EditorStateContext';
import { PRESET_COLORS } from '../../constants/colors';

export function ColorSection() {
  const { currentColor, customColor, onColorChange, onCustomColorChange } = useEditorState();

  return (
    <div>
      
      {/* Current Color Display */}
      <div className="mb-3">
        <label className="text-md mb-1 block">Current Color</label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded border-2 border-border"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-md font-mono">{currentColor}</span>
        </div>
      </div>
      
      {/* Custom Color Picker */}
      <div className="mb-3">
        <label className="text-md mb-1 block">Custom Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            className="w-8 h-8 rounded border border-border cursor-pointer hover:scale-110 transition-transform"
          />
          <span className="text-md font-mono">{customColor}</span>
        </div>
      </div>
      
      {/* Preset Colors */}
      <div>
        <label className="text-md mb-1 block">Preset Colors</label>
        <div className="grid grid-cols-6 gap-1">
          {PRESET_COLORS.map((color) => (
            <Button
              key={color}
              variant={currentColor === color ? 'default' : 'outline'}
              size="sm"
              onClick={() => onColorChange(color)}
              className={`w-8 h-8 p-0 border-2 transition-all duration-200 hover:scale-110 hover:border-primary ${
                currentColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}