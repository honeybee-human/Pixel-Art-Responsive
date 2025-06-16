import { ThemeProvider } from './contexts/ThemeContext';
import { PixelArtEditor } from './components/PixelArtEditor';

function App() {
  return (
    <ThemeProvider>
      <PixelArtEditor />
    </ThemeProvider>
  );
}

export default App;