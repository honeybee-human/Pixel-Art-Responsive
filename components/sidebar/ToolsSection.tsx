import { useEditorState } from '../../contexts/EditorStateContext';
import { useEditorActions } from '../../contexts/EditorActionsContext';
import { Button } from '../ui/button';
import { Pencil, Eraser, Paintbrush, Undo2, Redo2, X, Download } from 'lucide-react';

export function ToolsSection() {
  const { currentTool, onToolChange } = useEditorState();
  const { canUndo, canRedo, onUndo, onRedo, onClear, onDownload } = useEditorActions();

  return (
    <div className="flex items-center justify-center gap-3 py-4 px-4 shrink-0">
      {/* Tools */}
      <Button
        variant={currentTool === 'pencil' ? 'default' : 'outline'}
        size="lg"
        onClick={() => onToolChange('pencil')}
        className="p-4 h-14 w-14"
      >
        <Pencil className="w-7 h-7" />
      </Button>
      <Button
        variant={currentTool === 'eraser' ? 'default' : 'outline'}
        size="lg"
        onClick={() => onToolChange('eraser')}
        className="p-4 h-14 w-14"
      >
        <Eraser className="w-7 h-7" />
      </Button>
      <Button
        variant={currentTool === 'fill' ? 'default' : 'outline'}
        size="lg"
        onClick={() => onToolChange('fill')}
        className="p-4 h-14 w-14"
      >
        <Paintbrush className="w-7 h-7" />
      </Button>
      
      {/* Separator */}
      <div className="w-px h-10 bg-border mx-3" />
      
      {/* Actions */}
      <Button 
        variant="outline" 
        size="lg" 
        onClick={onUndo}
        disabled={!canUndo}
        className="p-4 h-14 w-14"
      >
        <Undo2 className="w-7 h-7" />
      </Button>
      
      <Button 
        variant="outline" 
        size="lg" 
        onClick={onRedo}
        disabled={!canRedo}
        className="p-4 h-14 w-14"
      >
        <Redo2 className="w-7 h-7" />
      </Button>
      
      <Button 
        variant="outline" 
        size="lg" 
        onClick={onClear}
        className="p-4 h-14 w-14"
      >
        <X className="w-7 h-7" />
      </Button>
      
      <Button 
        variant="outline" 
        size="lg" 
        onClick={onDownload}
        className="p-4 h-14 w-14"
      >
        <Download className="w-7 h-7" />
      </Button>
    </div>
  );
}