import { Separator } from './ui/separator';
import { ToolsSection } from './sidebar/ToolsSection';
import { ActionsSection } from './sidebar/ActionsSection';
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
        w-80 p-4 glass-sidebar overflow-y-auto h-full
        ${isMobile ? 'shadow-lg' : ''}
      `}
    >
      {isMobile && (
        <div className="flex justify-end items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        <ToolsSection />
        <Separator />
        <ActionsSection />
        <Separator />
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