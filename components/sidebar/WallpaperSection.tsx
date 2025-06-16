import React from 'react';
import { useEditorState } from '../../contexts/EditorStateContext';
import { WALLPAPERS } from '../../constants/wallpapers';

export function WallpaperSection() {
  const { wallpaper, onWallpaperChange } = useEditorState();

  const getWallpaperStyle = (wallpaperKey: string) => {
    const config = WALLPAPERS[wallpaperKey as keyof typeof WALLPAPERS];
    const style: React.CSSProperties = {};
    
    if ('pattern' in config) {
      style.backgroundImage = config.pattern;
      style.backgroundSize = wallpaperKey === 'dots' ? '40px 40px' : 'auto';
      style.backgroundRepeat = 'repeat';
    } else if (wallpaperKey === 'default') {
      style.background = 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)';
    } else if (wallpaperKey === 'gradient') {
      style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)';
      style.backgroundSize = '600% 600%';
    }
    
    // Add base background color
    if (wallpaperKey === 'dots') style.backgroundColor = '#faf5ff';
    else if (wallpaperKey === 'hearts') style.backgroundColor = '#fdf2f8';
    else if (wallpaperKey === 'stars') style.backgroundColor = '#fefce8';
    else if (wallpaperKey === 'kawaii') style.backgroundColor = '#f0fdf4';
    
    return style;
  };

  return (
    <div>
      <h3>Wallpaper</h3>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(WALLPAPERS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => onWallpaperChange(key as any)}
            className={`p-1 rounded-lg border-2 transition-all duration-300 ${
              wallpaper === key 
                ? 'border-primary bg-primary/10' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div 
              className="w-full h-10 rounded-md"
              style={getWallpaperStyle(key)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}