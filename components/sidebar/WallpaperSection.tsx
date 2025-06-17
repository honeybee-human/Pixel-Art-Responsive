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
      <label className="text-lg mb-3 block font-medium">Wallpaper</label>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(WALLPAPERS).map(([key]) => (
          <button
            key={key}
            onClick={() => onWallpaperChange(key as any)}
            className={`p-2 rounded-xl border-4 transition-all duration-300 hover:scale-105 shadow-md ${
              key === 'gradient' ? 'bg-rainbow-gradient' : ''
            } ${
              wallpaper === key 
                ? 'border-primary bg-primary/10 ring-4 ring-primary ring-offset-2' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div 
              className={`w-full rounded-lg ${
                key === 'gradient' ? 'bg-rainbow-gradient' : ''
              } h-12 md:h-12 sm:h-16`}
              style={key === 'gradient' ? {} : getWallpaperStyle(key)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}