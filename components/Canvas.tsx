import React, { forwardRef } from 'react';
import { Card } from './ui/card';

interface CanvasProps {
  canvasSize: number;
  onMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ canvasSize, onMouseDown, onMouseMove, onMouseUp, onMouseLeave }, ref) => {
    return (
      <Card className="p-2 md:p-4 bg-card/95 backdrop-blur-sm glass-sidebar w-full max-w-full">
        <div className="flex justify-center">
          <canvas
            ref={ref}
            width={canvasSize}
            height={canvasSize}
            className="border border-border cursor-crosshair bg-white dark:bg-white rounded max-w-full max-h-full"
            style={{ 
              width: `${canvasSize}px`, 
              height: `${canvasSize}px`,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          />
        </div>
      </Card>
    );
  }
);

Canvas.displayName = 'Canvas';