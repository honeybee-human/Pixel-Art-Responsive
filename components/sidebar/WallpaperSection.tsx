import React from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useEditorState } from '../../contexts/EditorStateContext';
import { WALLPAPERS } from '../../constants/wallpapers';

export function WallpaperSection() {
  const { wallpaper, onWallpaperChange } = useEditorState();

  return (
    <div>
      <label className="text-md mb-2 block">Wallpaper</label>
      <div className="grid grid-cols-3 gap-1">
        {Object.entries(WALLPAPERS).map(([key, config]) => (
          <Button
            key={key}
            variant={wallpaper === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => onWallpaperChange(key as any)}
            className="text-md p-2 h-auto"
          >
            {key === 'default' && <X className="w-3 h-3" />}
            {key === 'dots' && '🟣'}
            {key === 'hearts' && '💖'}
            {key === 'stars' && '⭐'}
            {key === 'gradient' && '🌈'}
            {key === 'kawaii' && '🌻'}
          </Button>
        ))}
      </div>
    </div>
  );
}