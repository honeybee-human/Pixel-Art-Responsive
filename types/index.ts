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