import { Menu, Moon, Sun, Settings, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from './theme-provider';
import { useLocation, useNavigate } from 'react-router-dom';

export function Header() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isEditorPage = location.pathname.startsWith('/editor');

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border/40 bg-background/95 backdrop-blur-sm px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold gradient-text hidden md:block">
            Bolt-Chef Unified
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isEditorPage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/editor')}
          >
            New Project
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
