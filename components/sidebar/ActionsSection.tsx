import React from 'react';
import { Button } from '../ui/button';
import { Undo2, Redo2, Trash2, Download } from 'lucide-react';
import { useEditorActions } from '../../contexts/EditorActionsContext';

export function ActionsSection() {
  const { canUndo, canRedo, onUndo, onRedo, onClear, onDownload } = useEditorActions();

  return (
    <div>
      <label className="text-md mb-2 block">Actions</label>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="w-4 h-4 mr-2" />
            Undo
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 className="w-4 h-4 mr-2" />
            Redo
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
          
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}