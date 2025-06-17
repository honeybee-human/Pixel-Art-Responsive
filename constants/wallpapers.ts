type Wallpaper = 'default' | 'hearts' | 'stars' | 'gradient' | 'kawaii' | 'geometric';
type Theme = 'light' | 'dark';

// Enhanced wallpaper configurations with theme-specific variations
const WALLPAPERS = {
  default: {
    name: 'Ocean Waves',
    light: {
      style: 'bg-blue-50',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 30%, #90caf9 60%, #64b5f6 100%)'
    },
    dark: {
      style: 'bg-slate-900',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 60%, #475569 100%)'
    }
  },
  hearts: {
    name: 'Floating Hearts',
    light: {
      style: 'bg-pink-50',
      background: '#fdf2f8',
      pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ec4899' fill-opacity='0.3'%3E%3Cpath d='M20 30c-4-6-8-10-8-14 0-4 4-6 8-2 4-4 8-2 8 2 0 4-4 8-8 14z'/%3E%3C/g%3E%3C/svg%3E")`
    },
    dark: {
      style: 'bg-pink-900',
      background: '#4c1d95',
      pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f472b6' fill-opacity='0.5'%3E%3Cpath d='M20 30c-4-6-8-10-8-14 0-4 4-6 8-2 4-4 8-2 8 2 0 4-4 8-8 14z'/%3E%3C/g%3E%3C/svg%3E")`
    }
  },
  stars: {
    name: 'Starry Night',
    light: {
      style: 'bg-yellow-50',
      background: '#fefce8',
      pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23eab308' fill-opacity='0.4'%3E%3Cpath d='M30 15l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z'/%3E%3C/g%3E%3C/svg%3E")`
    },
    dark: {
      style: 'bg-blue-900',
      background: '#0c1844',
      pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fbbf24' fill-opacity='0.6'%3E%3Cpath d='M30 15l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z'/%3E%3C/g%3E%3C/svg%3E")`
    }
  },
  gradient: {
    name: 'Rainbow Dreams',
    light: {
      style: 'bg-gradient-to-br',
      background: 'linear-gradient(45deg, #ff9a9e, #fecfef, #fecfef, #a8edea, #fed6e3)',
      animation: 'gradientShift 8s ease infinite'
    },
    dark: {
      style: 'bg-gradient-to-br',
      background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe)',
      animation: 'gradientShift 8s ease infinite'
    }
  },
  kawaii: {
    name: 'Sakura Garden',
    light: {
      style: 'bg-green-50',
      background: '#f0fdf4',
      pattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.3'%3E%3Cpath d='M25 15c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M25 27c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M15 21c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M35 21c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Ccircle cx='25' cy='25' r='2' fill='%23f472b6'/%3E%3C/g%3E%3C/svg%3E")`
    },
    dark: {
      style: 'bg-emerald-900',
      background: '#022c22',
      pattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2334d399' fill-opacity='0.4'%3E%3Cpath d='M25 15c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M25 27c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M15 21c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M35 21c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Ccircle cx='25' cy='25' r='2' fill='%23fb7185'/%3E%3C/g%3E%3C/svg%3E")`
    }
  },
  geometric: {
    name: 'Geometric Patterns',
    light: {
      style: 'bg-indigo-50',
      background: '#eef2ff',
      pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%236366f1' stroke-width='1' stroke-opacity='0.3'%3E%3Cpath d='M30 0v60M0 30h60M15 15l30 30M45 15L15 45'/%3E%3C/g%3E%3C/svg%3E")`
    },
    dark: {
      style: 'bg-indigo-900',
      background: '#1e1b4b',
      pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23a5b4fc' stroke-width='1' stroke-opacity='0.5'%3E%3Cpath d='M30 0v60M0 30h60M15 15l30 30M45 15L15 45'/%3E%3C/g%3E%3C/svg%3E")`
    }
  }
};

// Multiple shade options for each wallpaper
const WALLPAPER_COLOR_SHADES = {
  default: {
    light: [
      { name: 'Ocean Blue', value: 'hsl(210, 100%, 56%)' },
      { name: 'Deep Sea', value: 'hsl(210, 100%, 45%)' },
      { name: 'Navy', value: 'hsl(210, 100%, 35%)' },
      { name: 'Midnight', value: 'hsl(210, 100%, 25%)' }
    ],
    dark: [
      { name: 'Light Blue', value: 'hsl(210, 100%, 75%)' },
      { name: 'Sky Blue', value: 'hsl(210, 100%, 65%)' },
      { name: 'Bright Blue', value: 'hsl(210, 100%, 55%)' },
      { name: 'Electric Blue', value: 'hsl(210, 100%, 45%)' }
    ]
  },
  hearts: {
    light: [
      { name: 'Pink', value: 'hsl(330, 100%, 50%)' },
      { name: 'Deep Pink', value: 'hsl(330, 100%, 40%)' },
      { name: 'Rose', value: 'hsl(330, 100%, 30%)' },
      { name: 'Dark Rose', value: 'hsl(330, 100%, 20%)' }
    ],
    dark: [
      { name: 'Light Pink', value: 'hsl(330, 100%, 80%)' },
      { name: 'Soft Pink', value: 'hsl(330, 100%, 70%)' },
      { name: 'Bright Pink', value: 'hsl(330, 100%, 60%)' },
      { name: 'Hot Pink', value: 'hsl(330, 100%, 50%)' }
    ]
  },
  stars: {
    light: [
      { name: 'Gold', value: 'hsl(50, 100%, 50%)' },
      { name: 'Dark Gold', value: 'hsl(50, 100%, 40%)' },
      { name: 'Bronze', value: 'hsl(50, 100%, 30%)' },
      { name: 'Dark Bronze', value: 'hsl(50, 100%, 20%)' }
    ],
    dark: [
      { name: 'Light Gold', value: 'hsl(50, 100%, 80%)' },
      { name: 'Bright Gold', value: 'hsl(50, 100%, 70%)' },
      { name: 'Yellow Gold', value: 'hsl(50, 100%, 60%)' },
      { name: 'Rich Gold', value: 'hsl(50, 100%, 50%)' }
    ]
  },
  gradient: {
    light: [
      { name: 'Orange', value: 'hsl(25, 100%, 50%)' },
      { name: 'Deep Orange', value: 'hsl(25, 100%, 40%)' },
      { name: 'Burnt Orange', value: 'hsl(25, 100%, 30%)' },
      { name: 'Dark Orange', value: 'hsl(25, 100%, 20%)' }
    ],
    dark: [
      { name: 'Light Orange', value: 'hsl(25, 100%, 80%)' },
      { name: 'Peach', value: 'hsl(25, 100%, 70%)' },
      { name: 'Bright Orange', value: 'hsl(25, 100%, 60%)' },
      { name: 'Vibrant Orange', value: 'hsl(25, 100%, 50%)' }
    ]
  },
  kawaii: {
    light: [
      { name: 'Green', value: 'hsl(120, 100%, 40%)' },
      { name: 'Forest Green', value: 'hsl(120, 100%, 30%)' },
      { name: 'Dark Green', value: 'hsl(120, 100%, 20%)' },
      { name: 'Deep Green', value: 'hsl(120, 100%, 15%)' }
    ],
    dark: [
      { name: 'Light Green', value: 'hsl(120, 100%, 80%)' },
      { name: 'Mint Green', value: 'hsl(120, 100%, 70%)' },
      { name: 'Bright Green', value: 'hsl(120, 100%, 60%)' },
      { name: 'Lime Green', value: 'hsl(120, 100%, 50%)' }
    ]
  },
  geometric: {
    light: [
      { name: 'Indigo', value: 'hsl(240, 100%, 50%)' },
      { name: 'Deep Indigo', value: 'hsl(240, 100%, 40%)' },
      { name: 'Dark Indigo', value: 'hsl(240, 100%, 30%)' },
      { name: 'Navy Indigo', value: 'hsl(240, 100%, 20%)' }
    ],
    dark: [
      { name: 'Light Indigo', value: 'hsl(240, 100%, 80%)' },
      { name: 'Soft Indigo', value: 'hsl(240, 100%, 70%)' },
      { name: 'Bright Indigo', value: 'hsl(240, 100%, 60%)' },
      { name: 'Electric Indigo', value: 'hsl(240, 100%, 50%)' }
    ]
  }
};

export { WALLPAPERS, WALLPAPER_COLOR_SHADES };
export type { Wallpaper, Theme };