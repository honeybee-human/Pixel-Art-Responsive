import { useEditorState } from '../../contexts/EditorStateContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { GRID_SIZES } from '../../constants/settings';

export function GridSizeSection() {
  const { gridSize, onGridSizeChange } = useEditorState();

  return (
    <div>
      <label className="text-lg mb-3 block font-medium">Grid Size</label>
      <Select value={gridSize.toString()} onValueChange={(value) => onGridSizeChange(parseInt(value))}>
        <SelectTrigger className="w-full h-14 text-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {GRID_SIZES.map(size => (
            <SelectItem key={size} value={size.toString()} className="text-lg py-3">{size}×{size}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}