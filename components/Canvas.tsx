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
      <Card className="p-4 bg-card/95 backdrop-blur-sm glass-sidebar overflow-y-auto">
        <canvas
          ref={ref}
          width={canvasSize}
          height={canvasSize}
          className="border border-border cursor-crosshair bg-white dark:bg-gray-900 rounded"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />
      </Card>
    );
  }
);

Canvas.displayName = 'Canvas';