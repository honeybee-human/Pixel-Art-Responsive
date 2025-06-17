export type Tool = 'pencil' | 'eraser' | 'fill';

export interface PixelArtEditorProps {
  className?: string;
}

export interface CanvasProps {
  canvasSize: number;
  onMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

export interface PixelChange {
  x: number;
  y: number;
  oldColor: string;
  newColor: string;
  }
  
 export  interface DrawAction {
  type: 'draw' | 'erase' | 'fill';
  changes: PixelChange[];
  }
