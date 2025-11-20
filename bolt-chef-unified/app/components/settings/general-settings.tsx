import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/components/theme-provider';

export function GeneralSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">System Default</p>
              <p className="text-sm text-muted-foreground">
                Follow your system's theme setting
              </p>
            </div>
            <Switch
              checked={theme === 'system'}
              onCheckedChange={(checked) => checked && setTheme('system')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Light Mode</p>
              <p className="text-sm text-muted-foreground">
                Use light theme
              </p>
            </div>
            <Switch
              checked={theme === 'light'}
              onCheckedChange={(checked) => checked && setTheme('light')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Use dark theme
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => checked && setTheme('dark')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Editor Settings</CardTitle>
          <CardDescription>Configure your code editor preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Font Size</label>
            <Input type="number" defaultValue={14} min={10} max={24} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Tab Size</label>
            <Input type="number" defaultValue={2} min={2} max={8} className="mt-1" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Word Wrap</p>
              <p className="text-sm text-muted-foreground">
                Wrap long lines
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Minimap</p>
              <p className="text-sm text-muted-foreground">
                Show code minimap
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Settings</CardTitle>
          <CardDescription>Configure default AI model and parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Default Provider</label>
            <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>OpenAI</option>
              <option>Anthropic</option>
              <option>Google</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Default Model</label>
            <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>GPT-4o</option>
              <option>GPT-4o Mini</option>
              <option>Claude 3.5 Sonnet</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Max Tokens</label>
            <Input type="number" defaultValue={4000} min={100} max={32000} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
