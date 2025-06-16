import { useReducer } from 'react';
import { Tool } from '../types';
import { Wallpaper } from '../constants/wallpapers';

type EditorState = {
  currentTool: Tool;
  currentColor: string;
  customColor: string;
  gridSize: number;
  wallpaper: Wallpaper;
};

type EditorAction = 
  | { type: 'SET_TOOL'; payload: Tool }
  | { type: 'SET_COLOR'; payload: string }
  | { type: 'SET_CUSTOM_COLOR'; payload: string }
  | { type: 'SET_GRID_SIZE'; payload: number }
  | { type: 'SET_WALLPAPER'; payload: Wallpaper }
  | { type: 'RESET_TO_DEFAULTS' };

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, currentTool: action.payload };
    case 'SET_COLOR':
      return { ...state, currentColor: action.payload };
    case 'SET_CUSTOM_COLOR':
      return { ...state, customColor: action.payload, currentColor: action.payload };
    case 'SET_GRID_SIZE':
      return { ...state, gridSize: action.payload };
    case 'SET_WALLPAPER':
      return { ...state, wallpaper: action.payload };
    case 'RESET_TO_DEFAULTS':
      return {
        currentTool: 'pencil',
        currentColor: '#000000',
        customColor: '#000000',
        gridSize: 16,
        wallpaper: 'default'
      };
    default:
      return state;
  }
}

export function useEditorReducer() {
  const [state, dispatch] = useReducer(editorReducer, {
    currentTool: 'pencil',
    currentColor: '#000000',
    customColor: '#000000',
    gridSize: 16,
    wallpaper: 'default'
  });

  return { state, dispatch };
}