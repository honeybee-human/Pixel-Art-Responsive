import React from 'react';
import { Button } from '../ui/button';
import { useEditorActions } from '../../contexts/EditorActionsContext';
import { PRESET_TEMPLATES } from '../../constants/templates';

export function PresetsSection() {
  const { onLoadPreset } = useEditorActions();

  return (
    <div>
      <label className="text-sm mb-2 block">Preset Templates</label>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(PRESET_TEMPLATES).map((presetName) => (
          <Button
            key={presetName}
            variant="outline"
            size="sm"
            onClick={() => onLoadPreset(presetName)}
            className="text-xs capitalize"
          >
            {presetName.replace(/([A-Z])/g, ' $1').trim()}
          </Button>
        ))}
      </div>
    </div>
  );
}