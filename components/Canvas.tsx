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
    // Calculate card dimensions to fit canvas + padding
    const cardPadding = 16; // 8px on each side for p-2, 16px for md:p-4
    const cardSize = canvasSize + (cardPadding * 2);
    
    return (
      <Card 
        className="p-2 md:p-4 bg-card/95 backdrop-blur-sm solid-sidebar"
        style={{
          width: `${cardSize}px`,
          maxWidth: '100%',
          height: 'fit-content'
        }}
      >
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
            // Touch event handlers for mobile support
            onTouchStart={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true
              });
              onMouseDown(mouseEvent as any);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              const touch = e.touches[0];
              const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY,
                bubbles: true
              });
              onMouseMove(mouseEvent as any);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              onMouseUp();
            }}
          />
        </div>
      </Card>
    );
  }
);

Canvas.displayName = 'Canvas';