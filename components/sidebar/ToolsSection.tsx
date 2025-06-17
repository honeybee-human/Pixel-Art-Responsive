import { useEditorState } from '../../contexts/EditorStateContext';
import { Button } from '../ui/button';
import { Pencil, Eraser, Paintbrush } from 'lucide-react';

export function ToolsSection() {
  const { currentTool, onToolChange } = useEditorState();

  return (
    <div>
      <label className="text-md mb-2 block">Tools</label>
      <div className="flex items-center gap-2">
        <Button
          variant={currentTool === 'pencil' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToolChange('pencil')}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant={currentTool === 'eraser' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToolChange('eraser')}
        >
          <Eraser className="w-4 h-4" />
        </Button>
        <Button
          variant={currentTool === 'fill' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onToolChange('fill')}
        >
          <Paintbrush className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}