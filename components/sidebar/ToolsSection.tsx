import { useEditorState } from '../../contexts/EditorStateContext';
import { useEditorActions } from '../../contexts/EditorActionsContext';
import { Button } from '../ui/button';
import { Pencil, Eraser, Paintbrush, Undo2, Redo2, X, Download } from 'lucide-react';

export function ToolsSection() {
  const { currentTool, onToolChange } = useEditorState();
  const { canUndo, canRedo, onUndo, onRedo, onClear, onDownload } = useEditorActions();

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4 px-4 shrink-0">
      {/* Desktop: Single row, Mobile: Two rows */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* First row on mobile: Tools */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant={currentTool === 'pencil' ? 'default' : 'outline'}
            size="lg"
            onClick={() => onToolChange('pencil')}
            className="p-3 h-12 w-12 sm:h-14 sm:w-14 sm:p-4"
          >
            <Pencil className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
          <Button
            variant={currentTool === 'eraser' ? 'default' : 'outline'}
            size="lg"
            onClick={() => onToolChange('eraser')}
            className="p-3 h-12 w-12 sm:h-14 sm:w-14 sm:p-4"
          >
            <Eraser className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
          <Button
            variant={currentTool === 'fill' ? 'default' : 'outline'}
            size="lg"
            onClick={() => onToolChange('fill')}
            className="p-3 h-12 w-12 sm:h-14 sm:w-14 sm:p-4"
          >
            <Paintbrush className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
        </div>
        
        {/* Separator - vertical on mobile, horizontal on desktop */}
        <div className="w-10 h-px sm:w-px sm:h-10 bg-border sm:mx-3" />
        
        {/* Second row on mobile: Actions */}
        <div className="flex items-center justify-center gap-3">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onUndo}
            disabled={!canUndo}
            className="p-3 h-12 w-12 sm:h-14 sm:w-14 sm:p-4"
          >
            <Undo2 className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onRedo}
            disabled={!canRedo}
            className="p-3 h-12 w-12 sm:h-14 sm:w-14 sm:p-4"
          >
            <Redo2 className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onClear}
            className="p-3 h-12 w-12 sm:h-14 sm:w-14 sm:p-4"
          >
            <X className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onDownload}
            className="p-3 h-12 w-12 sm:h-14 sm:w-14 sm:p-4"
          >
            <Download className="w-5 h-5 sm:w-7 sm:h-7" />
          </Button>
        </div>
      </div>
    </div>
  );
}