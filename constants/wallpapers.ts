export type Wallpaper = 'default' | 'dots' | 'hearts' | 'stars' | 'gradient' | 'kawaii';

export const WALLPAPERS = {
  default: {
    name: 'Default',
    style: 'bg-background'
  },
  dots: {
    name: 'Polka Dots',
    style: 'bg-purple-50',
    pattern: 'radial-gradient(circle at 20px 20px, rgba(147,51,234,0.4) 2px, transparent 2px)'
  },
  hearts: {
    name: 'Hearts',
    style: 'bg-pink-50',
    pattern: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ec4899' fill-opacity='0.3'%3E%3Cpath d='M20 30c-4-6-8-10-8-14 0-4 4-6 8-2 4-4 8-2 8 2 0 4-4 8-8 14z'/%3E%3C/g%3E%3C/svg%3E")`
  },
  stars: {
    name: 'Stars',
    style: 'bg-yellow-50',
    pattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23eab308' fill-opacity='0.4'%3E%3Cpath d='M30 15l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  },
  gradient: {
    name: 'Rainbow',
    style: 'bg-rainbow-gradient'
  },
  kawaii: {
    name: 'Flowers',
    style: 'bg-green-50',
    pattern: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.3'%3E%3Cpath d='M25 15c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M25 27c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M15 21c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Cpath d='M35 21c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4zm0 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3Ccircle cx='25' cy='25' r='2' fill='%23fbbf24'/%3E%3C/g%3E%3C/svg%3E")`
  }
};