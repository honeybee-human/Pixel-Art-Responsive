import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Wallpaper = 'default' | 'hearts' | 'stars' | 'gradient' | 'kawaii' | 'geometric';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  updatePrimaryForWallpaper: (wallpaper: Wallpaper) => void;
  getCurrentPrimary: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define primary color schemes for different wallpapers and themes - SWAPPED
// Update WALLPAPER_PRIMARY_COLORS to include new wallpapers
const WALLPAPER_PRIMARY_COLORS = {
  default: {
    light: 'hsl(220 100% 80%)',
    dark: 'hsl(220 100% 20%)'
  },
  hearts: {
    light: 'hsl(330 100% 75%)',
    dark: 'hsl(330 100% 25%)'
  },
  stars: {
    light: 'hsl(50 100% 75%)',
    dark: 'hsl(50 100% 25%)'
  },
  gradient: {
    light: 'hsl(25 100% 75%)',
    dark: 'hsl(25 100% 25%)'
  },
  kawaii: {
    light: 'hsl(120 100% 75%)',
    dark: 'hsl(120 100% 25%)'
  },
  geometric: {
    light: 'hsl(240 100% 75%)',
    dark: 'hsl(240 100% 25%)'
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) return stored;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentPrimary, setCurrentPrimary] = useState<string>(
    WALLPAPER_PRIMARY_COLORS.default[theme]
  );

  // Update CSS custom properties
  const updateCSSVariables = (primaryColor: string) => {
    const root = document.documentElement;
    
    // Update primary color
    root.style.setProperty('--primary', primaryColor);
    
    // Update related colors based on the primary
    const primaryHSL = primaryColor.match(/hsl\(([^)]+)\)/)?.[1];
    if (primaryHSL) {
      const [h, s, l] = primaryHSL.split(' ').map(v => parseFloat(v.replace('%', '')));
      
      // Create hover state (slightly darker/lighter)
      const hoverL = theme === 'dark' ? Math.max(l - 10, 0) : Math.max(l - 5, 0);
      root.style.setProperty('--primary-hover', `hsl(${h} ${s}% ${hoverL}%)`);
      
      // Create foreground color (white or black based on contrast)
      const foreground = l > 50 ? 'hsl(0 0% 0%)' : 'hsl(0 0% 100%)';
      root.style.setProperty('--primary-foreground', foreground);
    }
  };

  const updatePrimaryForWallpaper = (wallpaper: Wallpaper) => {
    const newPrimary = WALLPAPER_PRIMARY_COLORS[wallpaper][theme];
    setCurrentPrimary(newPrimary);
    updateCSSVariables(newPrimary);
  };

  const getCurrentPrimary = () => currentPrimary;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
    
    // Reset to default primary for theme
    // Keep the default fallback as 'default'
    const defaultPrimary = WALLPAPER_PRIMARY_COLORS.default[theme];
    setCurrentPrimary(defaultPrimary);
    updateCSSVariables(defaultPrimary);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      updatePrimaryForWallpaper,
      getCurrentPrimary
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;