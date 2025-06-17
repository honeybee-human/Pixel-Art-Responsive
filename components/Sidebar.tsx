import { Separator } from './ui/separator';
import { ColorSection } from './sidebar/ColorSection';
import { GridSizeSection } from './sidebar/GridSizeSection';
import { PresetsSection } from './sidebar/PresetsSection';
import { WallpaperSection } from './sidebar/WallpaperSection';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isMobile, onClose }: SidebarProps) {
  return (
    <div 
      id="sidebar"
      className={`
        w-96 p-6 glass-sidebar overflow-y-auto h-full
        ${isMobile ? 'shadow-lg' : ''}
      `}
    >
      {isMobile && (
        <div className="flex justify-end items-center mb-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
          >
            <X size={24} />
          </Button>
        </div>
      )}
      
      <div className="space-y-8">
        <GridSizeSection />
        <Separator />
        <WallpaperSection />
        <Separator />
        <ColorSection />
        <Separator />
        <PresetsSection />
      </div>
    </div>
  );
}