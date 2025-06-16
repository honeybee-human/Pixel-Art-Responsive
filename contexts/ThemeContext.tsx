import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Wallpaper = 'default' | 'dots' | 'hearts' | 'stars' | 'gradient' | 'kawaii';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  updatePrimaryForWallpaper: (wallpaper: Wallpaper) => void;
  getCurrentPrimary: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to determine if a color is light or dark
const isLightColor = (color: string): boolean => {
  // Handle different color formats
  let hex = color;
  
  // Convert named colors or handle CSS variables
  if (color.startsWith('var(')) {
    const computed = getComputedStyle(document.documentElement).getPropertyValue(color.slice(4, -1));
    hex = computed.trim();
  }
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate brightness using luminance formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};

// Define primary color schemes for different wallpapers and themes
const WALLPAPER_PRIMARY_COLORS = {
  default: {
    light: 'hsl(220 100% 20%)',       // Very dark blue
    dark: 'hsl(220 100% 80%)'         // Very light blue
  },
  dots: {
    light: 'hsl(270 100% 25%)',       // Very dark purple
    dark: 'hsl(270 100% 75%)'         // Very light purple
  },
  hearts: {
    light: 'hsl(330 100% 25%)',       // Very dark pink
    dark: 'hsl(330 100% 75%)'         // Very light pink
  },
  stars: {
    light: 'hsl(50 100% 30%)',        // Very dark yellow/gold
    dark: 'hsl(50 100% 70%)'          // Very light yellow
  },
  gradient: {
    light: 'hsl(25 100% 30%)',        // Very dark orange
    dark: 'hsl(25 100% 70%)'          // Very light orange
  },
  kawaii: {
    light: 'hsl(120 100% 20%)',       // Very dark green
    dark: 'hsl(120 100% 70%)'         // Very light green
  }
} as const;

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