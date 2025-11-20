import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { Layout } from './components/layout';
import { HomePage } from './pages/home';
import { EditorPage } from './pages/editor';
import { SettingsPage } from './pages/settings';
import './index.css';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bolt-chef-ui-theme">
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/editor/:projectId?" element={<EditorPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Layout>
          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
