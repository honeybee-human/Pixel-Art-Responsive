import React from 'react';
import { Button } from '../ui/button';
import { useEditorState } from '../../contexts/EditorStateContext';
import { PRESET_COLORS } from '../../constants/colors';

export function ColorSection() {
  const { currentColor, customColor, onColorChange, onCustomColorChange } = useEditorState();

  return (
    <div>
      <label className="text-sm mb-2 block">Colors</label>
      
      {/* Custom Color Picker */}
      <div className="mb-3">
        <label className="text-xs mb-1 block text-muted-foreground">Custom Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            className="w-8 h-8 rounded border border-border cursor-pointer"
          />
          <span className="text-xs font-mono">{customColor}</span>
        </div>
      </div>
      
      {/* Preset Colors */}
      <div>
        <label className="text-xs mb-1 block text-muted-foreground">Preset Colors</label>
        <div className="grid grid-cols-6 gap-1">
          {PRESET_COLORS.map((color) => (
            <Button
              key={color}
              variant={currentColor === color ? 'default' : 'outline'}
              size="sm"
              onClick={() => onColorChange(color)}
              className="w-8 h-8 p-0 border-2"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}