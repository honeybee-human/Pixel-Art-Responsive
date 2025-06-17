import { useEditorState } from '../../contexts/EditorStateContext';
import { Button } from '../ui/button';
import { PRESET_COLORS } from '../../constants/colors';

export function ColorSection() {
  const { currentColor, customColor, onColorChange, onCustomColorChange } = useEditorState();

  const isCustomColorSelected = currentColor === customColor && !PRESET_COLORS.includes(currentColor);

  return (
    <div>
      {/* Custom Color Picker */}
      <div className="mb-6">
        <label className="text-lg mb-3 block font-medium">Custom Color</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={customColor}
            onChange={(e) => onCustomColorChange(e.target.value)}
            className={`w-16 h-16 rounded-lg border-4 cursor-pointer hover:scale-105 transition-all duration-200 shadow-md ${
              isCustomColorSelected 
                ? 'border-primary ring-4 ring-primary ring-offset-2' 
                : 'border-border hover:border-primary'
            }`}
          />
          <span className="text-lg font-mono">{customColor}</span>
        </div>
      </div>
      
      {/* Preset Colors */}
      <div>
        <label className="text-lg mb-3 block font-medium">Preset Colors</label>
        <div className="grid grid-cols-4 gap-3">
          {PRESET_COLORS.map((color) => (
            <Button
              key={color}
              variant={currentColor === color ? 'default' : 'outline'}
              size="lg"
              onClick={() => onColorChange(color)}
              className={`w-16 h-16 p-0 border-4 transition-all duration-200 hover:scale-105 hover:border-primary rounded-lg shadow-md ${
                currentColor === color ? 'ring-4 ring-primary ring-offset-2 border-primary' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}