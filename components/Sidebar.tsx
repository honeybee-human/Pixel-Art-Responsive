import React from 'react';
import { Separator } from './ui/separator';
import { ToolsSection } from './sidebar/ToolsSection';
import { ActionsSection } from './sidebar/ActionsSection';
import { ColorSection } from './sidebar/ColorSection';
import { GridSizeSection } from './sidebar/GridSizeSection';
import { PresetsSection } from './sidebar/PresetsSection';
import { WallpaperSection } from './sidebar/WallpaperSection';

export function Sidebar() {
  return (
    <div className="w-80 p-4 glass-sidebar overflow-y-auto">
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