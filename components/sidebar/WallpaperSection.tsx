import React from 'react';
import { useEditorState } from '../../contexts/EditorStateContext';
import { WALLPAPERS } from '../../constants/wallpapers';
import { useTheme } from '../../contexts/ThemeContext';

export function WallpaperSection() {
  const { wallpaper, onWallpaperChange } = useEditorState();
  const { theme } = useTheme();

  const getWallpaperStyle = (wallpaperKey: string) => {
    const config = WALLPAPERS[wallpaperKey as keyof typeof WALLPAPERS];
    const themeConfig = config[theme];
    const style: React.CSSProperties = {};
    
    // Set background
    if (themeConfig.background) {
      style.background = themeConfig.background;
    }
    
    // Set pattern if exists (type-safe check)
    if ('pattern' in themeConfig && themeConfig.pattern) {
      style.backgroundImage = themeConfig.pattern;
      style.backgroundSize = wallpaperKey === 'dots' ? '40px 40px' : 'auto';
      style.backgroundRepeat = 'repeat';
    }
    
    // Set animation if exists (type-safe check) - but disable for preview
    if ('animation' in themeConfig && themeConfig.animation) {
      // Don't apply animation to preview for performance
      style.backgroundSize = style.backgroundSize || '600% 600%';
    }
    
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