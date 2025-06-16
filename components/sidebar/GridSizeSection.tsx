import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEditorState } from '../../contexts/EditorStateContext';
import { GRID_SIZES } from '../../constants/settings';

export function GridSizeSection() {
  const { gridSize, onGridSizeChange } = useEditorState();

  return (
    <div>
      <label className="text-sm mb-2 block">Grid Size</label>
      <Select value={gridSize.toString()} onValueChange={(value) => onGridSizeChange(parseInt(value))}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {GRID_SIZES.map(size => (
            <SelectItem key={size} value={size.toString()}>{size}×{size}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}