import { Button } from '../ui/button';
import { useEditorActions } from '../../contexts/EditorActionsContext';
import { PRESET_TEMPLATES } from '../../constants/templates';

export function PresetsSection() {
  const { onLoadPreset } = useEditorActions();

  return (
    <div>
      <label className="text-lg mb-3 block font-medium">Preset Templates</label>
      <div className="grid grid-cols-1 gap-3">
        {Object.keys(PRESET_TEMPLATES).map((presetName) => (
          <Button
            key={presetName}
            variant="outline"
            size="lg"
            onClick={() => onLoadPreset(presetName)}
            className="text-lg capitalize h-14 hover:scale-105 transition-transform"
          >
            {presetName.replace(/([A-Z])/g, ' $1').trim()}
          </Button>
        ))}
      </div>
    </div>
  );
}